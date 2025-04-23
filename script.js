const frases = [
  "Soy lo que compilo",
  "Creo, me equivoco y aprendo.",
  "Ideas en código. Código en aprendizaje.",
];

let i = 0;
let j = 0;
let escribiendo = true;
const speed = 50;
const pausaEntreFrases = 2000;

const contenedor = document.getElementById("texto");

function escribir() {
  if (escribiendo) {
    if (j < frases[i].length) {
      contenedor.textContent += frases[i].charAt(j);
      j++;
      setTimeout(escribir, speed);
    } else {
      escribiendo = false;
      setTimeout(escribir, pausaEntreFrases);
    }
  } else {
    if (j > 0) {
      contenedor.textContent = frases[i].substring(0, j - 1);
      j--;
      setTimeout(escribir, speed / 2);
    } else {
      escribiendo = true;
      i = (i + 1) % frases.length;
      setTimeout(escribir, speed);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  escribir();

  const btnModo = document.getElementById("modoBtn");
  const icono = document.getElementById("iconoTema");

  const temaGuardado = localStorage.getItem("tema");

if (temaGuardado) {
  if (temaGuardado === "dark") {
    document.body.classList.add("dark");
  }
} else {
  const sistemaEnDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (sistemaEnDark) {
    document.body.classList.add("dark");
  }
}

  

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
    // ✨ animación con dirección según el ícono
icono.classList.remove("rotate-sun", "rotate-moon");
void icono.offsetWidth;
icono.classList.add(esDark ?  "rotate-moon" : "rotate-sun");

  }
  

  actualizarIcono();

  btnModo.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    // Guardar nuevo estado
    const esDark = document.body.classList.contains("dark");
    localStorage.setItem("tema", esDark ? "dark" : "light");

    actualizarIcono();
  });

  // 🌫️ Efecto scroll para header
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
});


document.querySelectorAll('.btn-exp').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.btn-exp').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
    const tab = btn.dataset.tab;

    document.querySelectorAll('.exp-item').forEach(item => {
      item.classList.toggle('oculto', item.dataset.tab !== tab);
    });
  });
});

// Animacion de Entry/out experiencia
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.exp-item').forEach(item => {
  observer.observe(item);
});
