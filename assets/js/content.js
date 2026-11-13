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
        ["Resultado", "Tres empresas integradas y toda la evidencia de cada carga ordenada en SharePoint para futuras auditorías."]
      ],
      chips: ["SAP S/4HANA", "Migration Cockpit", "LTMC / LTMOM", "Datos maestros", "Calidad → Producción", "Documentación auditable"]
    },
    {
      id: "comex", side: "Incidentes Comex", tag: "Molinos · Comercio Exterior",
      title: "Encontrar la falla de lógica que frena un proceso de Comex",
      lead: "Además de las migraciones, trabajo en los incidentes de Comercio Exterior, desde la orden de compra hasta la facturación. Algunos incidentes se resuelven en el momento; otros requieren entrar al código ABAP para encontrar dónde se rompe la lógica del proceso.",
      flowTitle: "Dónde aparecieron los incidentes",
      flow: [["Orden de compra", "Inicio del circuito"], ["Despacho y legajo", "Autorizaciones"], ["Factura de importación", "Creada también por API", [1, 3]], ["Contabilización", "Impacto en cuentas de mayor", [2]], ["Portal de proveedores", "Estado de facturación", [4]]],
      incidents: [
        { title: "Notas de crédito con receptor alternativo de pago", problem: "Las notas de crédito de importación fallaban cuando tenían un receptor alternativo de pago.", cause: "Debuggeando el objeto de facturas de importación encontré que, en ese caso, el flujo tomaba un camino incorrecto.", fix: "Corrección del flujo para las notas de crédito con receptor alternativo." },
        { title: "Impuestos compuestos en una sola cuenta", problem: "Con impuestos compuestos, como IVA más Ingresos Brutos, todo el importe se contabilizaba en la cuenta de IVA.", cause: "El split del impuesto no se estaba realizando al contabilizar.", fix: "Con una función estándar de SAP logré subdividir el impuesto para que cada parte impacte en su cuenta de mayor." },
        { title: "Unidades de medida en facturas creadas por API", problem: "Las facturas creadas desde el sistema de Comex por API fallaban en las unidades de medida.", cause: "SAP convierte las unidades entre su código interno y el nombre que se visualiza, y la integración enviaba el valor equivocado.", fix: "Analizando el código ABAP corregimos la conversión de unidades." },
        { title: "Portal de proveedores y tolerancias", problem: "Cuando una factura entraba en la tolerancia por debajo, el portal mostraba como facturado algo que no lo estaba.", cause: "La forma en que se calculaban y mostraban los datos de facturación.", fix: "Ayudé con el análisis y lo resolvimos cambiando cómo se visualizaban los datos." }
      ],
      steps: [
        ["Relevar", "Entender qué paso del proceso de negocio no se cumple y en qué documento aparece el problema."],
        ["Diagnosticar", "Revisar los documentos y datos involucrados en SAP y, cuando la falla está en la lógica, debuggear el código ABAP hasta encontrar dónde se rompe."],
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
      gallery: [["assets/img/projects/bot-telegram.webp", "El bot en Telegram: le paso el link de TikTok y responde con el archivo en Drive, el YouTube Short y el Reel publicado.", "wide"]],
      chips: ["Python", "OAuth 2.0", "YouTube Data API", "Instagram Graph API", "Linux · nginx"]
    },
    {
      id: "passport", side: "PassportPlanner", tag: "App publicada",
      title: "Una app estable en uso real",
      lead: "App móvil para planificar y registrar actividades compartidas: pasaportes por invitación, sellos con fotos, rankings colaborativos y una ruleta que elige el próximo plan.",
      flowTitle: "Arquitectura",
      flow: [["App", "React Native · Expo · iOS, Android y web"], ["Supabase", "Auth · PostgreSQL · Storage"], ["Edge Function", "Borrado de cuenta"], ["GitHub Actions", "Deploy web y tarea programada"], ["Versión web", "Instalable en iPhone (PWA)"]],
      steps: [
        ["Problema", "En uso diario los pasaportes \"desaparecían\", las fotos tardaban en subir y la base gratuita se pausaba sola tras 7 días sin actividad."],
        ["Diagnóstico", "Las sesiones vencían al volver a la app, la subida de fotos no estaba optimizada y Supabase pausa los proyectos inactivos."],
        ["Solución", "Refresco de sesión al reanudar, subida de fotos corregida y una tarea programada en GitHub Actions que mantiene la base activa."],
        ["Resultado", "App estable, con versión web instalable en iPhone publicada en GitHub Pages."]
      ],
      gallery: [["assets/img/projects/passport-pasaporte.webp", "Pasaporte: cada actividad sellada con fotos, estrellas y reseña"], ["assets/img/projects/passport-ruleta.webp", "Ruleta que elige el próximo plan"], ["assets/img/projects/passport-tops.webp", "Tops: rankings compartidos por categoría"], ["assets/img/projects/passport-cuenta.webp", "Perfil de cada miembro"]],
      chips: ["React Native", "Expo", "TypeScript", "Supabase", "GitHub Actions"],
      links: [["Ver la app", "https://lukychillgithub.github.io/PassportPlanner/"], ["Código", "https://github.com/LukychillGitHub/PassportPlanner"]]
    }
  ],

  journey: {
    title: "De la línea de producción a SAP",
    lead: "No llegué a sistemas por un camino recto. Cada etapa me dejó algo que hoy uso todos los días en Molinos.",
    chapter: "Capítulo", take: "Lo que me llevé", more: "Ver detalle", now: "Hoy",
    next: { title: "Lo que sigue", text: "Llegar a Consultor Funcional SAP: conocer otros módulos, profundizar en el análisis de sistemas y seguir automatizando, mientras termino Ingeniería en Informática." }
  },

  jobs: [
    {
      milestone: true, when: ["2015", "2022"], role: "Técnico Electromecánico", org: "Escuela Técnica Henry Ford",
      text: "Siete años de taller, electricidad y mecánica. Ahí tuve el primer contacto con la programación, a través de la robótica, y por eso elegí Ingeniería en Informática."
    },
    {
      key: "ford", step: "Ford", chapter: "El primer paso en la industria",
      when: ["Mar 2022", "Nov 2022"], role: "Pasante en Calidad interna", org: "Ford Argentina", place: "Motores PUMA",
      text: "Mi primera experiencia laboral: una pasantía en el equipo de Calidad interna de la planta de motores PUMA, en un entorno con estándares de calidad automotriz.",
      take: "Que un problema chico en la línea impacta en todo el proceso, y que los datos ordenados valen tanto como la solución.",
      bullets: [
        "Diseño y fabricación de dispositivos con impresión 3D para optimizar procesos de la línea de producción.",
        "Identificación y resolución de problemas técnicos junto al equipo de calidad.",
        "Gestión y actualización de planillas de Excel para mejorar la trazabilidad de los datos."
      ],
      tools: ["Impresión 3D", "Excel", "Mejora continua", "Calidad automotriz"]
    },
    {
      key: "luky", step: "Lukychill", chapter: "Construir algo propio",
      when: ["Mar 2020", "Actualidad"], role: "Creador de contenido", org: "Lukychill", place: "Marca personal",
      text: "Lukychill empezó en 2020 como un canal de Rocket League y hoy es una comunidad de más de 550.000 seguidores entre TikTok, YouTube, Twitch e Instagram. Lo llevo de punta a punta, solo.",
      take: "Constancia para sostener un proyecto durante años, leer métricas para decidir y comunicar de forma que la gente entienda y se quede.",
      bullets: [
        "Producción completa: idea, guion, manejo de cámara, edición y transmisiones en vivo.",
        "Análisis de métricas de alcance y engagement para ajustar formatos y sostener el crecimiento orgánico.",
        "Colaboraciones con marcas del sector gamer."
      ],
      tools: ["Análisis de métricas", "Cámara", "CapCut", "Photoshop", "OBS", "Estrategia de contenido"],
      actions: [{ label: "Entrar como Lukychill", switchTo: "luky" }]
    },
    {
      key: "docente", step: "Docencia", chapter: "Aprender a explicar",
      when: ["Ago 2023", "Ene 2026"], role: "Docente de Informática", org: "Colegio Secundario Carlos Maschwitz",
      text: "Di clases de informática en un colegio secundario, a cargo de la planificación y el seguimiento de cada curso.",
      take: "Traducir conceptos técnicos a un lenguaje simple y adaptarlos a quien escucha. Hoy lo uso cada vez que hablo con un usuario de negocio.",
      bullets: [
        "Clases de Office (Word, Excel y PowerPoint) orientadas a casos prácticos.",
        "Enseñanza de diagramas de flujo, compuertas lógicas y fundamentos del funcionamiento de la computadora."
      ],
      tools: ["Excel", "Word", "PowerPoint", "Lógica digital", "Diagramas de flujo", "Comunicación"]
    },
    {
      milestone: true, when: ["2024", ""], role: "Ingeniería en Informática", org: "Universidad del Salvador",
      text: "Empiezo la carrera de grado mientras trabajo.",
      open: "edu"
    },
    {
      key: "molinos", step: "Molinos", chapter: "Analista de Tecnología",
      when: ["Feb 2026", "Actualidad"], now: true, role: "Analista de Tecnología", org: "Molinos Río de la Plata", place: "Sistemas · Staff FI",
      text: "Entré al área de Sistemas, al equipo de Staff especializado en el módulo FI de SAP S/4HANA: tres analistas y nuestro jefe. Trabajo con usuarios de negocio, datos maestros, logística, desarrollo y consultoras externas.",
      take: "Cómo se gestiona un cambio en una compañía grande y qué significa que un sistema en el que trabajo lo use toda la empresa.",
      bullets: [
        "Análisis y resolución de incidentes en procesos contables (FI) y de Comercio Exterior hasta la causa raíz, con debugging ABAP cuando la falla está en la lógica.",
        "Responsable de las cargas con SAP Migration Cockpit en la integración de las empresas que adquiere la compañía.",
        "Especificaciones funcionales, órdenes de transporte y altas de Business Partners.",
        "Lidero la reunión semanal de incidentes con la consultora externa, un desafío que asumí por iniciativa propia."
      ],
      actions: [{ label: "Ver caso de migraciones", open: "cases", arg: "migraciones" }, { label: "Ver incidentes resueltos", open: "cases", arg: "comex" }]
    }
  ],

  skills: [
    ["SAP y negocio", ["SAP S/4HANA", "Módulo FI", "Migration Cockpit", "LTMC / LTMOM", "Datos maestros", "Debugging ABAP", "Comercio Exterior", "Análisis funcional", "Órdenes de transporte"]],
    ["Transacciones SAP", ["SE16N", "SE38", "SE37", "SE24", "ME23N", "FB03", "MM03", "BMBC", "PA30", "SLG1"]],
    ["Desarrollo", ["Python", "TypeScript", "JavaScript", "React Native", "Next.js", "Node.js", "Supabase", "PostgreSQL", "MySQL", "APIs REST", "OAuth 2.0"]],
    ["Infraestructura", ["Linux", "systemd", "nginx", "HTTPS", "GitHub Actions", "Git"]]
  ],

  /* ---------------- Lukychill (redes) ---------------- */
  platforms: [
    { id: "tiktok", name: "TikTok", url: "https://www.tiktok.com/@lukychill" },
    { id: "youtube", name: "YouTube", url: "https://www.youtube.com/@lukychill" },
    { id: "instagram", name: "Instagram", url: "https://www.instagram.com/lukychill" },
    { id: "twitch", name: "Twitch", url: "https://www.twitch.tv/lukychill", live: true },
    { id: "kick", name: "Kick", url: "https://kick.com/lukychill", manual: true }
  ],



  story: [
    { cat: "tipos", when: "Dic 2020", title: "Tipos de jugadores", sub: "El primer formato del canal",
      text: "Arranqué retratando los tipos de jugadores que te cruzás en cualquier partida de Rocket League, y sumé a mi hermano como compañero de dúo. Humor de la comunidad en formato corto: la base de todo lo que vino después.",
      videos: ["6908569921119128838", "6906222928715697414", "6930681882623446277"] },
    { cat: "historias", when: "Jul 2021", title: "Historias de Reddit", sub: "El formato más viral",
      text: "Contaba historias de Reddit mientras jugaba. Fue el formato que más explotó: \"El niño en peligro\" llegó a 5,9M de vistas y es el video más visto del canal.",
      videos: ["6984235506779393286", "7095803050765339909", "6984917707757980934", "7075085373012970757"] },
    { cat: "record", when: "Oct 2021", title: "Récord: 10 mercs apiladas", sub: "El hito del canal",
      text: "Apilé 10 Mercs una encima de la otra y lo convertí en récord. El video pasó el 1,7M de vistas y se volvió una referencia del canal, con varios recaps después.",
      videos: ["7017881807240629510", "7017896957716892933"] },
    { cat: "mecanicas", when: "Dic 2022", title: "Mecánicas en 3 pasos", sub: "Enseñar a jugar mejor",
      text: "Tutoriales cortos: una mecánica explicada en 3 pasos para que cualquiera pueda aprenderla, desde volar por primera vez hasta el air dribbling y el walldash.",
      videos: ["7269811856385051909", "7179288781852282118", "7271411749981539590", "7180845716753943814"] },
    { cat: "mapas", when: "Jul 2023", title: "Mapas personalizados", sub: "Fall Guys, Minecraft y desafíos",
      text: "Mapas de la comunidad llevados a Rocket League, como Fall Guys o Minecraft, y desafíos pensados para etiquetar a ese amigo. Hoy son una lista de más de 40 publicaciones en TikTok.",
      videos: ["7259136265554087173", "7447346377752923397", "7449161364343393542", "7255324202746563845"] },
    { cat: "hermano", when: "2025", title: "Duelos contra mi hermano", sub: "La rivalidad de siempre",
      text: "Volvió el dúo de los inicios, ahora como rivales: partidos uno contra uno con mi hermano y una serie propia de duelos.",
      videos: ["7529609287245647160", "7532172259524349190"] },
    { cat: "streams", when: "En vivo", title: "Streams en Twitch y Kick", sub: "Gameplay con la comunidad",
      text: "Directos de Rocket League para jugar y charlar con la comunidad. El canal de Twitch ya supera los 47K seguidores.",
      metric: ["+47K", "en Twitch"], link: ["Ver Twitch", "https://www.twitch.tv/lukychill"] },
    { cat: "next", state: "next", when: "Próximo", title: "Vlog con alma gamer", sub: "Lo que viene",
      text: "El día a día: la oficina, la facu, el setup y las partidas. La misma persona detrás de los dos usuarios de este sistema." }
  ]
};
