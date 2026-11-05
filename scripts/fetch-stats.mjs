// Genera data/stats.json con las métricas de cada red.
// Kick no tiene API de seguidores: se carga a mano en data/stats.manual.json.
// Lo ejecuta la GitHub Action .github/workflows/stats.yml (cada hora).
// Cada plataforma es independiente: si una falla o no tiene credenciales,
// se conserva el último valor conocido o el de data/stats.manual.json.
//
// Uso local: node scripts/fetch-stats.mjs  (con las variables de entorno del README)

import { readFile, writeFile, mkdir } from "node:fs/promises";

const OUT = "data/stats.json";
const MANUAL = "data/stats.manual.json";
const SECRETS_DIR = ".secrets-out"; // tokens renovados para que la Action actualice los secrets
const env = process.env;
const HANDLE = env.LUKY_HANDLE || "lukychill";

const readJSON = async (p, fb) => { try { return JSON.parse(await readFile(p, "utf8")); } catch { return fb; } };
const prev = await readJSON(OUT, { platforms: {}, live: {} });
const manual = await readJSON(MANUAL, { platforms: {} });

async function get(url, opts = {}) {
  const r = await fetch(url, { ...opts, signal: AbortSignal.timeout(20000) });
  const text = await r.text();
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url.split("?")[0]}: ${text.slice(0, 200)}`);
  return JSON.parse(text);
}
async function saveSecret(name, value) {
  if (!value) return;
  await mkdir(SECRETS_DIR, { recursive: true });
  await writeFile(`${SECRETS_DIR}/${name}`, value);
}
const num = (v) => (v === undefined || v === null || v === "" ? null : Number(v));


/* ---------------- Datos extra: últimos videos, audiencia y Rocket League ---------------- */
const extras = { youtubeLatest: null, audience: { instagram: null, youtube: null } };

async function youtubeLatest(uploads) {
  if (!uploads) return null;
  const pl = await get(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&maxResults=8&playlistId=${uploads}&key=${env.YT_API_KEY}`);
  const ids = (pl.items || []).map((i) => i.contentDetails.videoId);
  if (!ids.length) return [];
  const v = await get(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${ids.join(",")}&key=${env.YT_API_KEY}`);
  return (v.items || []).map((x) => ({ id: x.id, title: x.snippet.title, published: x.snippet.publishedAt, views: num(x.statistics.viewCount), likes: num(x.statistics.likeCount) }));
}

async function instagramAudience() {
  const base = `https://graph.instagram.com/v21.0/me/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&access_token=${env.IG_ACCESS_TOKEN}`;
  const out = {};
  for (const b of ["age", "gender", "country"]) {
    const j = await get(`${base}&breakdown=${b}`);
    const res = j.data?.[0]?.total_value?.breakdowns?.[0]?.results || [];
    out[b] = Object.fromEntries(res.map((r) => [r.dimension_values[0], r.value]));
  }
  return out;
}

async function youtubeAudience() {
  if (!env.YT_CLIENT_ID || !env.YT_CLIENT_SECRET || !env.YT_REFRESH_TOKEN) return null;
  const tok = await get("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: env.YT_CLIENT_ID, client_secret: env.YT_CLIENT_SECRET, refresh_token: env.YT_REFRESH_TOKEN, grant_type: "refresh_token" })
  });
  const h = { Authorization: `Bearer ${tok.access_token}` };
  const end = new Date().toISOString().slice(0, 10);
  const start = new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10);
  const q = (p) => get(`https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=${start}&endDate=${end}&${p}`, { headers: h });
  const ag = await q("metrics=viewerPercentage&dimensions=ageGroup,gender");
  const ct = await q("metrics=views&dimensions=country&sort=-views&maxResults=6");
  const age = {}, gender = {};
  for (const [a, g, pct] of ag.rows || []) {
    const k = a.replace("age", "");
    age[k] = (age[k] || 0) + pct;
    gender[g] = (gender[g] || 0) + pct;
  }
  return { age, gender, country: Object.fromEntries((ct.rows || []).map(([c, v]) => [c, v])), period: "12m" };
}

/* ---------------- Plataformas ---------------- */
const sources = {
  async youtube() {
    if (!env.YT_API_KEY) return null;
    const by = env.YT_CHANNEL_ID ? `id=${env.YT_CHANNEL_ID}` : `forHandle=@${HANDLE}`;
    const j = await get(`https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&${by}&key=${env.YT_API_KEY}`);
    const s = j.items?.[0]?.statistics;
    if (!s) throw new Error("canal no encontrado");
    try { extras.youtubeLatest = await youtubeLatest(j.items[0].contentDetails?.relatedPlaylists?.uploads); }
    catch (e) { console.warn("  youtube: no se pudieron leer los últimos videos:", e.message); }
    return { data: { followers: s.hiddenSubscriberCount ? null : num(s.subscriberCount), views: num(s.viewCount), videos: num(s.videoCount) } };
  },

  async twitch() {
    if (!env.TWITCH_CLIENT_ID || !env.TWITCH_CLIENT_SECRET) return null;
    const tok = await get(`https://id.twitch.tv/oauth2/token?client_id=${env.TWITCH_CLIENT_ID}&client_secret=${env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`, { method: "POST" });
    const h = { "Client-Id": env.TWITCH_CLIENT_ID, Authorization: `Bearer ${tok.access_token}` };
    const login = env.TWITCH_LOGIN || HANDLE;
    const u = await get(`https://api.twitch.tv/helix/users?login=${login}`, { headers: h });
    const id = u.data?.[0]?.id;
    if (!id) throw new Error("usuario no encontrado");
    const [f, s] = await Promise.all([
      get(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${id}`, { headers: h }),
      get(`https://api.twitch.tv/helix/streams?user_id=${id}`, { headers: h })
    ]);
    return { data: { followers: num(f.total) }, live: (s.data || []).length > 0 };
  },

  async instagram() {
    if (!env.IG_ACCESS_TOKEN) return null;
    const j = await get(`https://graph.instagram.com/me?fields=username,followers_count,media_count&access_token=${env.IG_ACCESS_TOKEN}`);
    // Los tokens de larga duración vencen a los 60 días: se renuevan en cada corrida.
    try {
      const r = await get(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${env.IG_ACCESS_TOKEN}`);
      await saveSecret("IG_ACCESS_TOKEN", r.access_token);
    } catch (e) { console.warn("  instagram: no se pudo renovar el token:", e.message); }
    try { extras.audience.instagram = await instagramAudience(); }
    catch (e) { console.warn("  instagram: sin datos demográficos (falta el permiso instagram_business_manage_insights):", e.message.slice(0, 120)); }
    return { data: { followers: num(j.followers_count), videos: num(j.media_count) } };
  },

  async tiktok() {
    if (!env.TIKTOK_CLIENT_KEY || !env.TIKTOK_CLIENT_SECRET || !env.TIKTOK_REFRESH_TOKEN) return null;
    const tok = await get("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_key: env.TIKTOK_CLIENT_KEY, client_secret: env.TIKTOK_CLIENT_SECRET, grant_type: "refresh_token", refresh_token: env.TIKTOK_REFRESH_TOKEN })
    });
    if (tok.refresh_token && tok.refresh_token !== env.TIKTOK_REFRESH_TOKEN) await saveSecret("TIKTOK_REFRESH_TOKEN", tok.refresh_token);
    const j = await get("https://open.tiktokapis.com/v2/user/info/?fields=follower_count,likes_count,video_count", { headers: { Authorization: `Bearer ${tok.access_token}` } });
    const u = j.data?.user;
    if (!u) throw new Error(j.error?.message || "respuesta sin usuario");
    return { data: { followers: num(u.follower_count), likes: num(u.likes_count), videos: num(u.video_count) } };
  }

};

/* ---------------- Ejecución ---------------- */
const out = { platforms: {}, live: {} };
// Redes sin API: solo valores manuales.
for (const id of ["kick"]) {
  const m = manual.platforms?.[id];
  out.platforms[id] = m && m.followers ? { followers: m.followers, source: "manual" } : null;
}
for (const [id, fn] of Object.entries(sources)) {
  const fallback = { ...(manual.platforms?.[id] || {}), ...(prev.platforms?.[id] || {}) };
  try {
    const r = await fn();
    if (!r) {
      const m = manual.platforms?.[id];
      out.platforms[id] = m && m.followers ? { ...m, source: "manual" } : Object.keys(fallback).length ? { ...fallback, source: fallback.source || "manual" } : null;
      console.log(`- ${id}: sin credenciales, uso valor ${out.platforms[id] ? "guardado" : "vacío"}`);
    } else {
      const merged = { ...fallback, ...Object.fromEntries(Object.entries(r.data).filter(([, v]) => v !== null)), source: "api" };
      delete merged._comment;
      out.platforms[id] = merged;
      if (r.live !== undefined) out.live[id] = r.live;
      console.log(`✓ ${id}: ${merged.followers ?? "—"} seguidores${r.live ? " · EN VIVO" : ""}`);
    }
  } catch (e) {
    out.platforms[id] = Object.keys(fallback).length ? fallback : null;
    console.warn(`✗ ${id}: ${e.message} (se conserva el último valor)`);
  }
  if (out.live[id] === undefined && prev.live?.[id] !== undefined && id === "twitch") out.live[id] = false;
}

try { extras.audience.youtube = await youtubeAudience(); if (extras.audience.youtube) console.log("✓ youtube: audiencia"); }
catch (e) { console.warn("✗ youtube audiencia:", e.message.slice(0, 160)); }

const final = {
  platforms: out.platforms,
  live: out.live,
  youtubeLatest: extras.youtubeLatest || prev.youtubeLatest || null,
  audience: { instagram: extras.audience.instagram || prev.audience?.instagram || null, youtube: extras.audience.youtube || prev.audience?.youtube || null },
  // Rocket League: Tracker Network no tiene API pública, se carga a mano en data/stats.manual.json.
  rl: manual.rl || null
};
// Solo cambia la fecha si cambió algún dato: así la Action no commitea de más.
const strip = (o) => JSON.stringify(o);
const same = strip(final) === strip({ platforms: prev.platforms, live: prev.live || {}, youtubeLatest: prev.youtubeLatest || null, audience: prev.audience || { instagram: null, youtube: null }, rl: prev.rl || null });
const updated = same && prev.updated ? prev.updated : new Date().toISOString();
await writeFile(OUT, JSON.stringify({ updated, ...final }, null, 2) + "\n");
console.log(same ? "Sin cambios." : `Guardado ${OUT}.`);
