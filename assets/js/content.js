/* Contenido del portfolio. Para actualizar textos, casos o enlaces, se edita solo este archivo. */
window.LUKY = {
  email: "lukychillcontacto@gmail.com",
  formspree: "https://formspree.io/f/mzzrbrnw",
  links: {
    linkedin: "https://linkedin.com/in/Lukychill",
    github: "https://github.com/LukychillGitHub",
    cvEs: "assets/cv/LucasFernandezCV-Spanish.pdf",
    cvEn: "assets/cv/LucasFernandezCV-English.pdf"
  },

  /* ---------------- Lucas (trabajo) ---------------- */
  study: { done: 22, total: 49, gpa: "9,23", since: 2024 },

  cases: [
    {
      id: "migraciones", side: "Migraciones SAP", tag: "Molinos Río de la Plata",
      title: "Integrar empresas adquiridas a SAP S/4HANA",
      lead: "Cada adquisición llega con sus propios datos maestros, formatos y reglas. El trabajo es que entren al sistema de Molinos sin frenar la operación del día siguiente.",
      timeline: [
        { name: "Bodegas Etchart", state: "Migrada" },
        { name: "NotCo", state: "Migrada" },
        { name: "Complejo Alimenticio San Salvador", state: "Migrada" },
        { name: "Grupo Ayudín", state: "Próxima", next: true }
      ],
      steps: [
        ["Problema", "Datos de la empresa adquirida que no siguen la estructura ni las reglas de negocio de Molinos."],
        ["Diagnóstico", "Relevar los objetos a migrar, mapear campos entre sistemas y detectar qué datos rompen validaciones antes de cargarlos."],
        ["Solución", "Especificación funcional y plantillas en SAP Migration Cockpit (LTMC/LTMOM), con cargas de prueba y corrección iterativa de errores."],
        ["Resultado", "Tres compañías integradas al sistema. La cuarta, Grupo Ayudín, es la próxima en la fila."]
      ],
      chips: ["SAP S/4HANA", "Migration Cockpit", "LTMC / LTMOM", "Datos maestros", "Análisis funcional"]
    },
    {
      id: "comex", side: "Incidentes Comex", tag: "Molinos Río de la Plata",
      title: "Resolver incidentes de Comercio Exterior en producción",
      lead: "Cuando un proceso de exportación o importación se traba, hay operaciones esperando. Trabajo como analista funcional: entender el negocio, encontrar la causa y cerrar el incidente.",
      steps: [
        ["Problema", "Un usuario reporta un proceso de Comex bloqueado o con datos inconsistentes."],
        ["Diagnóstico", "Reproducir el caso, seguir el dato entre sistemas y aislar si la causa es de configuración, de datos o de proceso."],
        ["Solución", "Corregir o coordinar el ajuste con el equipo técnico, validarlo con el usuario y documentarlo para la próxima vez."],
        ["Resultado", "Continuidad operativa y una base de conocimiento que acorta el tiempo del siguiente incidente parecido."]
      ],
      chips: ["Gestión de incidentes", "Análisis de causa raíz", "Análisis funcional", "Soporte a usuarios"]
    },
    {
      id: "bot", side: "Bot de videos", tag: "Proyecto propio · en producción",
      title: "Publicar un video en tres redes con un solo link",
      lead: "Republicar cada video a mano en cada plataforma es repetitivo. Armé un bot de Telegram en Python: le paso el link de un TikTok y lo guarda en Google Drive, lo sube como YouTube Short y como Reel de prueba de Instagram.",
      steps: [
        ["Problema", "El bot funcionaba en mi PC, pero en el servidor TikTok devolvía la página sin los datos del video."],
        ["Diagnóstico", "Descarté versión, cookies e impersonation de navegador. Inspeccionando el HTML vi que TikTok omite el bloque del video para IPs de datacenter."],
        ["Solución", "Cambié la estrategia de extracción por un servicio externo. Resolví además OAuth de Google con scopes incompatibles, tokens que vencían cada 7 días y cuatro errores encadenados en la autenticación de Instagram."],
        ["Resultado", "Corre 24/7 en un VPS Linux con systemd, nginx, HTTPS y un usuario sin privilegios. Si una plataforma falla, las otras se publican igual."]
      ],
      chips: ["Python", "OAuth 2.0", "YouTube Data API", "Instagram Graph API", "Linux · nginx"]
    },
    {
      id: "passport", side: "PassportPlanner", tag: "App publicada",
      title: "Una app estable en uso real",
      lead: "App móvil para planificar y registrar actividades compartidas: pasaportes por invitación, sellos con fotos, rankings colaborativos y una ruleta que elige el próximo plan.",
      steps: [
        ["Problema", "En uso diario los pasaportes \"desaparecían\", las fotos tardaban en subir y la base gratuita se pausaba sola tras 7 días sin actividad."],
        ["Diagnóstico", "Las sesiones vencían al volver a la app, la subida de fotos no estaba optimizada y Supabase pausa los proyectos inactivos."],
        ["Solución", "Refresco de sesión al reanudar, subida de fotos corregida y una tarea programada en GitHub Actions que mantiene la base activa."],
        ["Resultado", "App estable, con versión web instalable en iPhone publicada en passport.lukychill.com."]
      ],
      chips: ["React Native", "Expo", "TypeScript", "Supabase", "GitHub Actions"],
      links: [["Ver la app", "https://passport.lukychill.com"], ["Código", "https://github.com/LukychillGitHub/PassportPlanner"]]
    },
    {
      id: "costaflow", side: "CostaFlow", tag: "Proyecto propio",
      title: "Poner en marcha una plataforma full-stack que no arrancaba",
      lead: "CostaFlow conecta negocios turísticos de la Costa Atlántica con hoteles y recepcionistas. La app compilaba, pero fallaba en tiempo de ejecución.",
      steps: [
        ["Problema", "Errores al cargar páginas protegidas y datos de prueba que no se insertaban."],
        ["Diagnóstico", "Tres causas distintas: llamadas a cookies() sin await, rutas del middleware que no coincidían con las del proyecto y nombres de columnas mal escritos en el seed."],
        ["Solución", "Corregir cada causa por separado y verificar el flujo completo de login y carga de datos."],
        ["Resultado", "Plataforma funcionando de punta a punta sobre Next.js 14 y Supabase."]
      ],
      chips: ["Next.js 14", "TypeScript", "Tailwind", "Supabase"]
    },
    {
      id: "archivo", side: "Archivo", tag: "Primeros proyectos",
      title: "Donde empecé a programar",
      lead: "Proyectos chicos para practicar lógica, DOM y diseño de interfaces.",
      archive: [
        ["Web para profesora de Matemática", "Agenda de clases + bot de WhatsApp", "https://paginaweb-matematica-production.up.railway.app"],
        ["Fizzbuzz Minijuego", "Lógica + animaciones", "https://lukychillgithub.github.io/FizzbuzzGame/"],
        ["SillyUI", "UX absurda para el 1 de abril", "https://lukychillgithub.github.io/SillyUI/"],
        ["Pomodoro App", "Temporizador de foco", "https://lukychillgithub.github.io/Pomodoro/"],
        ["Barra de progreso", "Componente animado", "https://lukychillgithub.github.io/ProgressBar/"]
      ]
    }
  ],

  jobs: [
    { when: ["Feb 2026", "Actualidad"], now: true, role: "Analista de Tecnología", org: "Molinos Río de la Plata",
      text: "Migración de empresas adquiridas a SAP S/4HANA con Migration Cockpit, análisis funcional y resolución de incidentes de Comercio Exterior desde el equipo de staff." },
    { when: ["Ago 2023", "Ene 2026"], role: "Docente de Informática", org: "Colegio Secundario Carlos Maschwitz",
      text: "Office, diagramas de flujo, compuertas lógicas y fundamentos de hardware. Explicar lo técnico a quien recién empieza es la base de cómo hoy hablo con usuarios de negocio." },
    { when: ["Mar 2022", "Nov 2022"], role: "Pasante en Calidad", org: "Ford Argentina",
      text: "Diseño de dispositivos en impresión 3D para la línea de producción y soporte al equipo de calidad con foco en mejora continua." },
    { when: ["2020", "Hoy"], role: "Creador de contenido", org: "Lukychill", switchTo: "luky",
      text: "Comunidad de gaming en TikTok, YouTube, Instagram, Twitch y Kick. Está en el otro usuario de este sistema." }
  ],

  skills: [
    ["Negocio y SAP", ["SAP S/4HANA", "Migration Cockpit", "LTMC / LTMOM", "Datos maestros", "Análisis funcional", "Gestión de incidentes", "Comercio Exterior"]],
    ["Desarrollo", ["Python", "TypeScript", "JavaScript", "React Native", "Next.js", "Node.js", "Supabase", "PostgreSQL", "MySQL", "APIs REST", "OAuth 2.0"]],
    ["Infraestructura", ["Linux", "systemd", "nginx", "HTTPS", "GitHub Actions", "Git"]],
    ["Personas", ["Docencia", "Soporte a usuarios", "Comunicación con negocio"]]
  ],

  /* ---------------- Lukychill (redes) ---------------- */
  platforms: [
    { id: "tiktok", name: "TikTok", url: "https://www.tiktok.com/@lukychill" },
    { id: "youtube", name: "YouTube", url: "https://www.youtube.com/@lukychill" },
    { id: "instagram", name: "Instagram", url: "https://www.instagram.com/lukychill" },
    { id: "twitch", name: "Twitch", url: "https://www.twitch.tv/lukychill", live: true },
    { id: "kick", name: "Kick", url: "https://kick.com/lukychill", live: true }
  ],

  /* Para destacar videos: { title, platform, url, note }. Vacío = se muestran los canales. */
  clips: [],

  collabs: [
    { name: "Repeat.gg", what: "Plataforma de torneos de esports", tag: "Gaming" },
    { name: "Aoeah", what: "Marketplace de ítems de Rocket League", tag: "Rocket League" }
  ],

  roadmap: [
    { when: "2020 – 2024", title: "Rocket League en formato corto", text: "Clips y desafíos en TikTok y Shorts. La etapa que armó la comunidad.", state: "done" },
    { when: "Streams", title: "Directos en Kick y Twitch", text: "Gameplay en vivo con la comunidad.", state: "done" },
    { when: "Próximo", title: "Vlog con alma gamer", text: "El día a día: la oficina, la facu, el setup y las partidas. La misma persona de los dos usuarios de este sistema.", state: "cur" }
  ]
};
