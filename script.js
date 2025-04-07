document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("filtro");
  const sectores = document.querySelectorAll(".sector");
  const mensajeNoResultados = document.getElementById("mensaje-no-resultados"); // Mensaje global
  const textoBuscado = document.getElementById("texto-buscado"); // Span para mostrar la palabra

  // Función para actualizar la visibilidad de los controles del carrusel
  const actualizarControlesCarrusel = (sector) => {
    const simuladoresVisibles = sector.querySelectorAll(".simulador:not([style*='display: none'])").length;
    const controles = sector.querySelector(".carousel-controls");
    if (controles) {
      controles.style.display = simuladoresVisibles > 1 ? "flex" : "none";
    }
  };

  
  

  const resetearCarrusel = (sector) => {
    const track = sector.querySelector('.carousel-track');
    if (track) {
      track.style.transform = 'translateX(0)';
    }
  
    const dots = sector.querySelectorAll('.carousel-indicators .dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === 0);
    });
  };
  

  // Inicializar la visibilidad de los controles al cargar la página
  sectores.forEach(sector => actualizarControlesCarrusel(sector));

  // Evento para filtrar simuladores
  input.addEventListener("input", () => {
    const filtro = input.value.toLowerCase().trim();
    const hayFiltro = filtro.length > 0;
    const palabras = filtro.split(/\s+/); // divide por espacios
    let hayCoincidenciasGlobales = false;
  
    sectores.forEach(sector => {
      const simuladores = sector.querySelectorAll(".simulador");
      let sectorTieneCoincidencias = false;
  
      simuladores.forEach(simulador => {
        const keywords = simulador.dataset.keywords?.toLowerCase() || "";
        const contenidoVisible = simulador.textContent.toLowerCase();
  
        // ✅ Coincidencia si TODAS las palabras están presentes (puedes cambiarlo a "al menos una", si prefieres)
        const visible = palabras.some(palabra =>
          keywords.includes(palabra) || contenidoVisible.includes(palabra)
        );
  
        simulador.style.display = visible ? "block" : "none";
        if (visible) {
          sectorTieneCoincidencias = true;
          hayCoincidenciasGlobales = true;
        }
      });
  
      // Mostrar u ocultar el sector
      sector.style.display = (hayFiltro && !sectorTieneCoincidencias) ? "none" : "block";
  
      // Actualizar visibilidad de los controles
      actualizarControlesCarrusel(sector);
      // Reiniciar carrusel al inicio cuando hay filtro
const track = sector.querySelector(".carousel-track");
if (track) {
  track.style.transform = "translateX(0)";
}

// Ocultar todos los dots excepto los necesarios
const dots = sector.querySelectorAll('.carousel-indicators .dot');
if (dots.length > 0) {
  dots.forEach(dot => dot.classList.remove("active"));
  const primerVisible = sector.querySelector(".simulador:not([style*='display: none'])");
  const simuladores = Array.from(sector.querySelectorAll(".simulador"));
  const index = simuladores.indexOf(primerVisible);
  if (index >= 0 && dots[index]) {
    dots[index].classList.add("active");
  }
}
    });
    if (!hayFiltro) {
      sectores.forEach(sector => resetearCarrusel(sector));
    }
    
    // Mensaje global si no hay coincidencias
    if (mensajeNoResultados) {
      if (!hayCoincidenciasGlobales && hayFiltro) {
        mensajeNoResultados.style.display = "block";
        textoBuscado.textContent = filtro;
      } else {
        mensajeNoResultados.style.display = "none";
        textoBuscado.textContent = "";
      }
    }
  });


  const headerContent = document.querySelector('.header-content');
if (window.innerWidth <= 900) {
  headerContent.classList.add('movil');
}
  
});


// CARRUSEL + AUTO-SLIDE + PAUSA SI HAY BÚSQUEDA
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const items = Array.from(track.children).filter(el => el.classList.contains('simulador'));
  const prevBtn = carousel.querySelector('.carousel-btn.left');
  const nextBtn = carousel.querySelector('.carousel-btn.right');
  const indicators = carousel.querySelector('.carousel-indicators');

  let index = 0;
  let autoSlide;
  let isFiltering = false;

  // Crear puntos
  indicators.innerHTML = '';
  items.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    indicators.appendChild(dot);
    dot.addEventListener('click', () => {
      index = i;
      updateCarousel();
      if (!isFiltering) resetInterval();
    });
  });

  const updateCarousel = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    carousel.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  };

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + items.length) % items.length;
    updateCarousel();
    if (!isFiltering) resetInterval();
  });

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % items.length;
    updateCarousel();
    if (!isFiltering) resetInterval();
  });

  // Swipe táctil
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const diffX = e.touches[0].clientX - startX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        index = (index - 1 + items.length) % items.length;
      } else {
        index = (index + 1) % items.length;
      }
      updateCarousel();
      if (!isFiltering) resetInterval();
      isDragging = false;
    }
  });

  track.addEventListener('touchend', () => {
    isDragging = false;
  });

  function startAutoSlide() {
    if (items.length > 1) {
      autoSlide = setInterval(() => {
        if (!isFiltering) {
          index = (index + 1) % items.length;
          updateCarousel();
        }
      }, 3000);
    }
  }

  function resetInterval() {
    clearInterval(autoSlide);
    startAutoSlide();
  }

  startAutoSlide();

  // Pausar auto-slide durante búsqueda
  const input = document.getElementById('filtro');
  if (input) {
    input.addEventListener('input', () => {
      isFiltering = input.value.trim().length > 0;
      if (isFiltering) {
        clearInterval(autoSlide);
      } else {
        resetInterval();
      }
    });
  }
});

// MENSAJE SI NO HAY SIMULADORES
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const simuladores = track.querySelectorAll('.simulador');

  if (simuladores.length === 0) {
    const mensaje = document.createElement('div');
    mensaje.classList.add('mensaje-vacio');
    mensaje.textContent = '⚠️ Sin actividad actualmente';
    track.appendChild(mensaje);

    const controls = carousel.querySelector('.carousel-controls');
    const indicators = carousel.querySelector('.carousel-indicators');
    if (controls) controls.style.display = 'none';
    if (indicators) indicators.style.display = 'none';
  }
});

// 🌗 Detectar el modo del sistema automáticamente en cada carga
const toggle = document.getElementById("toggle-theme");
const body = document.body;
const label = document.querySelector(".modo-label");

// Detectar si el sistema prefiere oscuro
const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (prefiereOscuro) {
  body.classList.add("dark-mode");
  toggle.checked = true;
  label.textContent = "Modo claro";
} else {
  body.classList.remove("dark-mode");
  toggle.checked = false;
  label.textContent = "Modo oscuro";
}

// Al hacer clic, solo cambia visualmente (no se guarda)
toggle.addEventListener("change", () => {
  body.classList.toggle("dark-mode");
  const esOscuro = body.classList.contains("dark-mode");
  label.textContent = esOscuro ? "Modo claro" : "Modo oscuro";
});


