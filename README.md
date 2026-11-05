# LukyOS · lukychill.com

Portfolio de **Lucas Román Fernández** con forma de sistema operativo: una pantalla de inicio, un login con dos usuarios y un escritorio con ventanas, dock y buscador.

- **Lucas Fernández** (trabajo): Sobre mí, Casos resueltos, Trayectoria, Formación, Terminal, Currículum y Contacto.
- **Lukychill** (redes): Stats con métricas en vivo, Videos (TikToks más vistos con reproductor y últimos de YouTube), Audiencia (demografía de YouTube e Instagram), Rango de Rocket League e Historia del canal.

Está en **español e inglés**: selector ES / EN en la barra de arriba y en el login; `?lang=en` abre directo en inglés. Los textos en inglés están en `assets/js/content-en.js` (misma estructura que `content.js`) y los de la interfaz en `lukyos.js` (objeto `T`).

Atajos: `⌘K` / `Ctrl+K` abre el buscador, `Esc` cierra la ventana de adelante. Los enlaces `lukychill.com/#lucas` y `lukychill.com/#lukychill` entran directo a cada usuario.

## Estructura

```
index.html                 estructura, SEO y versión sin JavaScript
assets/css/lukyos.css      estilos (los dos temas: Lucas claro, Lukychill oscuro)
assets/js/content.js       TODO el contenido en español: casos, trabajos, habilidades, redes, historia del canal
assets/js/content-en.js    el mismo contenido en inglés
assets/js/videos.js        lista de TikToks (id, vistas, duración, categoría)
assets/js/logos.js         logos de las redes (Simple Icons, CC0)
assets/js/lukyos.js        el sistema: ventanas, dock, buscador, formulario, métricas
assets/cv/                 CV en español e inglés
assets/img/                fotos, capturas de proyectos, favicon e imagen para compartir (og.png)
data/stats.json            métricas (lo escribe la GitHub Action)
data/stats.manual.json     valores a mano: TikTok, Kick y respaldo de Rocket League
scripts/fetch-stats.mjs    consulta las APIs y genera data/stats.json
scripts/youtube-auth.mjs   autoriza una vez YouTube Analytics (audiencia)
.github/workflows/stats.yml corre el script cada hora
```

Para cambiar textos o sumar un caso, editá `assets/js/content.js` (y `content-en.js`). Para sumar un TikTok, agregalo en `assets/js/videos.js`; para meterlo en una etapa de la historia, poné su id en `story[].videos`.

## Métricas automáticas

La Action **Actualizar métricas** corre cada hora, consulta YouTube, Twitch, Instagram y TikTok y hace commit de `data/stats.json` solo si algo cambió. Cada red es independiente: si una falla o todavía no tiene credenciales, se conserva el último valor. El sitio suma los seguidores de todas las redes sincronizadas.

Las credenciales se cargan en **Settings → Secrets and variables → Actions → New repository secret**. Nunca van en el código.

| Red | Qué se obtiene | Secrets |
|---|---|---|
| YouTube | suscriptores, vistas, videos y últimos 8 videos | `YT_API_KEY` (opcional `YT_CHANNEL_ID`) |
| YouTube (audiencia) | edad, género y países | `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN` |
| Twitch | seguidores, en vivo | `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET` |
| Instagram | seguidores, publicaciones y audiencia | `IG_ACCESS_TOKEN` (con permiso de estadísticas) |
| TikTok | seguidores, likes, videos | `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_REFRESH_TOKEN` |
| Kick | se carga a mano en `data/stats.manual.json` (no tiene API de seguidores) | — |
| Rocket League | rangos, MMR, picos y carrera (API oficial de Tracker Network) | `TRN_API_KEY` |
| Renovación de tokens | guarda los tokens nuevos de Instagram y TikTok | `GH_PAT` |

### YouTube
1. En [Google Cloud Console](https://console.cloud.google.com/) creá un proyecto (o usá el del bot de videos) y habilitá **YouTube Data API v3**.
2. Credenciales → Crear credenciales → **Clave de API**. Restringila a YouTube Data API v3.
3. Guardala como `YT_API_KEY`. El script busca el canal por el handle `@lukychill`; si preferís, cargá el ID del canal en `YT_CHANNEL_ID`.

### YouTube: audiencia (edad, género, países)
Los datos de audiencia son privados del canal, así que hace falta autorizar una vez con tu cuenta:
1. En Google Cloud, en el mismo proyecto: habilitá **YouTube Analytics API**.
2. Credenciales → Crear credenciales → **ID de cliente de OAuth** → tipo **App de escritorio**. Copiá el *Client ID* y el *Client secret*.
3. Si la pantalla de consentimiento está en modo *Testing*, agregá tu cuenta como usuario de prueba. Ojo: en *Testing* el token vence a los 7 días; para que dure, pasala a **En producción** (no requiere verificación para uso propio).
4. En tu computadora, dentro del repo: `YT_CLIENT_ID=... YT_CLIENT_SECRET=... node scripts/youtube-auth.mjs`. Abrí el link, iniciá sesión con la cuenta del canal y aceptá.
5. Guardá `YT_CLIENT_ID`, `YT_CLIENT_SECRET` y el `YT_REFRESH_TOKEN` que imprime el script como secrets.

### Twitch
1. En [dev.twitch.tv/console](https://dev.twitch.tv/console) → Registrar aplicación (URL de redirección: `http://localhost`, categoría: Website Integration).
2. Copiá el **Client ID** y generá un **Client Secret**. Guardalos como `TWITCH_CLIENT_ID` y `TWITCH_CLIENT_SECRET`.

### Instagram
Sirve el mismo tipo de token de larga duración (60 días) que ya usa el bot de videos con Instagram Login.
1. Guardalo como `IG_ACCESS_TOKEN`.
2. Para la **audiencia**: al generar el token en Meta (Instagram → API setup with Instagram login), la app tiene que tener el permiso **instagram_business_manage_insights**. Agregalo en *Permisos* y generá el token de nuevo. Instagram solo muestra demografía si la cuenta tiene más de 100 seguidores.
3. El script lo renueva en cada corrida. Para que el token renovado se guarde solo, cargá también `GH_PAT` (abajo). Sin `GH_PAT`, hay que reemplazarlo a mano antes de los 60 días.

### TikTok
1. En [developers.tiktok.com](https://developers.tiktok.com/) creá una app con **Login Kit** y los permisos `user.info.basic` y `user.info.stats`.
2. Autorizá la app con tu cuenta (flujo OAuth) y guardá el **refresh token** como `TIKTOK_REFRESH_TOKEN`, junto con `TIKTOK_CLIENT_KEY` y `TIKTOK_CLIENT_SECRET`.
3. TikTok entrega un refresh token nuevo al renovarse; con `GH_PAT` se actualiza solo.

### Kick
Kick no ofrece la cantidad de seguidores por API. Para mostrarla, editá `kick.followers` en `data/stats.manual.json`; si queda vacío, la tarjeta muestra el link al canal.

### Rocket League
Usa la API oficial de Tracker Network con tu clave de desarrollador.
1. Guardá la clave como secret `TRN_API_KEY`.
2. Opcional: si tu usuario de Epic cambia, agregá el secret `RL_EPIC` (por defecto `LukyChill`).
3. Si la API falla o no hay clave, el sitio muestra los últimos datos guardados o los de `data/stats.manual.json` → `rl`.

### GH_PAT (renovación automática de tokens)
1. GitHub → Settings → Developer settings → **Fine-grained tokens** → Generate new token.
2. Repository access: solo `PortfolioLukydev`. Permissions → Repository → **Secrets: Read and write**.
3. Guardalo como `GH_PAT`.

### Probar
Actions → **Actualizar métricas** → Run workflow. El log muestra ✓ o ✗ por cada red sin exponer las credenciales.

## Formulario de contacto
Envía con Formspree (`assets/js/content.js` → `formspree`). Los mensajes llegan al mail configurado en Formspree.

## Publicación
GitHub Pages publica la rama `main` en `lukychill.com` (archivo `CNAME`).
