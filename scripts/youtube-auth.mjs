// Autoriza una sola vez la lectura de YouTube Analytics y muestra el refresh token
// para guardarlo como secret YT_REFRESH_TOKEN en GitHub.
//
// Uso (en tu computadora, con Node 18 o más):
//   YT_CLIENT_ID=xxx YT_CLIENT_SECRET=yyy node scripts/youtube-auth.mjs
// En Windows (PowerShell):
//   $env:YT_CLIENT_ID="xxx"; $env:YT_CLIENT_SECRET="yyy"; node scripts/youtube-auth.mjs
//
// El cliente OAuth tiene que ser de tipo "App de escritorio" en Google Cloud.

import http from "node:http";

const { YT_CLIENT_ID: id, YT_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error("Faltan YT_CLIENT_ID y YT_CLIENT_SECRET.");
  process.exit(1);
}
const PORT = 8085, REDIRECT = `http://localhost:${PORT}`;
const scope = "https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/youtube.readonly";
const url = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({ client_id: id, redirect_uri: REDIRECT, response_type: "code", scope, access_type: "offline", prompt: "consent" })}`;

console.log("\n1) Abrí este link e iniciá sesión con la cuenta de Google del canal de YouTube:\n\n" + url + "\n");
console.log("2) Aceptá los permisos. Vas a volver a una página que dice \"Listo\".\n");

http.createServer(async (req, res) => {
  const code = new URL(req.url, REDIRECT).searchParams.get("code");
  if (!code) { res.end("Esperando autorización…"); return; }
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: id, client_secret: secret, redirect_uri: REDIRECT, grant_type: "authorization_code" })
  });
  const j = await r.json();
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  if (!j.refresh_token) {
    res.end("No llegó el refresh token. Revisá la consola.");
    console.error("Respuesta de Google:", j);
    process.exit(1);
  }
  res.end("<h2>Listo. Ya podés cerrar esta pestaña.</h2>");
  console.log("3) Guardá estos tres valores como secrets del repo (Settings → Secrets and variables → Actions):\n");
  console.log("   YT_CLIENT_ID      =", id);
  console.log("   YT_CLIENT_SECRET  = (el mismo que usaste)");
  console.log("   YT_REFRESH_TOKEN  =", j.refresh_token, "\n");
  process.exit(0);
}).listen(PORT);
