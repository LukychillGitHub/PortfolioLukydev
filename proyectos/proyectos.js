document.addEventListener("DOMContentLoaded", () => {
    const btnModo = document.getElementById("modoBtn");
    const icono = document.getElementById("iconoTema");
    const header = document.querySelector(".header");
  
    // 🌙 Aplicar tema guardado o sistema
    const temaGuardado = localStorage.getItem("tema");
  
    if (temaGuardado === "dark") {
      document.body.classList.add("dark");
    } else if (!temaGuardado && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add("dark");
    }
  
    // ☀️ Cambiar ícono
    function actualizarIcono() {
      const esDark = document.body.classList.contains("dark");
  
      icono.innerHTML = esDark
        ? `<path d="M21 12.79A9 9 0 0 1 11.21 3a7 7 0 1 0 9.79 9.79Z" fill="currentColor"/>`
        : `
          <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/>
          <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
          <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"/>
          <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2"/>
          <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2"/>
        `;
  
      // ✨ animación
      icono.classList.remove("rotate-sun", "rotate-moon");
      void icono.offsetWidth;
      icono.classList.add(esDark ? "rotate-moon" : "rotate-sun");
    }
  
    actualizarIcono();
  
    btnModo.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const esDark = document.body.classList.contains("dark");
      localStorage.setItem("tema", esDark ? "dark" : "light");
      actualizarIcono();
    });
  
    // 🌫️ Scroll efecto header
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  });
  