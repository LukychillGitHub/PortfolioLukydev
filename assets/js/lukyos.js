/* LukyOS: boot → login con dos usuarios → escritorio con ventanas, dock y búsqueda. */
(function () {
  "use strict";
  const C = window.LUKY;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (_) {} }
  };

  /* ---------------- Métricas (data/stats.json lo genera la GitHub Action) ---------------- */
  let STATS = { updated: null, platforms: {}, live: {} };
  // Primero se lee del repo (se actualiza sin esperar a que GitHub Pages vuelva a publicar) y, si falla, la copia del sitio.
  const STATS_URLS = ["https://raw.githubusercontent.com/LukychillGitHub/PortfolioLukydev/main/data/stats.json", "data/stats.json"];
  async function loadStats() {
    for (const url of STATS_URLS) {
      try {
        const r = await fetch(url, { cache: "no-store" });
        if (r.ok) { const j = await r.json(); if (j && j.platforms) { STATS = j; return; } }
      } catch (_) { /* probar la siguiente */ }
    }
  }
  const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(".", ",") + "M" : n >= 1e3 ? Math.round(n / 1e3) + "K" : String(n);
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
    next: '<rect x="3.5" y="7" width="12" height="10" rx="2"/><path d="M15.5 11l5-3v8l-5-3z"/>'
  };
  const ai = (k) => `<span class="ai" data-k="${k}" aria-hidden="true"><svg viewBox="0 0 24 24">${G[k]}</svg></span>`;
  const FOLDER = (c1, c2) => `<span class="folder-ico" aria-hidden="true"><svg viewBox="0 0 56 46"><path d="M3 7a4 4 0 0 1 4-4h13l4.5 4.5H49a4 4 0 0 1 4 4V39a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" fill="${c2}"/><path d="M3 14h50v25a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" fill="${c1}"/><path d="M3 14h50" stroke="rgba(255,255,255,.35)"/></svg></span>`;
  const FOLD_S = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M2 4.5a1 1 0 0 1 1-1h3l1.5 1.5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/></svg>';
  const DESK_ICONS = { folderL: FOLDER("#7aa5ff", "#4d82f0"), folderK: FOLDER("#ff8f3a", "#c95a10") };

  /* ---------------- Lucas: ventanas ---------------- */
  const ABOUT = {
    yo: () => `<div class="about"><img class="about-photo" src="assets/img/lucas.webp" alt="Lucas Román Fernández" width="150" height="188"><div>
      <div class="eyebrow">Perfil profesional</div>
      <h2>Lucas Román Fernández</h2>
      <p class="about-role">Analista de Tecnología · SAP S/4HANA · Migración de datos y análisis funcional</p>
      <p>Soy Analista de Tecnología en Molinos Río de la Plata. Participo en la integración a SAP S/4HANA de las empresas que adquiere la compañía y en la resolución de incidentes de Comercio Exterior como analista funcional.</p>
      <p>Mi perfil combina conocimiento de los procesos de negocio con formación técnica: curso Ingeniería en Informática en la Universidad del Salvador y desarrollo proyectos propios de automatización e integración de APIs con Python y TypeScript.</p>
      <p>Trabajo con un método simple: entender el proceso, aislar la causa raíz con evidencia y dejar la solución documentada para que el equipo pueda sostenerla.</p>
      <div class="proj-links"><button class="btn primary" data-open="cases">Ver casos</button><button class="btn" data-open="cv">Currículum</button><button class="btn" data-open="mail">Contacto</button></div></div></div>
      <div class="kpis"><div class="kpi"><b>3</b><span>Empresas integradas a SAP</span></div><div class="kpi"><b>${C.study.gpa}</b><span>Promedio académico</span></div><div class="kpi"><b>2</b><span>Proyectos propios en producción</span></div></div>`,
    origen: () => `<div class="eyebrow">Recorrido</div><h2 class="h2">De la electromecánica a SAP</h2>
      <p style="max-width:62ch;margin-top:10px">Mi formación empezó en la Escuela Técnica Henry Ford, donde me recibí de Técnico Electromecánico. Ahí tuve el primer contacto con la programación a través de la robótica, y fue lo que me llevó a elegir Ingeniería en Informática.</p>
      <p style="max-width:62ch">Pasé por una pasantía de calidad en Ford Argentina, más de dos años como docente de informática y, desde 2026, el área de Tecnología de Molinos. En cada etapa sumé algo distinto: el rigor de la industria, la capacidad de explicar lo técnico y la visión de los procesos de negocio.</p>
      <p style="max-width:62ch">En paralelo construí Lukychill, una comunidad de gaming en redes que me enseñó a analizar métricas y sostener un proyecto propio en el tiempo.</p>`,
    hago: () => `<div class="eyebrow">Competencias</div><h2 class="h2">Con qué trabajo</h2><div class="skills">${C.skills.map(([t, list], i) => `<div><div class="eyebrow">${esc(t)}</div><div class="chips" style="margin-top:6px">${list.map((x) => `<span class="chip${i === 0 ? " acc" : ""}">${esc(x)}</span>`).join("")}</div></div>`).join("")}</div>`
  };
  const aboutHTML = () => `<div class="notes"><nav class="notes-side" aria-label="Secciones">
      <button data-note="yo" class="on"><b>Perfil</b><small>Resumen profesional</small></button>
      <button data-note="origen"><b>Recorrido</b><small>Cómo llegué hasta acá</small></button>
      <button data-note="hago"><b>Competencias</b><small>SAP, desarrollo e infraestructura</small></button></nav>
      <div class="notes-main"><div class="date" data-date></div><div data-note-body>${ABOUT.yo()}</div></div></div>`;

  const casesHTML = () => `<div class="finder"><nav class="finder-side" aria-label="Casos"><div class="lbl">Casos</div>${C.cases.map((c) => `<button data-case="${c.id}">${FOLD_S}${esc(c.side)}</button>`).join("")}</nav>
      <div class="finder-main"><div class="crumbs"><span data-crumb></span><span>${C.cases.length} carpetas</span></div><div data-case-body></div></div></div>`;
  function caseBody(c) {
    let h = `<div class="case"><div class="eyebrow">${esc(c.tag)}</div><h2 class="h2">${esc(c.title)}</h2><p class="case-lead">${esc(c.lead)}</p>`;
    if (c.timeline) h += `<div class="mig">${c.timeline.map((t) => `<div class="${t.next ? "next" : ""}"><b>${esc(t.name)}</b><span><i></i>${esc(t.state)}</span></div>`).join("")}</div>`;
    if (c.archive) h += `<div class="archive">${c.archive.map((a) => `<a href="${a[2]}" target="_blank" rel="noopener"><b>${esc(a[0])} ↗</b><span>${esc(a[1])}</span></a>`).join("")}</div>`;
    if (c.steps) h += `<ol class="steps">${c.steps.map((s) => `<li><div><b>${esc(s[0])}</b><p>${esc(s[1])}</p></div></li>`).join("")}</ol>`;
    if (c.chips) h += `<div class="chips">${c.chips.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>`;
    if (c.links) h += `<div class="proj-links" style="margin-top:14px">${c.links.map((l) => `<a class="btn" href="${l[1]}" target="_blank" rel="noopener">${esc(l[0])} ↗</a>`).join("")}</div>`;
    return h + "</div>";
  }
  function showCase(w, id) {
    const c = C.cases.find((x) => x.id === id) || C.cases[0];
    w.querySelectorAll("[data-case]").forEach((b) => b.classList.toggle("on", b.dataset.case === c.id));
    $("[data-crumb]", w).textContent = "Lucas › Casos › " + c.side;
    const body = $("[data-case-body]", w); body.innerHTML = caseBody(c); body.parentElement.scrollTop = 0;
  }

  const CHEV = '<svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4l4 4-4 4"/></svg>';
  const pathHTML = () => `<div class="track"><p class="track-hint">Tocá un puesto para ver el detalle.</p>${C.jobs.map((j, i) => `<details class="job"${i === 0 ? " open" : ""}>
      <summary><div class="when">${esc(j.when[0])}<br>${j.now ? `<span class="now">● ${esc(j.when[1])}</span>` : esc(j.when[1])}</div>
      <div class="job-head"><h3 class="h3">${esc(j.role)}</h3><div class="org">${esc(j.org)}${j.place ? ` <span class="muted">· ${esc(j.place)}</span>` : ""}</div><p>${esc(j.text)}</p></div>${CHEV}</summary>
      <div class="job-body">
        <div><div class="eyebrow">Responsabilidades</div><ul class="job-list">${j.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>
        <div><div class="eyebrow">Herramientas y conocimientos</div><div class="chips" style="margin-top:8px">${j.tools.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div></div>
        ${j.actions && j.actions.length ? `<div class="proj-links">${j.actions.map((x) => x.switchTo ? `<button class="btn" data-switch="${x.switchTo}">${esc(x.label)} →</button>` : `<button class="btn" data-open="${x.open}"${x.arg ? ` data-arg="${x.arg}"` : ""}>${esc(x.label)} →</button>`).join("")}</div>` : ""}
      </div></details>`).join("")}</div>`;

  function eduHTML() {
    const { done, total, gpa, since } = C.study, R = 2 * Math.PI * 56;
    return `<div class="pad"><div class="edu-top">
      <div class="ring" role="img" aria-label="${done} de ${total} materias aprobadas"><svg viewBox="0 0 132 132"><circle cx="66" cy="66" r="56" fill="none" stroke="var(--line)" stroke-width="10"/>
      <circle cx="66" cy="66" r="56" fill="none" stroke="var(--accent)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${R}" stroke-dashoffset="${R * (1 - done / total)}"/></svg>
      <div class="v"><div><b>${done}/${total}</b><br><small>materias</small></div></div></div>
      <div><div class="eyebrow">Universidad del Salvador · ${since} – hoy</div><h2 class="h2">Ingeniería en Informática</h2>
      <p class="muted" style="margin:6px 0 0">Programación, estructuras de datos, bases de datos, sistemas operativos y modelado.</p>
      <div class="chips" style="margin-top:10px"><span class="chip acc">Promedio ${gpa}</span><span class="chip">${Math.round(done / total * 100)}% de la carrera</span></div></div></div>
      <div class="edu-list"><div class="edu-item"><div><b>Técnico Electromecánico</b><div class="muted">Escuela Técnica Henry Ford · 2015 – 2022</div></div><span class="chip">Promedio 7,95</span></div>
      <div class="edu-item"><div><b>Excel Experto</b><div class="muted">UTN · Certificación</div></div><span class="chip">82/100</span></div>
      <div class="edu-item"><div><b>Inglés</b><div class="muted">Nivel intermedio alto</div></div><span class="chip">B2</span></div></div></div>`;
  }

  const cvHTML = () => `<div class="pad cv-wrap"><div><div class="eyebrow">Currículum</div><h2 class="h2">Una página, en dos idiomas</h2>
      <p class="muted" style="margin:6px 0 0">Experiencia en SAP, proyectos propios y formación, listo para leer o pasar por un ATS.</p></div>
      <div class="cv-cards"><a class="cv-card" href="${C.links.cvEs}" target="_blank" rel="noopener">${ai("cv")}<b>Español</b><span>LucasFernandezCV-Spanish.pdf</span></a>
      <a class="cv-card" href="${C.links.cvEn}" target="_blank" rel="noopener">${ai("cv")}<b>English</b><span>LucasFernandezCV-English.pdf</span></a></div>
      <ul class="cv-list"><li>Analista de Tecnología en Molinos Río de la Plata</li><li>Bot de republicación de videos y PassportPlanner</li><li>Ingeniería en Informática, promedio ${C.study.gpa}</li></ul></div>`;

  const termHTML = () => `<div class="term"><div class="term-out" data-out><span class="d">LukyOS · escribí </span><span class="o">help</span><span class="d"> para ver comandos</span>\n</div>
      <label class="term-line"><span>lucas@lukyos ~ %</span><input data-in autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Comando"></label></div>`;
  const CMDS = {
    help: () => '<span class="g">whoami</span>    quién soy\n<span class="g">casos</span>     abrir casos resueltos\n<span class="g">stack</span>     con qué trabajo\n<span class="g">cv</span>        ver el currículum\n<span class="g">contacto</span>  escribirme\n<span class="g">lukychill</span> cambiar al otro usuario\n<span class="g">clear</span>     limpiar',
    whoami: () => `Lucas Román Fernández · Analista de Tecnología (SAP)\nIngeniería en Informática · USAL · promedio ${C.study.gpa}`,
    stack: () => "sap.s4hana  migration_cockpit  ltmc  ltmom\npython  typescript  react-native  next  supabase\nlinux  nginx  systemd  github-actions",
    ls: () => C.cases.map((c) => c.side.replace(/\s/g, "_") + "/").join("  ") + "  CV.pdf",
    cv: () => { openApp("cv"); return "Abriendo el currículum…"; },
    casos: () => { openApp("cases"); return "Abriendo Casos…"; },
    contacto: () => { openApp("mail"); return C.email; },
    lukychill: () => { setTimeout(() => enter("luky"), 350); return 'Cambiando a <span class="o">Lukychill</span>…'; },
    sudo: () => "Buen intento. Acá el admin es SAP."
  };

  const mailHTML = (who) => `<form class="mailer" data-mail novalidate>
      <div class="row"><b>Para</b><span class="addr">${C.email}</span><button type="button" class="btn" data-copy style="margin-left:auto;padding:4px 10px">Copiar</button></div>
      <div class="row"><label for="m-name-${who}"><b>De</b></label><input id="m-name-${who}" name="nombre" placeholder="Tu nombre" required autocomplete="name"></div>
      <div class="row"><label for="m-mail-${who}"><b>Email</b></label><input id="m-mail-${who}" name="email" type="email" placeholder="tu@email.com" required autocomplete="email"></div>
      <div class="row"><label for="m-subj-${who}"><b>Asunto</b></label><input id="m-subj-${who}" name="asunto" value="${who === "luky" ? "Colaboración con Lukychill" : "Contacto desde tu portfolio"}"></div>
      <div class="body"><label class="sr" for="m-body-${who}">Mensaje</label><textarea id="m-body-${who}" name="mensaje" rows="6" required placeholder="${who === "luky" ? "Contame sobre la marca, la campaña y los tiempos." : "Contame en qué te puedo ayudar."}"></textarea></div>
      <div class="actions"><button class="btn primary" type="submit">Enviar</button>
      ${who === "luky" ? "" : `<a class="btn" href="${C.links.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a><a class="btn" href="${C.links.github}" target="_blank" rel="noopener">GitHub ↗</a>`}</div>
      <div class="toast" data-toast hidden></div></form>`;

  /* ---------------- Lukychill: ventanas ---------------- */
  function statsHTML() {
    const p = STATS.platforms || {}, live = STATS.live || {};
    const max = Math.max(1, ...C.platforms.map(({ id }) => (p[id] && p[id].followers) || 0));
    const sum = C.platforms.reduce((t, { id }) => t + ((p[id] && p[id].followers) || 0), 0);
    const synced = C.platforms.filter(({ id }) => p[id] && p[id].followers).length;
    const upd = STATS.updated ? new Date(STATS.updated).toLocaleString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : null;
    const tiles = C.platforms.map(({ id, name, url, live: canLive }) => {
      const d = p[id], on = !!live[id];
      const tag = canLive ? `<span class="dot-live ${on ? "on" : ""}"><i></i>${on ? "EN VIVO" : "offline"}</span>` : "";
      if (d && d.followers) {
        const extra = [d.likes ? fmt(d.likes) + " likes" : "", d.views ? fmt(d.views) + " vistas" : "", d.videos ? d.videos + " videos" : ""].filter(Boolean).join(" · ");
        return `<a class="plat" href="${url}" target="_blank" rel="noopener"><div class="top"><span class="nm">${name}</span>${tag}</div>
          <div><div class="num">${fmt(d.followers)}</div><div class="lab">${id === "youtube" ? "suscriptores" : "seguidores"}${extra ? " · " + extra : ""}</div></div>
          <div class="bar"><i style="width:${Math.max(4, d.followers / max * 100)}%"></i></div></a>`;
      }
      return `<a class="plat pending" href="${url}" target="_blank" rel="noopener"><div class="top"><span class="nm">${name}</span>${tag}</div>
        <div><div class="num">Sin conectar</div><div class="lab">Se completa al sincronizar</div></div><div class="bar"></div></a>`;
    }).join("");
    return `<div class="pad"><div class="stats-hero"><div style="display:flex;gap:16px;align-items:center"><img class="stats-face" src="assets/img/lukychill-avatar.webp" alt="" width="64" height="64">
      <div><div class="eyebrow">Comunidad total</div><div class="big">${sum ? "+" + fmt(sum) : "—"}</div>
      <div class="muted" style="margin-top:6px">seguidores sumando ${synced === C.platforms.length ? "todas las plataformas" : `${synced} de ${C.platforms.length} plataformas`}</div></div></div>
      <div class="sync ${upd ? "ok" : ""}"><i></i>${upd ? "Actualizado " + upd : "Esperando la primera sincronización"}</div></div>
      <div class="plats">${tiles}</div></div>`;
  }
  const rankHTML = () => {
    const years = new Date().getFullYear() - 2020;
    return `<div class="pad"><div class="rank"><div class="crest">
      <svg viewBox="0 0 150 150" aria-hidden="true"><defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a3d"/><stop offset=".55" stop-color="#e2560a"/><stop offset="1" stop-color="#4c8dff"/></linearGradient></defs>
      <path d="M75 6 132 30v46c0 33-24 56-57 68C42 132 18 109 18 76V30z" fill="url(#cg)"/><path d="M75 18 121 38v38c0 26-19 45-46 56-27-11-46-30-46-56V38z" fill="#0d0f14" stroke="rgba(255,154,61,.5)" stroke-width="1.5"/></svg><b>GC</b></div>
      <div><div class="eyebrow">Rocket League</div><h2>Grand Champion</h2><p class="muted" style="margin:8px 0 0;max-width:46ch">Del rango al contenido: jugadas, desafíos y formatos cortos pensados para la comunidad competitiva.</p></div></div>
      <div class="rank-grid"><div class="kpi"><b>GC</b><span>Rango alcanzado</span></div><div class="kpi"><b>+${years}</b><span>Años creando</span></div><div class="kpi"><b>${C.platforms.length}</b><span>Plataformas</span></div></div></div>`;
  };
  const clipsHTML = () => {
    if (C.clips.length) {
      return `<div class="pad"><div class="eyebrow">Clips destacados</div><h2 class="h2">Lo mejor del canal</h2><div class="channels">${C.clips.map((c) => `<a class="channel" href="${c.url}" target="_blank" rel="noopener"><b>${esc(c.title)} ↗</b><span>${esc(c.platform)}${c.note ? " · " + esc(c.note) : ""}</span></a>`).join("")}</div></div>`;
    }
    return `<div class="pad"><div class="eyebrow">Videos</div><h2 class="h2">Dónde ver el contenido</h2><p class="muted" style="margin:6px 0 0">Clips de Rocket League, desafíos y directos.</p>
      <div class="channels">${C.platforms.map((p) => `<a class="channel" href="${p.url}" target="_blank" rel="noopener"><b>${p.name} ↗</b><span>@lukychill</span></a>`).join("")}</div></div>`;
  };
  const collabHTML = () => `<div class="pad"><div class="eyebrow">Marcas</div><h2 class="h2">Colaboraciones</h2><p class="muted" style="margin:6px 0 0">Marcas del ecosistema gamer y de Rocket League que trabajaron con el canal.</p>
      <div class="collabs">${C.collabs.map((c) => `<div class="collab"><div class="lg">${esc(c.name[0])}</div><div><b>${esc(c.name)}</b><div class="muted">${esc(c.what)}</div></div><span class="chip">${esc(c.tag)}</span></div>`).join("")}</div>
      <button class="btn primary" data-open="kmail" style="margin-top:16px">Proponer una colaboración</button></div>`;
  const nextHTML = () => `<div class="pad"><div class="eyebrow">Hoja de ruta</div><h2 class="h2">Lo que viene en el canal</h2>
      <ol class="road">${C.roadmap.map((r) => `<li class="${r.state}"><span class="st">${esc(r.when)}</span><div><b>${esc(r.title)}</b><div class="muted">${esc(r.text)}</div></div></li>`).join("")}</ol></div>`;

  /* ---------------- Apps por usuario ---------------- */
  const APPS = {
    lucas: [
      { id: "about", name: "Sobre mí", ico: "about", title: "Notas — Sobre mí", w: 780, h: 740, html: aboutHTML },
      { id: "cases", name: "Casos", ico: "cases", title: "Casos", w: 880, h: 600, html: casesHTML },
      { id: "path", name: "Trayectoria", ico: "path", title: "Trayectoria", w: 720, h: 620, html: pathHTML },
      { id: "edu", name: "Formación", ico: "edu", title: "Formación", w: 640, h: 560, html: eduHTML },
      { id: "term", name: "Terminal", ico: "term", title: "lucas — zsh", w: 580, h: 360, html: termHTML },
      { sep: true },
      { id: "cv", name: "Currículum", ico: "cv", title: "Currículum", w: 560, h: 470, html: cvHTML },
      { id: "mail", name: "Contacto", ico: "mail", title: "Nuevo mensaje", w: 560, h: 520, html: () => mailHTML("lucas") }
    ],
    luky: [
      { id: "stats", name: "Stats", ico: "stats", title: "Stats — en vivo", w: 820, h: 410, html: statsHTML },
      { id: "rank", name: "Rango", ico: "rank", title: "Rango", w: 600, h: 470, html: rankHTML },
      { id: "clips", name: "Videos", ico: "clips", title: "Videos", w: 640, h: 420, html: clipsHTML },
      { id: "collab", name: "Collabs", ico: "collab", title: "Colaboraciones", w: 580, h: 470, html: collabHTML },
      { id: "next", name: "Lo que viene", ico: "next", title: "Lo que viene", w: 620, h: 500, html: nextHTML },
      { sep: true },
      { id: "kmail", name: "Contacto marcas", ico: "mail", title: "Nuevo mensaje", w: 560, h: 520, html: () => mailHTML("luky") }
    ]
  };
  const DESK = {
    lucas: {
      icons: [["cases", "Casos", "folderL"], ["path", "Trayectoria", "folderL"], ["cv", "CV.pdf", "cv"]],
      hello: `<div class="eyebrow">Analista de Tecnología · SAP S/4HANA</div><h1>Lucas<br>Fernández</h1><p>Migración de datos, análisis funcional y resolución de incidentes. Los proyectos están en <b>Casos</b>, en el dock.</p>`,
      first: "about",
      notif: { ico: "cases", title: "Nuevo caso", text: "Bot de videos: un link de TikTok, tres redes publicadas.", open: ["cases", "bot"] }
    },
    luky: {
      icons: [["clips", "Videos", "folderK"], ["collab", "Collabs", "folderK"]],
      hello: `<div class="eyebrow">@lukychill · Rocket League</div><h1>Luky<br>chill</h1><p>Grand Champion, streams y lo que viene: vlog con alma gamer.</p>`,
      first: "stats",
      notif: { ico: "next", title: "Próximamente", text: "Vlog con alma gamer: la oficina, la facu y las partidas.", open: ["next"] }
    }
  };

  /* ---------------- Gestor de ventanas ---------------- */
  let user = null, z = 10, cascade = 0;
  const open = new Map();
  const isMobile = () => matchMedia("(max-width:720px)").matches;
  const app = (id) => APPS[user].find((a) => a.id === id);

  function focusWin(w) {
    document.querySelectorAll(".win").forEach((x) => x.classList.add("unfocused"));
    w.classList.remove("unfocused"); w.style.zIndex = ++z; $("#appName").textContent = w.dataset.name;
  }
  function openApp(id, arg) {
    const a = app(id); if (!a) return;
    if (open.has(id)) { const w = open.get(id); w.hidden = false; focusWin(w); if (id === "cases" && arg) showCase(w, arg); return; }
    const area = $("#windows").getBoundingClientRect();
    const w = document.createElement("section");
    w.className = "win"; w.dataset.id = id; w.dataset.name = a.name;
    w.setAttribute("role", "dialog"); w.setAttribute("aria-label", a.title);
    const W = Math.min(a.w, area.width - 24), H = Math.min(a.h, area.height - 110);
    const first = open.size === 0 && area.width > 1100;
    const left = first ? Math.max(12, area.width - W - 150) : Math.max(12, Math.min((area.width - W) / 2 + cascade * 28 - 60, area.width - W - 12));
    const top = Math.max(12, Math.min((first ? 28 : 40) + cascade * 26, area.height - H - 100));
    cascade = (cascade + 1) % 5;
    Object.assign(w.style, { width: W + "px", height: H + "px", left: left + "px", top: top + "px" });
    w.innerHTML = `<header class="titlebar"><div class="lights">
        <button class="c" aria-label="Cerrar"><svg viewBox="0 0 10 10"><path d="M3 3l4 4M7 3L3 7"/></svg></button>
        <button class="m" aria-label="Minimizar"><svg viewBox="0 0 10 10"><path d="M2.5 5h5"/></svg></button>
        <button class="x" aria-label="Maximizar"><svg viewBox="0 0 10 10"><path d="M2.6 2.6h3.6L2.6 6.2zM7.4 7.4H3.8l3.6-3.6z"/></svg></button></div>
        <div class="ttl">${esc(a.title)}</div></header><div class="win-body">${a.html()}</div>`;
    $("#windows").appendChild(w); open.set(id, w); markDock();
    wire(w, id, arg); focusWin(w);
  }
  function closeWin(id) {
    const w = open.get(id); if (!w) return;
    w.classList.add("closing");
    setTimeout(() => { w.remove(); open.delete(id); markDock(); if (!open.size) $("#appName").textContent = "Escritorio"; }, 140);
  }
  const markDock = () => document.querySelectorAll(".dapp").forEach((d) => d.classList.toggle("running", open.has(d.dataset.app)));

  function wire(w, id, arg) {
    w.addEventListener("pointerdown", () => focusWin(w));
    $(".c", w).onclick = (e) => { e.stopPropagation(); closeWin(id); };
    $(".m", w).onclick = (e) => { e.stopPropagation(); w.hidden = true; $("#appName").textContent = "Escritorio"; };
    $(".x", w).onclick = (e) => { e.stopPropagation(); w.classList.toggle("max"); };
    const tb = $(".titlebar", w);
    tb.addEventListener("dblclick", () => { if (!isMobile()) w.classList.toggle("max"); });
    tb.addEventListener("pointerdown", (e) => {
      if (isMobile() || e.target.closest(".lights") || w.classList.contains("max")) return;
      const sx = e.clientX, sy = e.clientY, ox = w.offsetLeft, oy = w.offsetTop, area = $("#windows").getBoundingClientRect();
      tb.setPointerCapture(e.pointerId);
      const mv = (ev) => {
        w.style.left = Math.min(Math.max(ox + ev.clientX - sx, -w.offsetWidth + 120), area.width - 120) + "px";
        w.style.top = Math.min(Math.max(oy + ev.clientY - sy, 0), area.height - 60) + "px";
      };
      const up = () => { tb.removeEventListener("pointermove", mv); tb.removeEventListener("pointerup", up); };
      tb.addEventListener("pointermove", mv); tb.addEventListener("pointerup", up);
    });
    w.addEventListener("click", (e) => {
      const sw = e.target.closest("[data-switch]"); if (sw) return enter(sw.dataset.switch);
      const op = e.target.closest("[data-open]"); if (op) return openApp(op.dataset.open, op.dataset.arg);
      const cb = e.target.closest("[data-case]"); if (cb) return showCase(w, cb.dataset.case);
      const nb = e.target.closest("[data-note]");
      if (nb) { w.querySelectorAll("[data-note]").forEach((b) => b.classList.toggle("on", b === nb)); $("[data-note-body]", w).innerHTML = ABOUT[nb.dataset.note](); }
    });
    if (id === "cases") showCase(w, arg);
    if (id === "about") $("[data-date]", w).textContent = new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
    if (id === "term") wireTerm(w);
    const form = $("[data-mail]", w); if (form) wireMail(form);
  }
  function wireTerm(w) {
    const inp = $("[data-in]", w), out = $("[data-out]", w), hist = []; let hi = 0;
    setTimeout(() => { if (!isMobile()) inp.focus(); }, 60);
    w.addEventListener("click", () => { if (!getSelection().toString()) inp.focus(); });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && hist.length) { hi = Math.max(0, hi - 1); inp.value = hist[hi]; e.preventDefault(); return; }
      if (e.key === "ArrowDown" && hist.length) { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ""; e.preventDefault(); return; }
      if (e.key !== "Enter") return;
      const c = inp.value.trim().toLowerCase(); inp.value = "";
      if (c) { hist.push(c); hi = hist.length; }
      if (c === "clear") { out.innerHTML = ""; return; }
      const r = c ? (CMDS[c] ? CMDS[c]() : `comando no encontrado: ${esc(c)} · probá <span class="o">help</span>`) : "";
      out.innerHTML += `<span class="p">lucas@lukyos ~ %</span> ${esc(c)}\n${r ? r + "\n" : ""}`;
      out.parentElement.scrollTop = out.parentElement.scrollHeight;
    });
  }
  function wireMail(form) {
    const toast = $("[data-toast]", form), btn = $("button[type=submit]", form);
    $("[data-copy]", form).onclick = async (e) => {
      const b = e.currentTarget;
      try { await navigator.clipboard.writeText(C.email); b.textContent = "Copiado"; }
      catch (_) { const r = document.createRange(); r.selectNodeContents($(".addr", form)); getSelection().removeAllRanges(); getSelection().addRange(r); b.textContent = "Seleccionado"; }
      setTimeout(() => (b.textContent = "Copiar"), 1600);
    };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const say = (msg, err) => { toast.hidden = false; toast.textContent = msg; toast.classList.toggle("err", !!err); };
      if (!form.checkValidity()) { say("Completá tu nombre, un email válido y el mensaje.", true); return; }
      btn.disabled = true; btn.textContent = "Enviando…";
      try {
        const r = await fetch(C.formspree, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error();
        form.reset(); say("Mensaje enviado. Te respondo a la brevedad.");
      } catch (_) { say("No se pudo enviar. Escribime directamente a " + C.email + ".", true); }
      btn.disabled = false; btn.textContent = "Enviar";
    });
  }

  /* ---------------- Escritorio, dock, notificación ---------------- */
  function buildDesk() {
    const d = DESK[user];
    $("#hello").innerHTML = d.hello;
    $("#icons").innerHTML = d.icons.map(([id, n, k]) => `<button class="dicon" data-app="${id}">${DESK_ICONS[k] || ai(k)}<span>${n}</span></button>`).join("");
    $("#dock").innerHTML = APPS[user].map((a) => a.sep ? '<span class="sep" aria-hidden="true"></span>' : `<button class="dapp" data-app="${a.id}" aria-label="${a.name}">${ai(a.ico)}</button>`).join("");
    const lp = $("#livePill"), on = anyLive(), where = Object.keys(STATS.live || {}).filter((k) => STATS.live[k]).map((k) => k[0].toUpperCase() + k.slice(1)).join(" y ");
    lp.hidden = user !== "luky"; lp.classList.toggle("on", on);
    $("span", lp).textContent = on ? `${where} · EN VIVO` : "Streams · offline";
  }
  function notify(n) {
    const old = $(".notif"); if (old) old.remove();
    const el = document.createElement("button");
    el.className = "notif"; el.innerHTML = `${ai(n.ico)}<div><b>${esc(n.title)}</b><span>${esc(n.text)}</span></div><small>ahora</small>`;
    el.onclick = () => { el.remove(); openApp(n.open[0], n.open[1]); };
    $("#desktop").appendChild(el);
    setTimeout(() => el.remove(), 7000);
  }

  /* tooltip del dock */
  const tipEl = $("#tip");
  function showTip(b) { const r = b.getBoundingClientRect(); tipEl.textContent = b.getAttribute("aria-label"); tipEl.style.left = r.left + r.width / 2 + "px"; tipEl.style.top = r.top - 14 + "px"; tipEl.hidden = false; }
  document.addEventListener("pointerover", (e) => { const b = e.target.closest(".dapp"); if (b && !isMobile()) showTip(b); else tipEl.hidden = true; });
  document.addEventListener("focusin", (e) => { const b = e.target.closest(".dapp"); if (b) showTip(b); });
  document.addEventListener("focusout", () => (tipEl.hidden = true));
  document.addEventListener("click", (e) => { const b = e.target.closest(".dapp,.dicon"); if (b) { tipEl.hidden = true; openApp(b.dataset.app); } });

  /* ---------------- Búsqueda (Spotlight) ---------------- */
  function spotItems() {
    const items = APPS[user].filter((a) => !a.sep).map((a) => ({ label: a.name, kind: "App", ico: a.ico, run: () => openApp(a.id) }));
    if (user === "lucas") C.cases.forEach((c) => items.push({ label: c.side + " — " + c.title, kind: "Caso", ico: "cases", run: () => openApp("cases", c.id) }));
    items.push({ label: user === "lucas" ? "Cambiar a Lukychill" : "Cambiar a Lucas Fernández", kind: "Usuario", ico: user === "lucas" ? "stats" : "about", run: () => enter(user === "lucas" ? "luky" : "lucas") });
    return items;
  }
  function openSpot() {
    if (!user || $(".spot-back")) return;
    const back = document.createElement("div");
    back.className = "spot-back";
    back.innerHTML = `<div class="spot" role="dialog" aria-label="Buscar"><label class="spot-in"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>
      <input type="text" placeholder="Buscar apps, casos…" aria-label="Buscar" autocomplete="off"></label><ul class="spot-list" role="listbox"></ul></div>`;
    $("#desktop").appendChild(back);
    const inp = $("input", back), list = $("ul", back), all = spotItems(); let res = all, sel = 0;
    const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const draw = () => {
      list.innerHTML = res.length ? res.map((r, i) => `<li role="option" data-i="${i}" class="${i === sel ? "on" : ""}" aria-selected="${i === sel}">${ai(r.ico)}<span>${esc(r.label)}</span><span class="k">${r.kind}</span></li>`).join("") : '<li class="spot-empty">Sin resultados</li>';
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

  /* ---------------- Flujo: boot → login → escritorio ---------------- */
  const show = (id) => ["boot", "login", "desktop"].forEach((s) => ($("#" + s).hidden = s !== id));
  function enter(u) {
    user = u; open.forEach((w) => w.remove()); open.clear(); cascade = 0;
    const d = $("#desktop"); d.dataset.user = u; buildDesk(); show("desktop");
    document.title = (u === "luky" ? "Lukychill" : "Lucas Fernández") + " · LukyOS";
    try { history.replaceState(null, "", "#" + (u === "luky" ? "lukychill" : "lucas")); } catch (_) {}
    openApp(DESK[u].first);
    if (!isMobile()) setTimeout(() => { if (user === u) notify(DESK[u].notif); }, 1400);
  }
  function toLogin() {
    user = null; open.forEach((w) => w.remove()); open.clear(); show("login");
    document.title = "Lucas Fernández · LukyOS";
    try { history.replaceState(null, "", location.pathname + location.search); } catch (_) {}
  }
  document.querySelectorAll(".user").forEach((b) => (b.onclick = () => enter(b.dataset.go)));
  $("#switchUser").onclick = toLogin;

  function tick() {
    const n = new Date(), t = n.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
    $("#lclock").textContent = t;
    const d = n.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }); $("#ldate").textContent = d[0].toUpperCase() + d.slice(1);
    $("#mclock").textContent = n.toLocaleDateString("es-AR", { weekday: "short" }).replace(".", "") + " " + t;
  }
  tick(); setInterval(tick, 15000);

  function route() {
    const h = location.hash.slice(1);
    if (h === "lucas") enter("lucas"); else if (h === "lukychill") enter("luky"); else show("login");
  }
  let booted = false;
  function finishBoot() { if (booted) return; booted = true; store.set("lukyos-booted", "1"); route(); }
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
    const skip = matchMedia("(prefers-reduced-motion: reduce)").matches || store.get("lukyos-booted") || location.hash;
    setTimeout(finishBoot, skip ? 0 : 1200);
  });
})();
