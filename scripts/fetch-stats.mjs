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

/* ---------------- Plataformas ---------------- */
const sources = {
  async youtube() {
    if (!env.YT_API_KEY) return null;
    const by = env.YT_CHANNEL_ID ? `id=${env.YT_CHANNEL_ID}` : `forHandle=@${HANDLE}`;
    const j = await get(`https://www.googleapis.com/youtube/v3/channels?part=statistics&${by}&key=${env.YT_API_KEY}`);
    const s = j.items?.[0]?.statistics;
    if (!s) throw new Error("canal no encontrado");
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
      out.platforms[id] = Object.keys(fallback).length ? { ...fallback, source: fallback.source || "manual" } : null;
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

// Solo cambia la fecha si cambió algún número o estado: así la Action no commitea de más.
const same = JSON.stringify({ p: out.platforms, l: out.live }) === JSON.stringify({ p: prev.platforms, l: prev.live || {} });
out.updated = same && prev.updated ? prev.updated : new Date().toISOString();
await writeFile(OUT, JSON.stringify({ updated: out.updated, platforms: out.platforms, live: out.live }, null, 2) + "\n");
console.log(same ? "Sin cambios." : `Guardado ${OUT}.`);
