/* LukyOS: boot → login con dos usuarios → escritorio con ventanas, dock y búsqueda. Español e inglés. */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const sess = {
    get(k) { try { return sessionStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (_) {} }
  };
  const local = {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
  };

  /* ---------------- Idioma ---------------- */
  function pickLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "es" || q === "en") return q;
    const saved = local.get("lukyos-lang");
    if (saved === "es" || saved === "en") return saved;
    return (navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en";
  }
  let LANG = pickLang();
  let C = content();
  function content() { return LANG === "en" ? Object.assign({}, window.LUKY, window.LUKY_EN) : window.LUKY; }
  const locale = () => (LANG === "en" ? "en-US" : "es-AR");

  const T = {
    es: {
      bootHint: "LukyOS · iniciando", skipBoot: "Saltar inicio",
      lucasRole: "Analista de Tecnología<br>SAP · Ingeniería en Informática", lukyRole: "Creador de contenido<br>Rocket League · Streams",
      work: "Trabajo", social: "Redes",
      loginFoot: "Elegí con quién entrar. Podés <b>cambiar de usuario</b> cuando quieras desde la barra de arriba.",
      desktop: "Escritorio", search: "Buscar", switchUser: "Cambiar usuario", streamsOff: "Streams · offline", live: "EN VIVO", offline: "offline",
      close: "Cerrar", minimize: "Minimizar", maximize: "Maximizar",
      apps: { about: "Sobre mí", cases: "Casos", path: "Trayectoria", edu: "Formación", term: "Terminal", cv: "Currículum", mail: "Contacto", stats: "Stats", rank: "Rango", clips: "Videos", collab: "Collabs", next: "Lo que viene", kmail: "Contacto marcas" },
      titles: { about: "Notas — Sobre mí", cases: "Casos", path: "Trayectoria", edu: "Formación", term: "lucas — zsh", cv: "Currículum", mail: "Nuevo mensaje", stats: "Stats — en vivo", rank: "Rango", clips: "Videos", collab: "Colaboraciones", next: "Lo que viene", kmail: "Nuevo mensaje" },
      deskCases: "Casos", deskPath: "Trayectoria", deskClips: "Videos", deskCollab: "Collabs",
      helloLucas: `<div class="eyebrow">Analista de Tecnología · SAP S/4HANA</div><h1>Lucas<br>Fernández</h1><p>Migraciones de datos, incidentes de Comercio Exterior y debugging ABAP. Los proyectos están en <b>Casos</b>, en el dock.</p>`,
      helloLuky: `<div class="eyebrow">@lukychill · Rocket League</div><h1>Luky<br>chill</h1><p>Grand Champion, streams y lo que viene: vlog con alma gamer.</p>`,
      notifLucas: ["Nuevo caso", "Bot de videos: un link de TikTok, tres redes publicadas."],
      notifLuky: ["Próximamente", "Vlog con alma gamer: la oficina, la facu y las partidas."],
      now: "ahora",
      aboutTabs: [["Perfil", "Resumen profesional"], ["Recorrido", "Cómo llegué hasta acá"], ["Competencias", "SAP, desarrollo e infraestructura"]],
      aboutYo: (gpa) => `<div class="eyebrow">Perfil profesional</div><h2>Lucas Román Fernández</h2>
        <p class="about-role">Analista de Tecnología · SAP S/4HANA (FI) · Migración de datos · Comercio Exterior</p>
        <p>Soy Analista de Tecnología en el equipo de Staff de Sistemas de Molinos Río de la Plata, especializado en el módulo FI de SAP S/4HANA. Soy responsable de las migraciones de datos de las empresas que adquiere la compañía y resuelvo incidentes de Comercio Exterior, muchas veces entrando al código ABAP para encontrar la falla.</p>
        <p>En pocos meses pasé a liderar la reunión semanal de incidentes con la consultora externa de Comex. Curso Ingeniería en Informática en la Universidad del Salvador y busco crecer como Consultor Funcional SAP y en análisis de datos.</p>
        <p>Me definen la iniciativa por aprender, el análisis riguroso de cada problema y el orden: documento todo para que ningún tema quede abierto. Mis proyectos de automatización nacen de lo mismo: resolver lo repetitivo para dedicar el tiempo a las decisiones que importan.</p>`,
      aboutBtns: ["Ver casos", "Currículum", "Contacto"],
      kpis: [["3", "Empresas integradas a SAP"], ["gpa", "Promedio académico"], ["2", "Proyectos propios en producción"]],
      origen: `<div class="eyebrow">Recorrido</div><h2 class="h2">De la electromecánica a SAP</h2>
        <p style="max-width:62ch;margin-top:10px">Mi formación empezó en la Escuela Técnica Henry Ford, donde me recibí de Técnico Electromecánico. Ahí tuve el primer contacto con la programación a través de la robótica, y fue lo que me llevó a elegir Ingeniería en Informática.</p>
        <p style="max-width:62ch">Pasé por una pasantía de calidad en Ford Argentina, más de dos años como docente de informática y, desde 2026, el área de Sistemas de Molinos, donde aprendí SAP, el circuito completo de Comercio Exterior y cómo se gestiona un cambio en un equipo grande. En cada etapa sumé algo distinto: el rigor de la industria, la capacidad de explicar lo técnico y la visión de los procesos de negocio.</p>
        <p style="max-width:62ch">En paralelo construí Lukychill, una comunidad de gaming en redes que me enseñó a analizar métricas y sostener un proyecto propio en el tiempo.</p>`,
      skillsHead: ["Competencias", "Con qué trabajo"],
      casesLbl: "Casos", folders: "carpetas", crumbRoot: "Lucas › Casos › ",
      objects: "Objetos migrados", incidents: "Incidentes resueltos", howIncident: "Cómo trabajo un incidente",
      dl: ["Problema", "Causa", "Solución"],
      trackHint: "Tocá un puesto para ver el detalle.", resp: "Responsabilidades", toolsLbl: "Herramientas y conocimientos",
      eduSub: (since) => `Universidad del Salvador · ${since} – hoy`, eduTitle: "Ingeniería en Informática",
      eduDesc: "Programación, estructuras de datos, bases de datos, sistemas operativos y modelado.",
      subjects: "materias", subjAria: (d, t) => `${d} de ${t} materias aprobadas`, gpaLbl: "Promedio", ofCareer: "de la carrera",
      eduItems: [["Técnico Electromecánico", "Escuela Técnica Henry Ford · 2015 – 2022", "Promedio 7,95"], ["Excel Experto", "UTN · Certificación", "82/100"], ["Inglés", "Nivel intermedio alto", "B2"]],
      cvHead: ["Currículum", "Una página, en dos idiomas"], cvDesc: "Experiencia en SAP, proyectos propios y formación, listo para leer o pasar por un ATS.",
      cvLangs: ["Español", "English"],
      cvList: (gpa) => ["Analista de Tecnología en Molinos Río de la Plata (SAP S/4HANA, FI)", "Bot de republicación de videos y PassportPlanner", `Ingeniería en Informática, promedio ${gpa}`],
      termHello: ["LukyOS · escribí ", " para ver comandos"],
      cmdHelp: '<span class="g">whoami</span>    quién soy\n<span class="g">casos</span>     abrir casos resueltos\n<span class="g">stack</span>     con qué trabajo\n<span class="g">cv</span>        ver el currículum\n<span class="g">contacto</span>  escribirme\n<span class="g">lukychill</span> cambiar al otro usuario\n<span class="g">english</span>   change language\n<span class="g">clear</span>     limpiar',
      whoami: (gpa) => `Lucas Román Fernández · Analista de Tecnología · SAP S/4HANA (FI)\nIngeniería en Informática · USAL · promedio ${gpa}`,
      opening: "Abriendo", switching: "Cambiando a", notFound: "comando no encontrado", tryHelp: "probá", sudo: "Buen intento. Acá el admin es SAP.",
      cmdCases: "casos", cmdContact: "contacto",
      mail: { to: "Para", from: "De", email: "Email", subject: "Asunto", name: "Tu nombre", msg: "Mensaje", copy: "Copiar", copied: "Copiado", selected: "Seleccionado", send: "Enviar", sending: "Enviando…",
        subjLucas: "Contacto desde tu portfolio", subjLuky: "Colaboración con Lukychill", phLucas: "Contame en qué te puedo ayudar.", phLuky: "Contame sobre la marca, la campaña y los tiempos.",
        invalid: "Completá tu nombre, un email válido y el mensaje.", didYouMean: "¿Quisiste decir", temp: "Usá un email permanente: no se aceptan direcciones temporales.", ok: "Mensaje enviado. Te respondo a la brevedad.", fail: (e) => `No se pudo enviar. Escribime directamente a ${e}.` },
      stats: { total: "Comunidad total", sumAll: "seguidores sumando todas las plataformas", sumSome: (a, b) => `seguidores sumando ${a} de ${b} plataformas`,
        updated: "Actualizado", waiting: "Esperando la primera sincronización", followers: "seguidores", subs: "suscriptores", likes: "likes", views: "vistas", videos: "videos",
        pending: "Sin conectar", pendingSub: "Se completa al sincronizar", visit: "Ver canal", visitSub: "@lukychill" },
      rank: { eyebrow: "Rocket League", text: "Del rango al contenido: jugadas, desafíos y formatos cortos pensados para la comunidad competitiva.", k: ["Rango alcanzado", "Años creando", "Plataformas"] },
      clips: { eyebrowHL: "Clips destacados", titleHL: "Lo mejor del canal", eyebrow: "Videos", title: "Dónde ver el contenido", desc: "Clips de Rocket League, desafíos y directos." },
      collab: { eyebrow: "Marcas", title: "Colaboraciones", desc: "Marcas del ecosistema gamer y de Rocket League que trabajaron con el canal.", cta: "Proponer una colaboración" },
      next: { eyebrow: "Hoja de ruta", title: "Lo que viene en el canal" },
      spot: { ph: "Buscar apps, casos…", empty: "Sin resultados", app: "App", case: "Caso", user: "Usuario", toLuky: "Cambiar a Lukychill", toLucas: "Cambiar a Lucas Fernández", lang: "Switch to English", langKind: "Idioma" },
      docTitle: { lucas: "Lucas Fernández · LukyOS", luky: "Lukychill · LukyOS", login: "Lucas Fernández · LukyOS" }
    },
    en: {
      bootHint: "LukyOS · starting", skipBoot: "Skip intro",
      lucasRole: "Technology Analyst<br>SAP · Computer Engineering", lukyRole: "Content creator<br>Rocket League · Streams",
      work: "Work", social: "Social",
      loginFoot: "Choose who to log in as. You can <b>switch user</b> anytime from the top bar.",
      desktop: "Desktop", search: "Search", switchUser: "Switch user", streamsOff: "Streams · offline", live: "LIVE", offline: "offline",
      close: "Close", minimize: "Minimize", maximize: "Maximize",
      apps: { about: "About me", cases: "Cases", path: "Experience", edu: "Education", term: "Terminal", cv: "Résumé", mail: "Contact", stats: "Stats", rank: "Rank", clips: "Videos", collab: "Collabs", next: "What's next", kmail: "Brand contact" },
      titles: { about: "Notes — About me", cases: "Cases", path: "Experience", edu: "Education", term: "lucas — zsh", cv: "Résumé", mail: "New message", stats: "Stats — live", rank: "Rank", clips: "Videos", collab: "Collaborations", next: "What's next", kmail: "New message" },
      deskCases: "Cases", deskPath: "Experience", deskClips: "Videos", deskCollab: "Collabs",
      helloLucas: `<div class="eyebrow">Technology Analyst · SAP S/4HANA</div><h1>Lucas<br>Fernández</h1><p>Data migration, Foreign Trade incidents and ABAP debugging. Projects live in <b>Cases</b>, in the dock.</p>`,
      helloLuky: `<div class="eyebrow">@lukychill · Rocket League</div><h1>Luky<br>chill</h1><p>Grand Champion, streams and what's next: a vlog with a gamer soul.</p>`,
      notifLucas: ["New case", "Video bot: one TikTok link, three networks published."],
      notifLuky: ["Coming soon", "A vlog with a gamer soul: the office, university and the matches."],
      now: "now",
      aboutTabs: [["Profile", "Professional summary"], ["Background", "How I got here"], ["Skills", "SAP, development and infrastructure"]],
      aboutYo: () => `<div class="eyebrow">Professional profile</div><h2>Lucas Román Fernández</h2>
        <p class="about-role">Technology Analyst · SAP S/4HANA (FI) · Data migration · Foreign Trade</p>
        <p>I am a Technology Analyst on the Systems staff team at Molinos Río de la Plata, specialized in the SAP S/4HANA FI module. I own the data migration of the companies Molinos acquires and I resolve Foreign Trade incidents, often going into the ABAP code to find the failure.</p>
        <p>Within a few months I started leading the weekly incident meeting with the external Foreign Trade consulting firm. I study Computer Engineering at Universidad del Salvador and I am growing toward an SAP Functional Consultant role and data analysis.</p>
        <p>I am defined by a drive to learn, rigorous analysis of every problem and order: I document everything so no issue is left open. My automation projects come from the same place: solving the repetitive so time goes to the decisions that matter.</p>`,
      aboutBtns: ["See cases", "Résumé", "Contact"],
      kpis: [["3", "Companies integrated into SAP"], ["gpa", "GPA (out of 10)"], ["2", "Personal projects in production"]],
      origen: `<div class="eyebrow">Background</div><h2 class="h2">From electromechanics to SAP</h2>
        <p style="max-width:62ch;margin-top:10px">My education started at Escuela Técnica Henry Ford, where I graduated as an Electromechanical Technician. That is where I first got into programming through robotics, which led me to choose Computer Engineering.</p>
        <p style="max-width:62ch">I went through a quality internship at Ford Argentina, more than two years teaching computer science and, since 2026, the Systems area at Molinos, where I learned SAP, the full Foreign Trade cycle and how change is managed in a large team. Each stage added something different: industrial rigor, the ability to explain technical topics and a view of business processes.</p>
        <p style="max-width:62ch">In parallel I built Lukychill, a gaming community that taught me to analyze metrics and sustain a personal project over time.</p>`,
      skillsHead: ["Skills", "What I work with"],
      casesLbl: "Cases", folders: "folders", crumbRoot: "Lucas › Cases › ",
      objects: "Migrated objects", incidents: "Incidents resolved", howIncident: "How I work an incident",
      dl: ["Problem", "Cause", "Solution"],
      trackHint: "Tap a role to see the details.", resp: "Responsibilities", toolsLbl: "Tools and knowledge",
      eduSub: (since) => `Universidad del Salvador · ${since} – present`, eduTitle: "B.S. in Computer Engineering",
      eduDesc: "Programming, data structures, databases, operating systems and modeling.",
      subjects: "courses", subjAria: (d, t) => `${d} of ${t} courses completed`, gpaLbl: "GPA", ofCareer: "of the degree",
      eduItems: [["Electromechanical Technician", "Escuela Técnica Henry Ford · 2015 – 2022", "GPA 7.95"], ["Excel Expert", "UTN · Certification", "82/100"], ["English", "Upper intermediate", "B2"]],
      cvHead: ["Résumé", "One page, in two languages"], cvDesc: "SAP experience, personal projects and education, ready to read or to pass an ATS.",
      cvLangs: ["Español", "English"],
      cvList: (gpa) => ["Technology Analyst at Molinos Río de la Plata (SAP S/4HANA, FI)", "Video republishing bot and PassportPlanner", `Computer Engineering, GPA ${gpa}`],
      termHello: ["LukyOS · type ", " to see commands"],
      cmdHelp: '<span class="g">whoami</span>    who I am\n<span class="g">cases</span>     open solved cases\n<span class="g">stack</span>     what I work with\n<span class="g">cv</span>        see the résumé\n<span class="g">contact</span>   write to me\n<span class="g">lukychill</span> switch to the other user\n<span class="g">espanol</span>   cambiar idioma\n<span class="g">clear</span>     clear',
      whoami: (gpa) => `Lucas Román Fernández · Technology Analyst · SAP S/4HANA (FI)\nComputer Engineering · USAL · GPA ${gpa}`,
      opening: "Opening", switching: "Switching to", notFound: "command not found", tryHelp: "try", sudo: "Nice try. SAP is the admin here.",
      cmdCases: "cases", cmdContact: "contact",
      mail: { to: "To", from: "From", email: "Email", subject: "Subject", name: "Your name", msg: "Message", copy: "Copy", copied: "Copied", selected: "Selected", send: "Send", sending: "Sending…",
        subjLucas: "Contact from your portfolio", subjLuky: "Collaboration with Lukychill", phLucas: "Tell me how I can help.", phLuky: "Tell me about the brand, the campaign and the timing.",
        invalid: "Fill in your name, a valid email and the message.", didYouMean: "Did you mean", temp: "Please use a permanent email: temporary addresses are not accepted.", ok: "Message sent. I will get back to you soon.", fail: (e) => `It could not be sent. Write to me directly at ${e}.` },
      stats: { total: "Total community", sumAll: "followers across all platforms", sumSome: (a, b) => `followers across ${a} of ${b} platforms`,
        updated: "Updated", waiting: "Waiting for the first sync", followers: "followers", subs: "subscribers", likes: "likes", views: "views", videos: "videos",
        pending: "Pending", pendingSub: "Fills in after syncing", visit: "Visit channel", visitSub: "@lukychill" },
      rank: { eyebrow: "Rocket League", text: "From rank to content: plays, challenges and short formats made for the competitive community.", k: ["Rank reached", "Years creating", "Platforms"] },
      clips: { eyebrowHL: "Featured clips", titleHL: "Best of the channel", eyebrow: "Videos", title: "Where to watch", desc: "Rocket League clips, challenges and streams." },
      collab: { eyebrow: "Brands", title: "Collaborations", desc: "Gaming and Rocket League brands that worked with the channel.", cta: "Propose a collaboration" },
      next: { eyebrow: "Roadmap", title: "What's next on the channel" },
      spot: { ph: "Search apps, cases…", empty: "No results", app: "App", case: "Case", user: "User", toLuky: "Switch to Lukychill", toLucas: "Switch to Lucas Fernández", lang: "Cambiar a español", langKind: "Language" },
      docTitle: { lucas: "Lucas Fernández · LukyOS", luky: "Lukychill · LukyOS", login: "Lucas Fernández · LukyOS" }
    }
  };
  let L = T[LANG];

  /* ---------------- Métricas (data/stats.json lo genera la GitHub Action) ---------------- */
  let STATS = { updated: null, platforms: {}, live: {} };
  const STATS_URLS = ["https://raw.githubusercontent.com/LukychillGitHub/PortfolioLukydev/main/data/stats.json", "data/stats.json"];
  async function loadStats() {
    for (const url of STATS_URLS) {
      try {
        const r = await fetch(url, { cache: "no-store" });
        if (r.ok) { const j = await r.json(); if (j && j.platforms) { STATS = j; return; } }
      } catch (_) { /* probar la siguiente */ }
    }
  }
  const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(".", LANG === "en" ? "." : ",") + "M" : n >= 1e3 ? Math.round(n / 1e3) + "K" : String(n);
  const anyLive = () => Object.values(STATS.live || {}).some(Boolean);

  /* ---------------- Íconos ---------------- */
  const G = {
    about: '<path d="M7 4h7l4 4v12H7z"/><path d="M14 4v4h4M10 12h5M10 16h5"/>',
    cases: '<circle cx="10.5" cy="10.5" r="5"/><path d="M14.2 14.2 19 19"/>',
    path: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h6a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h6"/>',
    edu: '<path d="M2.5 9.5 12 5l9.5 4.5L12 14z"/><path d="M6.5 11.5v4.2c3.2 2.4 7.8 2.4 11 0v-4.2"/>',
    term: '<path d="M6 8l4 4-4 4M12.5 16.5H18"/>',
    mail: '<rect x="3.5" y="6" width="17" height="12.5" rx="2.5"/><path d="M4 7.5l8 5.5 8-5.5"/>',
    cv: '<path d="M7 3.5h7l4 4v13H7z"/><path d="M14 3.5v4h4M12.5 11v6M10 14.5l2.5 2.5 2.5-2.5"/>',
    stats: '<path d="M4.5 17.5l5-5.5 3.5 3 6.5-7.5"/><path d="M15 7.5h4.5V12"/>',
    rank: '<path d="M12 3.5l7 3v5.5c0 4-3 6.8-7 8.5-4-1.7-7-4.5-7-8.5V6.5z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    clips: '<rect x="6.5" y="3.5" width="11" height="17" rx="2.5"/><path d="M10.5 9.5v5l4-2.5z"/>',
    collab: '<circle cx="9" cy="9" r="3"/><circle cx="16.5" cy="10.5" r="2.4"/><path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5M14.5 15c2.4-.5 4.6.7 5.5 3.5"/>',
    next: '<rect x="3.5" y="7" width="12" height="10" rx="2"/><path d="M15.5 11l5-3v8l-5-3z"/>',
    lang: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17"/>'
  };
  const ai = (k) => `<span class="ai" data-k="${k}" aria-hidden="true"><svg viewBox="0 0 24 24">${G[k]}</svg></span>`;
  const FOLDER = (c1, c2) => `<span class="folder-ico" aria-hidden="true"><svg viewBox="0 0 56 46"><path d="M3 7a4 4 0 0 1 4-4h13l4.5 4.5H49a4 4 0 0 1 4 4V39a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" fill="${c2}"/><path d="M3 14h50v25a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" fill="${c1}"/><path d="M3 14h50" stroke="rgba(255,255,255,.35)"/></svg></span>`;
  const FOLD_S = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M2 4.5a1 1 0 0 1 1-1h3l1.5 1.5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/></svg>';
  const CHEV = '<svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4l4 4-4 4"/></svg>';
  const DESK_ICONS = { folderL: FOLDER("#7aa5ff", "#4d82f0"), folderK: FOLDER("#ff8f3a", "#c95a10") };

  /* ---------------- Lucas: ventanas ---------------- */
  const ABOUT = {
    yo: () => `<div class="about"><img class="about-photo" src="assets/img/lucas.webp" alt="Lucas Román Fernández" width="150" height="188"><div>${L.aboutYo(C.study.gpa)}
      <div class="proj-links"><button class="btn primary" data-open="cases">${L.aboutBtns[0]}</button><button class="btn" data-open="cv">${L.aboutBtns[1]}</button><button class="btn" data-open="mail">${L.aboutBtns[2]}</button></div></div></div>
      <div class="kpis">${L.kpis.map(([v, t]) => `<div class="kpi"><b>${v === "gpa" ? C.study.gpa : v}</b><span>${t}</span></div>`).join("")}</div>`,
    origen: () => L.origen,
    hago: () => `<div class="eyebrow">${L.skillsHead[0]}</div><h2 class="h2">${L.skillsHead[1]}</h2><div class="skills">${C.skills.map(([t, list], i) => `<div><div class="eyebrow">${esc(t)}</div><div class="chips" style="margin-top:6px">${list.map((x) => `<span class="chip${i === 0 ? " acc" : ""}">${esc(x)}</span>`).join("")}</div></div>`).join("")}</div>`
  };
  const aboutHTML = () => `<div class="notes"><nav class="notes-side">
      ${["yo", "origen", "hago"].map((k, i) => `<button data-note="${k}"${i === 0 ? ' class="on"' : ""}><b>${L.aboutTabs[i][0]}</b><small>${L.aboutTabs[i][1]}</small></button>`).join("")}</nav>
      <div class="notes-main"><div class="date" data-date></div><div data-note-body>${ABOUT.yo()}</div></div></div>`;

  const casesHTML = () => `<div class="finder"><nav class="finder-side" aria-label="${L.casesLbl}"><div class="lbl">${L.casesLbl}</div>${C.cases.map((c) => `<button data-case="${c.id}">${FOLD_S}${esc(c.side)}</button>`).join("")}</nav>
      <div class="finder-main"><div class="crumbs"><span data-crumb></span><span>${C.cases.length} ${L.folders}</span></div><div data-case-body></div></div></div>`;
  function caseBody(c) {
    let h = `<div class="case"><div class="eyebrow">${esc(c.tag)}</div><h2 class="h2">${esc(c.title)}</h2><p class="case-lead">${esc(c.lead)}</p>`;
    if (c.timeline) h += `<div class="mig">${c.timeline.map((t) => `<div class="${t.next ? "next" : ""}"><b>${esc(t.name)}</b><span><i></i>${esc(t.state)}</span></div>`).join("")}</div>`;
    if (c.flow) h += `<div class="case-sec"><div class="eyebrow">${esc(c.flowTitle)}</div><ol class="flow">${c.flow.map((f, i) => `<li class="flow-node${f[2] ? " hit" : ""}"><span class="flow-n">${i + 1}</span><b>${esc(f[0])}</b><small>${esc(f[1])}</small>${f[2] ? `<span class="flow-marks">${f[2].map((m) => `<i title="${L.incidents} ${m}">${m}</i>`).join("")}</span>` : ""}</li>`).join("")}</ol></div>`;
    if (c.gallery && c.gallery.length) h += `<div class="case-sec"><div class="gallery">${c.gallery.map((g) => `<figure><img src="${g[0]}" alt="${esc(g[1])}" loading="lazy"><figcaption>${esc(g[1])}</figcaption></figure>`).join("")}</div></div>`;
    if (c.tx) h += `<div class="case-sec"><div class="eyebrow">${esc(c.txTitle)}</div><div class="tx-wrap"><table class="tx"><tbody>${c.tx.map((t) => `<tr><th scope="row">${esc(t[0])}</th><td><code>${esc(t[1])}</code></td><td>${esc(t[2])}</td></tr>`).join("")}</tbody></table></div></div>`;
    if (c.objects) h += `<div class="case-sec"><div class="eyebrow">${L.objects}</div><div class="chips" style="margin-top:8px">${c.objects.map((o) => `<span class="chip acc">${esc(o)}</span>`).join("")}</div></div>`;
    if (c.incidents) h += `<div class="case-sec"><div class="eyebrow">${L.incidents}</div><div class="incidents">${c.incidents.map((x, i) => `<details class="incident"><summary><span><i class="inc-n">${i + 1}</i>${esc(x.title)}</span>${CHEV}</summary>
      <dl><dt>${L.dl[0]}</dt><dd>${esc(x.problem)}</dd><dt>${L.dl[1]}</dt><dd>${esc(x.cause)}</dd><dt>${L.dl[2]}</dt><dd>${esc(x.fix)}</dd></dl></details>`).join("")}</div></div>`;
    if (c.incidents && c.steps) h += `<div class="eyebrow" style="margin-top:22px">${L.howIncident}</div>`;
    if (c.archive) h += `<div class="archive">${c.archive.map((a) => `<a href="${a[2]}" target="_blank" rel="noopener"><b>${esc(a[0])} ↗</b><span>${esc(a[1])}</span></a>`).join("")}</div>`;
    if (c.steps) h += `<ol class="steps">${c.steps.map((s) => `<li><div><b>${esc(s[0])}</b><p>${esc(s[1])}</p></div></li>`).join("")}</ol>`;
    if (c.chips) h += `<div class="chips">${c.chips.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>`;
    if (c.links) h += `<div class="proj-links" style="margin-top:14px">${c.links.map((l) => `<a class="btn" href="${l[1]}" target="_blank" rel="noopener">${esc(l[0])} ↗</a>`).join("")}</div>`;
    return h + "</div>";
  }
  function showCase(w, id) {
    const c = C.cases.find((x) => x.id === id) || C.cases[0];
    w.dataset.curCase = c.id;
    w.querySelectorAll("[data-case]").forEach((b) => b.classList.toggle("on", b.dataset.case === c.id));
    $("[data-crumb]", w).textContent = L.crumbRoot + c.side;
    const body = $("[data-case-body]", w); body.innerHTML = caseBody(c); body.parentElement.scrollTop = 0;
  }

  const pathHTML = () => `<div class="track"><p class="track-hint">${L.trackHint}</p>${C.jobs.map((j, i) => `<details class="job"${i === 0 ? " open" : ""}>
      <summary><div class="when">${esc(j.when[0])}<br>${j.now ? `<span class="now">● ${esc(j.when[1])}</span>` : esc(j.when[1])}</div>
      <div class="job-head"><h3 class="h3">${esc(j.role)}</h3><div class="org">${esc(j.org)}${j.place ? ` <span class="muted">· ${esc(j.place)}</span>` : ""}</div><p>${esc(j.text)}</p></div>${CHEV}</summary>
      <div class="job-body">
        <div><div class="eyebrow">${L.resp}</div><ul class="job-list">${j.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>
        <div><div class="eyebrow">${L.toolsLbl}</div><div class="chips" style="margin-top:8px">${j.tools.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div></div>
        ${j.actions && j.actions.length ? `<div class="proj-links">${j.actions.map((x) => x.switchTo ? `<button class="btn" data-switch="${x.switchTo}">${esc(x.label)} →</button>` : `<button class="btn" data-open="${x.open}"${x.arg ? ` data-arg="${x.arg}"` : ""}>${esc(x.label)} →</button>`).join("")}</div>` : ""}
      </div></details>`).join("")}</div>`;

  function eduHTML() {
    const { done, total, gpa, since } = C.study, R = 2 * Math.PI * 56;
    return `<div class="pad"><div class="edu-top">
      <div class="ring" role="img" aria-label="${L.subjAria(done, total)}"><svg viewBox="0 0 132 132"><circle cx="66" cy="66" r="56" fill="none" stroke="var(--line)" stroke-width="10"/>
      <circle cx="66" cy="66" r="56" fill="none" stroke="var(--accent)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${R}" stroke-dashoffset="${R * (1 - done / total)}"/></svg>
      <div class="v"><div><b>${done}/${total}</b><br><small>${L.subjects}</small></div></div></div>
      <div><div class="eyebrow">${L.eduSub(since)}</div><h2 class="h2">${L.eduTitle}</h2>
      <p class="muted" style="margin:6px 0 0">${L.eduDesc}</p>
      <div class="chips" style="margin-top:10px"><span class="chip acc">${L.gpaLbl} ${gpa}</span><span class="chip">${Math.round(done / total * 100)}% ${L.ofCareer}</span></div></div></div>
      <div class="edu-list">${L.eduItems.map(([a, b, c]) => `<div class="edu-item"><div><b>${a}</b><div class="muted">${b}</div></div><span class="chip">${c}</span></div>`).join("")}</div></div>`;
  }

  const cvHTML = () => `<div class="pad cv-wrap"><div><div class="eyebrow">${L.cvHead[0]}</div><h2 class="h2">${L.cvHead[1]}</h2>
      <p class="muted" style="margin:6px 0 0">${L.cvDesc}</p></div>
      <div class="cv-cards"><a class="cv-card" href="${C.links.cvEs}" target="_blank" rel="noopener">${ai("cv")}<b>${L.cvLangs[0]}</b><span>LucasFernandezCV-Spanish.pdf</span></a>
      <a class="cv-card" href="${C.links.cvEn}" target="_blank" rel="noopener">${ai("cv")}<b>${L.cvLangs[1]}</b><span>LucasFernandezCV-English.pdf</span></a></div>
      <ul class="cv-list">${L.cvList(C.study.gpa).map((x) => `<li>${x}</li>`).join("")}</ul></div>`;

  const termHTML = () => `<div class="term"><div class="term-out" data-out><span class="d">${L.termHello[0]}</span><span class="o">help</span><span class="d">${L.termHello[1]}</span>\n</div>
      <label class="term-line"><span>lucas@lukyos ~ %</span><input data-in autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Command"></label></div>`;
  function runCmd(c) {
    const cmds = {
      help: () => L.cmdHelp,
      whoami: () => L.whoami(C.study.gpa),
      stack: () => "sap.s4hana  fi  migration_cockpit  ltmc  ltmom  abap_debug\nse16n  se38  se37  se24  me23n  fb03  slg1\npython  typescript  react-native  next  supabase\nlinux  nginx  systemd  github-actions",
      ls: () => C.cases.map((x) => x.side.replace(/\s/g, "_") + "/").join("  ") + "  CV.pdf",
      cv: () => { openApp("cv"); return L.opening + "…"; },
      lukychill: () => { setTimeout(() => enter("luky"), 350); return `${L.switching} <span class="o">Lukychill</span>…`; },
      sudo: () => L.sudo,
      english: () => { setTimeout(() => setLang("en"), 300); return "Switching to English…"; },
      espanol: () => { setTimeout(() => setLang("es"), 300); return "Cambiando a español…"; }
    };
    cmds[L.cmdCases] = cmds.casos = cmds.cases = () => { openApp("cases"); return L.opening + "…"; };
    cmds[L.cmdContact] = cmds.contacto = cmds.contact = () => { openApp("mail"); return C.email; };
    cmds["español"] = cmds.espanol;
    return cmds[c] ? cmds[c]() : `${L.notFound}: ${esc(c)} · ${L.tryHelp} <span class="o">help</span>`;
  }

  const mailHTML = (who) => {
    const M = L.mail;
    return `<form class="mailer" data-mail novalidate>
      <div class="row"><b>${M.to}</b><span class="addr">${C.email}</span><button type="button" class="btn" data-copy style="margin-left:auto;padding:4px 10px">${M.copy}</button></div>
      <div class="row"><label for="m-name-${who}"><b>${M.from}</b></label><input id="m-name-${who}" name="nombre" placeholder="${M.name}" required autocomplete="name"></div>
      <div class="row"><label for="m-mail-${who}"><b>${M.email}</b></label><input id="m-mail-${who}" name="email" type="email" maxlength="120" placeholder="${LANG === "en" ? "you@email.com" : "tu@email.com"}" required autocomplete="email"></div>
      <div class="suggest" data-suggest hidden></div>
      <div class="hp" aria-hidden="true"><label>No completar<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
      <div class="row"><label for="m-subj-${who}"><b>${M.subject}</b></label><input id="m-subj-${who}" name="asunto" value="${who === "luky" ? M.subjLuky : M.subjLucas}"></div>
      <div class="body"><label class="sr" for="m-body-${who}">${M.msg}</label><textarea id="m-body-${who}" name="mensaje" rows="6" required placeholder="${who === "luky" ? M.phLuky : M.phLucas}"></textarea></div>
      <div class="actions"><button class="btn primary" type="submit">${M.send}</button>
      ${who === "luky" ? "" : `<a class="btn" href="${C.links.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a><a class="btn" href="${C.links.github}" target="_blank" rel="noopener">GitHub ↗</a>`}</div>
      <div class="toast" data-toast hidden></div></form>`;
  };

  /* ---------------- Lukychill: ventanas ---------------- */
  function statsHTML() {
    const S = L.stats, p = STATS.platforms || {}, live = STATS.live || {};
    const max = Math.max(1, ...C.platforms.map(({ id }) => (p[id] && p[id].followers) || 0));
    const sum = C.platforms.reduce((t, { id }) => t + ((p[id] && p[id].followers) || 0), 0);
    const synced = C.platforms.filter(({ id }) => p[id] && p[id].followers).length, countable = C.platforms.filter(({ id, manual }) => !manual || (p[id] && p[id].followers)).length;
    const upd = STATS.updated ? new Date(STATS.updated).toLocaleString(locale(), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : null;
    const tiles = C.platforms.map(({ id, name, url, live: canLive, manual }) => {
      const d = p[id], on = !!live[id];
      const tag = canLive ? `<span class="dot-live ${on ? "on" : ""}"><i></i>${on ? L.live : L.offline}</span>` : "";
      if (d && d.followers) {
        const extra = [d.likes ? fmt(d.likes) + " " + S.likes : "", d.views ? fmt(d.views) + " " + S.views : "", d.videos ? d.videos + " " + S.videos : ""].filter(Boolean).join(" · ");
        return `<a class="plat" href="${url}" target="_blank" rel="noopener"><div class="top"><span class="nm">${name}</span>${tag}</div>
          <div><div class="num">${fmt(d.followers)}</div><div class="lab">${id === "youtube" ? S.subs : S.followers}${extra ? " · " + extra : ""}</div></div>
          <div class="bar"><i style="width:${Math.max(4, d.followers / max * 100)}%"></i></div></a>`;
      }
      if (manual) return `<a class="plat pending" href="${url}" target="_blank" rel="noopener"><div class="top"><span class="nm">${name}</span></div>
        <div><div class="num">${S.visit} ↗</div><div class="lab">${S.visitSub}</div></div><div class="bar"></div></a>`;
      return `<a class="plat pending" href="${url}" target="_blank" rel="noopener"><div class="top"><span class="nm">${name}</span>${tag}</div>
        <div><div class="num">${S.pending}</div><div class="lab">${S.pendingSub}</div></div><div class="bar"></div></a>`;
    }).join("");
    return `<div class="pad"><div class="stats-hero"><div style="display:flex;gap:16px;align-items:center"><img class="stats-face" src="assets/img/lukychill-avatar.webp" alt="" width="64" height="64">
      <div><div class="eyebrow">${S.total}</div><div class="big">${sum ? "+" + fmt(sum) : "—"}</div>
      <div class="muted" style="margin-top:6px">${synced >= countable ? S.sumAll : S.sumSome(synced, countable)}</div></div></div>
      <div class="sync ${upd ? "ok" : ""}"><i></i>${upd ? S.updated + " " + upd : S.waiting}</div></div>
      <div class="plats">${tiles}</div></div>`;
  }
  const rankHTML = () => {
    const years = new Date().getFullYear() - 2020, R = L.rank;
    return `<div class="pad"><div class="rank"><div class="crest">
      <svg viewBox="0 0 150 150" aria-hidden="true"><defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a3d"/><stop offset=".55" stop-color="#e2560a"/><stop offset="1" stop-color="#4c8dff"/></linearGradient></defs>
      <path d="M75 6 132 30v46c0 33-24 56-57 68C42 132 18 109 18 76V30z" fill="url(#cg)"/><path d="M75 18 121 38v38c0 26-19 45-46 56-27-11-46-30-46-56V38z" fill="#0d0f14" stroke="rgba(255,154,61,.5)" stroke-width="1.5"/></svg><b>GC</b></div>
      <div><div class="eyebrow">${R.eyebrow}</div><h2>Grand Champion</h2><p class="muted" style="margin:8px 0 0;max-width:46ch">${R.text}</p></div></div>
      <div class="rank-grid"><div class="kpi"><b>GC</b><span>${R.k[0]}</span></div><div class="kpi"><b>+${years}</b><span>${R.k[1]}</span></div><div class="kpi"><b>${C.platforms.length}</b><span>${R.k[2]}</span></div></div></div>`;
  };
  const clipsHTML = () => {
    const K = L.clips;
    if (C.clips.length) {
      return `<div class="pad"><div class="eyebrow">${K.eyebrowHL}</div><h2 class="h2">${K.titleHL}</h2><div class="channels">${C.clips.map((c) => `<a class="channel" href="${c.url}" target="_blank" rel="noopener"><b>${esc(c.title)} ↗</b><span>${esc(c.platform)}${c.note ? " · " + esc(c.note) : ""}</span></a>`).join("")}</div></div>`;
    }
    return `<div class="pad"><div class="eyebrow">${K.eyebrow}</div><h2 class="h2">${K.title}</h2><p class="muted" style="margin:6px 0 0">${K.desc}</p>
      <div class="channels">${C.platforms.map((p) => `<a class="channel" href="${p.url}" target="_blank" rel="noopener"><b>${p.name} ↗</b><span>@lukychill</span></a>`).join("")}</div></div>`;
  };
  const collabHTML = () => `<div class="pad"><div class="eyebrow">${L.collab.eyebrow}</div><h2 class="h2">${L.collab.title}</h2><p class="muted" style="margin:6px 0 0">${L.collab.desc}</p>
      <div class="collabs">${C.collabs.map((c) => `<div class="collab"><div class="lg">${esc(c.name[0])}</div><div><b>${esc(c.name)}</b><div class="muted">${esc(c.what)}</div></div><span class="chip">${esc(c.tag)}</span></div>`).join("")}</div>
      <button class="btn primary" data-open="kmail" style="margin-top:16px">${L.collab.cta}</button></div>`;
  const nextHTML = () => `<div class="pad"><div class="eyebrow">${L.next.eyebrow}</div><h2 class="h2">${L.next.title}</h2>
      <ol class="road">${C.roadmap.map((r) => `<li class="${r.state}"><span class="st">${esc(r.when)}</span><div><b>${esc(r.title)}</b><div class="muted">${esc(r.text)}</div></div></li>`).join("")}</ol></div>`;

  /* ---------------- Apps por usuario ---------------- */
  const APPS = {
    lucas: [
      { id: "about", ico: "about", w: 780, h: 740, html: aboutHTML },
      { id: "cases", ico: "cases", w: 880, h: 600, html: casesHTML },
      { id: "path", ico: "path", w: 720, h: 620, html: pathHTML },
      { id: "edu", ico: "edu", w: 640, h: 560, html: eduHTML },
      { id: "term", ico: "term", w: 580, h: 360, html: termHTML },
      { sep: true },
      { id: "cv", ico: "cv", w: 560, h: 470, html: cvHTML },
      { id: "mail", ico: "mail", w: 560, h: 520, html: () => mailHTML("lucas") }
    ],
    luky: [
      { id: "stats", ico: "stats", w: 820, h: 410, html: statsHTML },
      { id: "rank", ico: "rank", w: 600, h: 470, html: rankHTML },
      { id: "clips", ico: "clips", w: 640, h: 420, html: clipsHTML },
      { id: "collab", ico: "collab", w: 580, h: 470, html: collabHTML },
      { id: "next", ico: "next", w: 620, h: 500, html: nextHTML },
      { sep: true },
      { id: "kmail", ico: "mail", w: 560, h: 520, html: () => mailHTML("luky") }
    ]
  };
  const DESK = {
    lucas: { logo: "&lt;Lucas Fernández/&gt;", icons: () => [["cases", L.deskCases, "folderL"], ["path", L.deskPath, "folderL"], ["cv", "CV.pdf", "cv"]], hello: () => L.helloLucas, first: "about",
      notif: () => ({ ico: "cases", title: L.notifLucas[0], text: L.notifLucas[1], open: ["cases", "bot"] }) },
    luky: { logo: "&lt;Lukychill/&gt;", icons: () => [["clips", L.deskClips, "folderK"], ["collab", L.deskCollab, "folderK"]], hello: () => L.helloLuky, first: "stats",
      notif: () => ({ ico: "next", title: L.notifLuky[0], text: L.notifLuky[1], open: ["next"] }) }
  };

  /* ---------------- Gestor de ventanas ---------------- */
  let user = null, z = 10, cascade = 0;
  const open = new Map();
  const isMobile = () => matchMedia("(max-width:720px)").matches;
  const app = (id) => APPS[user].find((a) => a.id === id);

  function focusWin(w) {
    document.querySelectorAll(".win").forEach((x) => x.classList.add("unfocused"));
    w.classList.remove("unfocused"); w.style.zIndex = ++z; $("#appName").textContent = L.apps[w.dataset.id];
  }
  function winInner(a) {
    return `<header class="titlebar"><div class="lights">
        <button class="c" aria-label="${L.close}"><svg viewBox="0 0 10 10"><path d="M3 3l4 4M7 3L3 7"/></svg></button>
        <button class="m" aria-label="${L.minimize}"><svg viewBox="0 0 10 10"><path d="M2.5 5h5"/></svg></button>
        <button class="x" aria-label="${L.maximize}"><svg viewBox="0 0 10 10"><path d="M2.6 2.6h3.6L2.6 6.2zM7.4 7.4H3.8l3.6-3.6z"/></svg></button></div>
        <div class="ttl">${esc(L.titles[a.id])}</div></header><div class="win-body">${a.html()}</div>`;
  }
  function openApp(id, arg) {
    const a = app(id); if (!a) return;
    if (open.has(id)) { const w = open.get(id); w.hidden = false; focusWin(w); if (id === "cases" && arg) showCase(w, arg); return; }
    const area = $("#windows").getBoundingClientRect();
    const w = document.createElement("section");
    w.className = "win"; w.dataset.id = id;
    w.setAttribute("role", "dialog"); w.setAttribute("aria-label", L.titles[id]);
    const W = Math.min(a.w, area.width - 24), H = Math.min(a.h, area.height - 110);
    const first = open.size === 0 && area.width > 1100;
    const left = first ? Math.max(12, area.width - W - 150) : Math.max(12, Math.min((area.width - W) / 2 + cascade * 28 - 60, area.width - W - 12));
    const top = Math.max(12, Math.min((first ? 28 : 40) + cascade * 26, area.height - H - 100));
    cascade = (cascade + 1) % 5;
    Object.assign(w.style, { width: W + "px", height: H + "px", left: left + "px", top: top + "px" });
    w.innerHTML = winInner(a);
    $("#windows").appendChild(w); open.set(id, w); markDock();
    wire(w, id, arg); focusWin(w);
  }
  function closeWin(id) {
    const w = open.get(id); if (!w) return;
    w.classList.add("closing");
    setTimeout(() => { w.remove(); open.delete(id); markDock(); if (!open.size) $("#appName").textContent = L.desktop; }, 140);
  }
  const markDock = () => document.querySelectorAll(".dapp").forEach((d) => d.classList.toggle("running", open.has(d.dataset.app)));

  function wire(w, id, arg) {
    w.addEventListener("pointerdown", () => focusWin(w));
    w.addEventListener("click", (e) => {
      if (e.target.closest(".lights .c")) { e.stopPropagation(); return closeWin(id); }
      if (e.target.closest(".lights .m")) { e.stopPropagation(); w.hidden = true; $("#appName").textContent = L.desktop; return; }
      if (e.target.closest(".lights .x")) { e.stopPropagation(); return w.classList.toggle("max"); }
      const sw = e.target.closest("[data-switch]"); if (sw) return enter(sw.dataset.switch);
      const op = e.target.closest("[data-open]"); if (op) return openApp(op.dataset.open, op.dataset.arg);
      const cb = e.target.closest("button[data-case]"); if (cb) return showCase(w, cb.dataset.case);
      const nb = e.target.closest("button[data-note]");
      if (nb) { w.querySelectorAll("[data-note]").forEach((b) => b.classList.toggle("on", b === nb)); w.dataset.curNote = nb.dataset.note; $("[data-note-body]", w).innerHTML = ABOUT[nb.dataset.note](); }
    });
    w.addEventListener("dblclick", (e) => { if (e.target.closest(".titlebar") && !isMobile()) w.classList.toggle("max"); });
    w.addEventListener("pointerdown", (e) => {
      const tb = e.target.closest(".titlebar");
      if (!tb || isMobile() || e.target.closest(".lights") || w.classList.contains("max")) return;
      const sx = e.clientX, sy = e.clientY, ox = w.offsetLeft, oy = w.offsetTop, area = $("#windows").getBoundingClientRect();
      tb.setPointerCapture(e.pointerId);
      const mv = (ev) => {
        w.style.left = Math.min(Math.max(ox + ev.clientX - sx, -w.offsetWidth + 120), area.width - 120) + "px";
        w.style.top = Math.min(Math.max(oy + ev.clientY - sy, 0), area.height - 60) + "px";
      };
      const up = () => { tb.removeEventListener("pointermove", mv); tb.removeEventListener("pointerup", up); };
      tb.addEventListener("pointermove", mv); tb.addEventListener("pointerup", up);
    });
    fill(w, id, arg);
  }
  // Rellena lo dinámico de cada ventana (también al cambiar de idioma).
  function fill(w, id, arg) {
    if (id === "cases") showCase(w, arg || w.dataset.curCase);
    if (id === "about") {
      $("[data-date]", w).textContent = new Date().toLocaleDateString(locale(), { day: "numeric", month: "long", year: "numeric" });
      const n = w.dataset.curNote;
      if (n && n !== "yo") { w.querySelectorAll("[data-note]").forEach((b) => b.classList.toggle("on", b.dataset.note === n)); $("[data-note-body]", w).innerHTML = ABOUT[n](); }
    }
    if (id === "term") wireTerm(w);
    const form = $("[data-mail]", w); if (form) wireMail(form);
  }
  function wireTerm(w) {
    const inp = $("[data-in]", w), out = $("[data-out]", w), hist = []; let hi = 0;
    setTimeout(() => { if (!isMobile()) inp.focus(); }, 60);
    $(".term", w).addEventListener("click", () => { if (!getSelection().toString()) inp.focus(); });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && hist.length) { hi = Math.max(0, hi - 1); inp.value = hist[hi]; e.preventDefault(); return; }
      if (e.key === "ArrowDown" && hist.length) { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ""; e.preventDefault(); return; }
      if (e.key !== "Enter") return;
      const c = inp.value.trim().toLowerCase(); inp.value = "";
      if (c) { hist.push(c); hi = hist.length; }
      if (c === "clear") { out.innerHTML = ""; return; }
      const r = c ? runCmd(c) : "";
      out.innerHTML += `<span class="p">lucas@lukyos ~ %</span> ${esc(c)}\n${r ? r + "\n" : ""}`;
      out.parentElement.scrollTop = out.parentElement.scrollHeight;
    });
  }
  /* Dominios de mail temporal que se usan para spam */
  const DISPOSABLE = ["mailinator.com", "10minutemail.com", "10minutemail.net", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "grr.la", "tempmail.com", "temp-mail.org", "tempmail.net", "tempail.com", "yopmail.com", "yopmail.net", "trashmail.com", "getnada.com", "nada.email", "dispostable.com", "maildrop.cc", "throwawaymail.com", "fakeinbox.com", "mailnesia.com", "mohmal.com", "emailondeck.com", "minuteinbox.com", "mintemail.com", "spamgourmet.com", "mailcatch.com", "moakt.com", "tempr.email", "discard.email", "burnermail.io", "inboxkitten.com", "mytemp.email", "emailfake.com", "fakemail.net", "33mail.com"];
  /* Dominios comunes, para sugerir correcciones de tipeo */
  const COMMON = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "yahoo.com.ar", "hotmail.com.ar", "live.com", "live.com.ar", "icloud.com", "protonmail.com", "proton.me", "msn.com", "aol.com", "fibertel.com.ar", "outlook.es", "hotmail.es", "yahoo.es"];
  function lev(a, b) {
    const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function suggestDomain(dom) {
    if (!dom || COMMON.includes(dom)) return null;
    let best = null, bd = 3;
    COMMON.forEach((c) => { const k = lev(dom, c); if (k < bd) { bd = k; best = c; } });
    return bd <= 2 ? best : null;
  }
  function wireMail(form) {
    const M = L.mail, toast = $("[data-toast]", form), btn = $("button[type=submit]", form);
    const mailIn = $("input[name=email]", form), sug = $("[data-suggest]", form);
    const check = () => {
      const v = mailIn.value.trim(), at = v.lastIndexOf("@");
      const s = at > 0 ? suggestDomain(v.slice(at + 1).toLowerCase()) : null;
      if (!s) { sug.hidden = true; return; }
      const fixed = v.slice(0, at + 1) + s;
      sug.innerHTML = `${M.didYouMean} <button type="button">${esc(fixed)}</button>?`;
      sug.hidden = false;
      $("button", sug).onclick = () => { mailIn.value = fixed; sug.hidden = true; mailIn.focus(); };
    };
    mailIn.addEventListener("blur", check);
    mailIn.addEventListener("input", () => {
      if (/\s/.test(mailIn.value)) { const pos = mailIn.selectionStart; const before = mailIn.value.slice(0, pos).replace(/\s/g, "").length; mailIn.value = mailIn.value.replace(/\s/g, ""); try { mailIn.setSelectionRange(before, before); } catch (_) {} }
      if (!sug.hidden) check();
    });
    $("[data-copy]", form).onclick = async (e) => {
      const b = e.currentTarget;
      try { await navigator.clipboard.writeText(C.email); b.textContent = M.copied; }
      catch (_) { const r = document.createRange(); r.selectNodeContents($(".addr", form)); getSelection().removeAllRanges(); getSelection().addRange(r); b.textContent = M.selected; }
      setTimeout(() => (b.textContent = M.copy), 1600);
    };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const say = (msg, err) => { toast.hidden = false; toast.textContent = msg; toast.classList.toggle("err", !!err); };
      if (!form.checkValidity()) { say(M.invalid, true); return; }
      const dom = (mailIn.value.split("@")[1] || "").toLowerCase().trim();
      if (DISPOSABLE.some((d) => dom === d || dom.endsWith("." + d))) { say(M.temp, true); mailIn.focus(); return; }
      btn.disabled = true; btn.textContent = M.sending;
      try {
        const r = await fetch(C.formspree, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error();
        form.reset(); say(M.ok);
      } catch (_) { say(M.fail(C.email), true); }
      btn.disabled = false; btn.textContent = M.send;
    });
  }

  /* ---------------- Escritorio, dock, notificación ---------------- */
  function buildDesk() {
    const d = DESK[user];
    $("#deskLogo").innerHTML = d.logo;
    $("#hello").innerHTML = d.hello();
    $("#icons").innerHTML = d.icons().map(([id, n, k]) => `<button class="dicon" data-app="${id}">${DESK_ICONS[k] || ai(k)}<span>${n}</span></button>`).join("");
    $("#dock").innerHTML = APPS[user].map((a) => a.sep ? '<span class="sep" aria-hidden="true"></span>' : `<button class="dapp" data-app="${a.id}" aria-label="${L.apps[a.id]}">${ai(a.ico)}</button>`).join("");
    const lp = $("#livePill"), on = anyLive(), where = Object.keys(STATS.live || {}).filter((k) => STATS.live[k]).map((k) => k[0].toUpperCase() + k.slice(1)).join(" & ");
    lp.hidden = user !== "luky"; lp.classList.toggle("on", on);
    $("span", lp).textContent = on ? `${where} · ${L.live}` : L.streamsOff;
    markDock();
  }
  function notify(n) {
    const old = $(".notif"); if (old) old.remove();
    const el = document.createElement("button");
    el.className = "notif"; el.innerHTML = `${ai(n.ico)}<div><b>${esc(n.title)}</b><span>${esc(n.text)}</span></div><small>${L.now}</small>`;
    el.onclick = () => { el.remove(); openApp(n.open[0], n.open[1]); };
    $("#desktop").appendChild(el);
    setTimeout(() => el.remove(), 7000);
  }

  function dropNotif() { const n = $(".notif"); if (n) n.remove(); }

  /* tooltip del dock */
  const tipEl = $("#tip");
  function showTip(b) { const r = b.getBoundingClientRect(); tipEl.textContent = b.getAttribute("aria-label"); tipEl.style.left = r.left + r.width / 2 + "px"; tipEl.style.top = r.top - 14 + "px"; tipEl.hidden = false; }
  document.addEventListener("pointerover", (e) => { const b = e.target.closest(".dapp"); if (b && !isMobile()) showTip(b); else tipEl.hidden = true; });
  document.addEventListener("focusin", (e) => { const b = e.target.closest(".dapp"); if (b) showTip(b); });
  document.addEventListener("focusout", () => (tipEl.hidden = true));
  document.addEventListener("click", (e) => { const b = e.target.closest(".dapp,.dicon"); if (b) { tipEl.hidden = true; openApp(b.dataset.app); } });

  /* ---------------- Búsqueda (Spotlight) ---------------- */
  function spotItems() {
    const S = L.spot;
    const items = APPS[user].filter((a) => !a.sep).map((a) => ({ label: L.apps[a.id], kind: S.app, ico: a.ico, run: () => openApp(a.id) }));
    if (user === "lucas") C.cases.forEach((c) => items.push({ label: c.side + " — " + c.title, kind: S.case, ico: "cases", run: () => openApp("cases", c.id) }));
    items.push({ label: user === "lucas" ? S.toLuky : S.toLucas, kind: S.user, ico: user === "lucas" ? "stats" : "about", run: () => enter(user === "lucas" ? "luky" : "lucas") });
    items.push({ label: S.lang, kind: S.langKind, ico: "lang", run: () => setLang(LANG === "es" ? "en" : "es") });
    return items;
  }
  function openSpot() {
    if (!user || $(".spot-back")) return;
    const back = document.createElement("div");
    back.className = "spot-back";
    back.innerHTML = `<div class="spot" role="dialog" aria-label="${L.search}"><label class="spot-in"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>
      <input type="text" placeholder="${L.spot.ph}" aria-label="${L.search}" autocomplete="off"></label><ul class="spot-list" role="listbox"></ul></div>`;
    $("#desktop").appendChild(back);
    const inp = $("input", back), list = $("ul", back), all = spotItems(); let res = all, sel = 0;
    const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const draw = () => {
      list.innerHTML = res.length ? res.map((r, i) => `<li role="option" data-i="${i}" class="${i === sel ? "on" : ""}" aria-selected="${i === sel}">${ai(r.ico)}<span>${esc(r.label)}</span><span class="k">${r.kind}</span></li>`).join("") : `<li class="spot-empty">${L.spot.empty}</li>`;
    };
    const close = () => back.remove();
    const run = (i) => { const r = res[i]; if (r) { close(); r.run(); } };
    inp.addEventListener("input", () => { const q = norm(inp.value.trim()); res = q ? all.filter((r) => norm(r.label).includes(q)) : all; sel = 0; draw(); });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { sel = Math.min(res.length - 1, sel + 1); draw(); e.preventDefault(); }
      else if (e.key === "ArrowUp") { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
      else if (e.key === "Enter") run(sel);
      else if (e.key === "Escape") close();
    });
    list.addEventListener("click", (e) => { const li = e.target.closest("[data-i]"); if (li) run(+li.dataset.i); });
    back.addEventListener("click", (e) => { if (e.target === back) close(); });
    draw(); inp.focus();
  }
  $("#searchBtn").onclick = openSpot;

  /* ---------------- Idioma: textos fijos y cambio en vivo ---------------- */
  function applyStatic() {
    document.documentElement.lang = LANG;
    $(".boot-hint").textContent = L.bootHint;
    $("#boot").setAttribute("aria-label", L.skipBoot);
    const [lu, lk] = document.querySelectorAll(".user");
    $(".r", lu).innerHTML = L.lucasRole; $(".team", lu).textContent = L.work;
    $(".r", lk).innerHTML = L.lukyRole; $(".team", lk).textContent = L.social;
    $(".login-foot").innerHTML = L.loginFoot;
    $("#searchBtn span").textContent = L.search;
    $("#searchBtn").setAttribute("aria-label", L.search + " (Ctrl K)");
    $("#switchUser").textContent = L.switchUser;
    document.querySelectorAll("[data-lang]").forEach((b) => { b.classList.toggle("on", b.dataset.lang === LANG); b.setAttribute("aria-pressed", b.dataset.lang === LANG); });
    document.title = L.docTitle[user || "login"];
    tick();
  }
  function setLang(l) {
    if (l === LANG) return;
    LANG = l; L = T[l]; C = content(); local.set("lukyos-lang", l);
    try { const u = new URL(location.href); u.searchParams.delete("lang"); history.replaceState(null, "", u.pathname + u.search + u.hash); } catch (_) {}
    applyStatic();
    if (!user) return;
    dropNotif(); buildDesk();
    open.forEach((w, id) => {
      const a = app(id);
      w.setAttribute("aria-label", L.titles[id]);
      w.innerHTML = winInner(a);
      fill(w, id);
    });
    const top = [...open.values()].filter((w) => !w.hidden).sort((a, b) => b.style.zIndex - a.style.zIndex)[0];
    $("#appName").textContent = top ? L.apps[top.dataset.id] : L.desktop;
  }
  document.querySelectorAll("[data-lang]").forEach((b) => (b.onclick = () => setLang(b.dataset.lang)));

  /* ---------------- Flujo: boot → login → escritorio ---------------- */
  const show = (id) => ["boot", "login", "desktop"].forEach((s) => ($("#" + s).hidden = s !== id));
  function enter(u) {
    dropNotif(); user = u; open.forEach((w) => w.remove()); open.clear(); cascade = 0;
    const d = $("#desktop"); d.dataset.user = u; buildDesk(); show("desktop");
    document.title = L.docTitle[u];
    try { history.replaceState(null, "", location.pathname + location.search + "#" + (u === "luky" ? "lukychill" : "lucas")); } catch (_) {}
    $("#appName").textContent = L.desktop;
    openApp(DESK[u].first);
    if (!isMobile()) setTimeout(() => { if (user === u) notify(DESK[u].notif()); }, 1400);
  }
  function toLogin() {
    dropNotif(); user = null; open.forEach((w) => w.remove()); open.clear(); show("login");
    document.title = L.docTitle.login;
    try { history.replaceState(null, "", location.pathname + location.search); } catch (_) {}
  }
  document.querySelectorAll(".user").forEach((b) => (b.onclick = () => enter(b.dataset.go)));
  $("#switchUser").onclick = toLogin;

  function tick() {
    const n = new Date(), t = n.toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit", hour12: false });
    $("#lclock").textContent = t;
    const d = n.toLocaleDateString(locale(), { weekday: "long", day: "numeric", month: "long" });
    $("#ldate").textContent = d[0].toUpperCase() + d.slice(1);
    $("#mclock").textContent = n.toLocaleDateString(locale(), { weekday: "short" }).replace(".", "") + " " + t;
  }
  setInterval(tick, 15000);
  applyStatic();

  function route() {
    const h = location.hash.slice(1);
    if (h === "lucas") enter("lucas"); else if (h === "lukychill") enter("luky"); else show("login");
  }
  let booted = false;
  function finishBoot() { if (booted) return; booted = true; sess.set("lukyos-booted", "1"); route(); }
  $("#boot").addEventListener("click", finishBoot);
  $("#boot").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") finishBoot(); });
  window.addEventListener("hashchange", () => { if (booted) route(); });
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSpot(); return; }
    if (e.key === "Escape" && user && !$(".spot-back")) {
      const top = [...open.values()].filter((w) => !w.hidden).sort((a, b) => b.style.zIndex - a.style.zIndex)[0];
      if (top) closeWin(top.dataset.id);
    }
  });

  loadStats().finally(() => {
    const skip = matchMedia("(prefers-reduced-motion: reduce)").matches || sess.get("lukyos-booted") || location.hash;
    setTimeout(finishBoot, skip ? 0 : 1200);
  });
})();
