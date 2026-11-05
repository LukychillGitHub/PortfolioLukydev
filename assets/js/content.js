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
      id: "migraciones", side: "Migraciones SAP", tag: "Molinos · Equipo de Staff de Sistemas (FI)",
      title: "Integrar a SAP S/4HANA las empresas que adquiere Molinos",
      lead: "Cuando Molinos compra una empresa, sus datos tienen que entrar a SAP sin frenar la operación. Soy el responsable de las cargas con SAP Migration Cockpit: armo las plantillas, limpio los datos, cargo primero en el ambiente de calidad y después en producción, y valido todo con el negocio.",
      timeline: [
        { name: "Bodegas Etchart", state: "Migrada" },
        { name: "NotCo", state: "Migrada" },
        { name: "Complejo Alimenticio San Salvador", state: "Migrada" },
        { name: "Grupo Ayudín", state: "Próxima", next: true }
      ],
      flowTitle: "Cómo es una migración",
      flow: [["Datos de origen", "Extracción de la empresa adquirida"], ["Plantillas", "Armado en LTMOM"], ["Limpieza", "Formatos, decimales, duplicados"], ["Calidad", "Cargas de prueba y errores"], ["Validación", "Con el área dueña del dato"], ["Producción", "Carga definitiva"], ["Auditoría", "Evidencia en SharePoint"]],
      objects: ["Clientes", "Proveedores", "Materiales", "Producto terminado", "Materia prima", "Insumos", "Stocks", "Lotes", "Versiones de fabricación"],
      steps: [
        ["Problema", "Cada empresa trae datos con otra estructura y otros criterios de carga, y cada migración es más exigente: Etchart fue la primera, con la herramienta por aprender, y Complejo Alimenticio San Salvador implicó un volumen de datos mucho mayor."],
        ["Diagnóstico", "Los errores que devuelve Migration Cockpit suelen venir de un período contable sin abrir, decimales mal formateados o datos mal cargados en el origen. En la última migración, los lotes estaban cargados de forma incorrecta."],
        ["Solución", "Limpieza y normalización de los datos, corrección de cada error junto al área dueña del dato (datos maestros, IT Logística por EWM, desarrollo) y nuevas pruebas en calidad antes de pasar a producción."],
        ["Resultado", "Tres empresas integradas y toda la evidencia de cada carga ordenada en SharePoint para futuras auditorías. Hoy soy el responsable de las cargas con Migration Cockpit."]
      ],
      chips: ["SAP S/4HANA", "Migration Cockpit", "LTMC / LTMOM", "Datos maestros", "Calidad → Producción", "Documentación auditable"]
    },
    {
      id: "comex", side: "Incidentes Comex", tag: "Molinos · Comercio Exterior",
      title: "Encontrar la falla de lógica que frena un proceso de Comex",
      lead: "Dedico el resto de mi tiempo a Comercio Exterior, desde la orden de compra hasta la facturación. Algunos incidentes se resuelven en el momento; otros requieren entrar al código ABAP para encontrar dónde se rompe la lógica del proceso. Además lidero la reunión semanal de incidentes con la consultora externa que da soporte al sistema de Comex.",
      flowTitle: "Dónde aparecieron los incidentes",
      flow: [["Orden de compra", "ME23N"], ["Despacho y legajo", "Autorizaciones"], ["Factura de importación", "Creada también por API", [1, 3]], ["Contabilización", "FB03 · cuentas de mayor", [2]], ["Portal de proveedores", "Estado de facturación", [4]]],
      txTitle: "Transacciones según el problema",
      tx: [["Compras", "ME23N", "Revisar la orden de compra"], ["Contabilidad", "FB03", "Ver el documento contable y sus cuentas"], ["Materiales y lotes", "MM03 · BMBC", "Consultar el material y corregir lotes"], ["Personal", "PA30", "Corregir datos bancarios"], ["Datos", "SE16N", "Consultar tablas directamente"], ["Logs", "SLG1", "Leer el log de la aplicación"], ["Código", "SE38 · SE37 · SE24", "Debuggear programas, funciones y clases"]],
      incidents: [
        { title: "Notas de crédito con receptor alternativo de pago", problem: "Las notas de crédito de importación fallaban cuando tenían un receptor alternativo de pago.", cause: "Debuggeando el objeto de facturas de importación encontré que, en ese caso, el flujo tomaba un camino incorrecto.", fix: "Corrección del flujo para las notas de crédito con receptor alternativo." },
        { title: "Impuestos compuestos en una sola cuenta", problem: "Con impuestos compuestos, como IVA más Ingresos Brutos, todo el importe se contabilizaba en la cuenta de IVA.", cause: "El split del impuesto no se estaba realizando al contabilizar.", fix: "Con una función estándar de SAP logré subdividir el impuesto para que cada parte impacte en su cuenta de mayor." },
        { title: "Unidades de medida en facturas creadas por API", problem: "Las facturas creadas desde el sistema de Comex por API fallaban en las unidades de medida.", cause: "SAP convierte las unidades entre su código interno y el nombre que se visualiza, y la integración enviaba el valor equivocado.", fix: "Analizando el código ABAP corregimos la conversión de unidades." },
        { title: "Portal de proveedores y tolerancias", problem: "Cuando una factura entraba en la tolerancia por debajo, el portal mostraba como facturado algo que no lo estaba.", cause: "La forma en que se calculaban y mostraban los datos de facturación.", fix: "Ayudé con el análisis y lo resolvimos cambiando cómo se visualizaban los datos." }
      ],
      steps: [
        ["Relevar", "Entender qué paso del proceso de negocio no se cumple y en qué documento aparece el problema."],
        ["Diagnosticar", "Elegir la transacción según el problema (ver la tabla) y, cuando la falla está en la lógica, debuggear el código ABAP hasta encontrar dónde se rompe."],
        ["Corregir", "Ajustar o coordinar la corrección con especificación funcional y orden de transporte, probarla en calidad y validarla con el usuario."],
        ["Seguimiento", "En la reunión semanal el equipo me reporta los incidentes y llevo el control de cada uno hasta su cierre."]
      ],
      chips: ["Debugging ABAP", "Service Manager", "Cuentas de mayor", "Órdenes de transporte", "Especificaciones funcionales"]
    },
    {
      id: "bot", side: "Bot de videos", tag: "Proyecto propio · en producción",
      title: "Publicar un video en tres redes con un solo link",
      lead: "Republicar cada video a mano en cada plataforma es repetitivo. Armé un bot de Telegram en Python: le paso el link de un TikTok y lo guarda en Google Drive, lo sube como YouTube Short y como Reel de prueba de Instagram.",
      flowTitle: "Arquitectura",
      flow: [["Link de TikTok", "Enviado por Telegram"], ["Bot en el VPS", "Python · systemd · usuario autorizado"], ["Descarga en HD", "Servicio externo, sin marca de agua"], ["Publicación", "Google Drive · YouTube Short · Reel de Instagram"], ["Resultado", "Respuesta en Telegram por plataforma"]],
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
      flowTitle: "Arquitectura",
      flow: [["App", "React Native · Expo · iOS, Android y web"], ["Supabase", "Auth · PostgreSQL · Storage"], ["Edge Function", "Borrado de cuenta"], ["GitHub Actions", "Deploy web y tarea programada"], ["passport.lukychill.com", "Versión instalable (PWA)"]],
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
    {
      when: ["Feb 2026", "Actualidad"], now: true, role: "Analista de Tecnología", org: "Molinos Río de la Plata", place: "Equipo de Staff · Sistemas (FI)",
      text: "Migraciones de datos de empresas adquiridas a SAP S/4HANA e incidentes de Comercio Exterior, en un equipo de tres analistas especializado en el módulo FI.",
      bullets: [
        "Responsable de las cargas con SAP Migration Cockpit en la integración de Bodegas Etchart, NotCo y Complejo Alimenticio San Salvador: clientes, proveedores, materiales, stocks, lotes y versiones de fabricación. Próxima: Grupo Ayudín.",
        "Ciclo completo de cada migración: plantillas, limpieza de datos, pruebas en calidad, carga en producción, validación con el negocio y documentación en SharePoint para auditoría.",
        "Lidero la reunión semanal de incidentes de Comex con la consultora externa: el equipo me reporta y llevo el control de cada caso hasta su cierre.",
        "Diagnóstico de incidentes de Comex de punta a punta, desde la orden de compra hasta la facturación, con debugging de código ABAP para encontrar fallas de lógica.",
        "Especificaciones funcionales, órdenes de transporte, relevamiento de cambios y altas de Business Partners.",
        "Coordinación con Comex, datos maestros, IT Logística (EWM) y desarrollo."
      ],
      tools: ["SAP S/4HANA", "Módulo FI", "Migration Cockpit", "LTMC / LTMOM", "Debugging ABAP", "SE16N", "ME23N", "FB03", "MM03", "BMBC", "PA30", "SLG1", "Service Manager", "Órdenes de transporte"],
      actions: [{ label: "Ver caso de migraciones", open: "cases", arg: "migraciones" }, { label: "Ver incidentes de Comex", open: "cases", arg: "comex" }]
    },
    {
      when: ["Ago 2023", "Ene 2026"], role: "Docente de Informática", org: "Colegio Secundario Carlos Maschwitz",
      text: "Enseñanza de informática en nivel secundario, desde herramientas de oficina hasta lógica y hardware.",
      bullets: [
        "Dictado de clases de Office (Word, Excel y PowerPoint) orientadas a casos prácticos.",
        "Enseñanza de diagramas de flujo, compuertas lógicas y fundamentos del funcionamiento de la computadora.",
        "Planificación de clases y seguimiento de las entregas de los estudiantes.",
        "Promoción del trabajo en equipo, la comunicación y la responsabilidad en las entregas."
      ],
      tools: ["Excel", "Word", "PowerPoint", "Lógica digital", "Diagramas de flujo", "Comunicación"]
    },
    {
      when: ["Mar 2022", "Nov 2022"], role: "Pasante en Calidad interna", org: "Ford Argentina", place: "Motores PUMA",
      text: "Soporte al equipo de calidad de la planta de motores, con foco en mejora continua.",
      bullets: [
        "Diseño y fabricación de dispositivos con impresión 3D para optimizar procesos de la línea de producción.",
        "Identificación y resolución de problemas técnicos junto al equipo de calidad.",
        "Gestión y actualización de planillas de Excel para mejorar la trazabilidad de los datos.",
        "Trabajo en un entorno industrial de alta exigencia con estándares de calidad automotriz."
      ],
      tools: ["Impresión 3D", "Excel", "Mejora continua", "Calidad automotriz"]
    },
    {
      when: ["Mar 2020", "Actualidad"], role: "Creador de contenido", org: "Lukychill", place: "Marca personal",
      text: "Comunidad de gaming sobre Rocket League en TikTok, YouTube, Instagram, Twitch y Kick.",
      bullets: [
        "Producción y edición de contenido de Rocket League (nivel Grand Champion).",
        "Más de 390K seguidores y 10M de likes en TikTok.",
        "Análisis de métricas y tendencias para definir la estrategia de crecimiento orgánico.",
        "Colaboraciones con marcas del sector como Repeat.gg y Aoeah."
      ],
      tools: ["Análisis de métricas", "CapCut", "Photoshop", "OBS", "Estrategia de contenido"],
      actions: [{ label: "Entrar como Lukychill", switchTo: "luky" }]
    }
  ],

  skills: [
    ["SAP y negocio", ["SAP S/4HANA", "Módulo FI", "Migration Cockpit", "LTMC / LTMOM", "Datos maestros", "Debugging ABAP", "Comercio Exterior", "Análisis funcional", "Órdenes de transporte"]],
    ["Transacciones SAP", ["SE16N", "SE38", "SE37", "SE24", "ME23N", "FB03", "MM03", "BMBC", "PA30", "SLG1"]],
    ["Desarrollo", ["Python", "TypeScript", "JavaScript", "React Native", "Next.js", "Node.js", "Supabase", "PostgreSQL", "MySQL", "APIs REST", "OAuth 2.0"]],
    ["Infraestructura", ["Linux", "systemd", "nginx", "HTTPS", "GitHub Actions", "Git"]],
    ["Personas", ["Liderazgo de reuniones", "Documentación", "Docencia", "Comunicación con negocio"]]
  ],

  /* ---------------- Lukychill (redes) ---------------- */
  platforms: [
    { id: "tiktok", name: "TikTok", url: "https://www.tiktok.com/@lukychill" },
    { id: "youtube", name: "YouTube", url: "https://www.youtube.com/@lukychill" },
    { id: "instagram", name: "Instagram", url: "https://www.instagram.com/lukychill" },
    { id: "twitch", name: "Twitch", url: "https://www.twitch.tv/lukychill", live: true },
    { id: "kick", name: "Kick", url: "https://kick.com/lukychill", manual: true }
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
