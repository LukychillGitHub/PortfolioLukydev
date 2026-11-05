# LukyOS · lukychill.com

Portfolio de **Lucas Román Fernández** con forma de sistema operativo: una pantalla de inicio, un login con dos usuarios y un escritorio con ventanas, dock y buscador.

- **Lucas Fernández** (trabajo): Sobre mí, Casos resueltos, Trayectoria, Formación, Terminal, Currículum y Contacto.
- **Lukychill** (redes): Stats con métricas en vivo, Rango, Videos, Colaboraciones y Lo que viene.

Está en **español e inglés**: selector ES / EN en la barra de arriba y en el login; `?lang=en` abre directo en inglés. Los textos en inglés están en `assets/js/content-en.js` (misma estructura que `content.js`) y los de la interfaz en `lukyos.js` (objeto `T`).

Atajos: `⌘K` / `Ctrl+K` abre el buscador, `Esc` cierra la ventana de adelante. Los enlaces `lukychill.com/#lucas` y `lukychill.com/#lukychill` entran directo a cada usuario.

## Estructura

```
index.html                 estructura, SEO y versión sin JavaScript
assets/css/lukyos.css      estilos (los dos temas: Lucas claro, Lukychill oscuro)
assets/js/content.js       TODO el contenido en español: casos, trabajos, habilidades, redes, colaboraciones
assets/js/content-en.js    el mismo contenido en inglés
assets/js/lukyos.js        el sistema: ventanas, dock, buscador, formulario, métricas
assets/cv/                 CV en español e inglés
assets/img/                fotos, favicon e imagen para compartir (og.png)
data/stats.json            métricas (lo escribe la GitHub Action)
data/stats.manual.json     valores de respaldo (Kick, o redes sin API configurada)
scripts/fetch-stats.mjs    consulta las APIs y genera data/stats.json
.github/workflows/stats.yml corre el script cada hora
```

Para cambiar textos, sumar un caso o un clip, editá solo `assets/js/content.js`.

## Métricas automáticas

La Action **Actualizar métricas** corre cada hora, consulta cada red y hace commit de `data/stats.json` solo si algo cambió. Cada red es independiente: si una falla o todavía no tiene credenciales, se conserva el último valor. El sitio suma los seguidores de todas las redes sincronizadas.

Las credenciales se cargan en **Settings → Secrets and variables → Actions → New repository secret**. Nunca van en el código.

| Red | Qué se obtiene | Secrets |
|---|---|---|
| YouTube | suscriptores, vistas, videos | `YT_API_KEY` (opcional `YT_CHANNEL_ID`) |
| Twitch | seguidores, en vivo | `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET` |
| Instagram | seguidores, publicaciones | `IG_ACCESS_TOKEN` |
| TikTok | seguidores, likes, videos | `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_REFRESH_TOKEN` |
| Kick | en vivo (la API no informa seguidores) | `KICK_CLIENT_ID`, `KICK_CLIENT_SECRET` |
| Renovación de tokens | guarda los tokens nuevos de Instagram y TikTok | `GH_PAT` |

### YouTube
1. En [Google Cloud Console](https://console.cloud.google.com/) creá un proyecto (o usá el del bot de videos) y habilitá **YouTube Data API v3**.
2. Credenciales → Crear credenciales → **Clave de API**. Restringila a YouTube Data API v3.
3. Guardala como `YT_API_KEY`. El script busca el canal por el handle `@lukychill`; si preferís, cargá el ID del canal en `YT_CHANNEL_ID`.

### Twitch
1. En [dev.twitch.tv/console](https://dev.twitch.tv/console) → Registrar aplicación (URL de redirección: `http://localhost`, categoría: Website Integration).
2. Copiá el **Client ID** y generá un **Client Secret**. Guardalos como `TWITCH_CLIENT_ID` y `TWITCH_CLIENT_SECRET`.

### Instagram
Sirve el mismo tipo de token de larga duración (60 días) que ya usa el bot de videos con Instagram Login.
1. Guardalo como `IG_ACCESS_TOKEN`.
2. El script lo renueva en cada corrida. Para que el token renovado se guarde solo, cargá también `GH_PAT` (abajo). Sin `GH_PAT`, hay que reemplazarlo a mano antes de los 60 días.

### TikTok
1. En [developers.tiktok.com](https://developers.tiktok.com/) creá una app con **Login Kit** y los permisos `user.info.basic` y `user.info.stats`.
2. Autorizá la app con tu cuenta (flujo OAuth) y guardá el **refresh token** como `TIKTOK_REFRESH_TOKEN`, junto con `TIKTOK_CLIENT_KEY` y `TIKTOK_CLIENT_SECRET`.
3. TikTok entrega un refresh token nuevo al renovarse; con `GH_PAT` se actualiza solo.

### Kick
1. En la configuración de desarrollador de Kick creá una app y copiá **Client ID** y **Client Secret** como `KICK_CLIENT_ID` y `KICK_CLIENT_SECRET`.
2. La API pública no informa seguidores: actualizá `followers` de Kick en `data/stats.manual.json` cuando quieras.

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
