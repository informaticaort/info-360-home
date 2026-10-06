// Variables globales
let datos = [];

// Configuración de URLs de las hojas de Google Sheets
const excelUrls = {
  2024: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTG4QwspZOrk3UP6zhZVUcb4uSZxEUZGPE4Pda-WXNfiGYP11rftONqyU9SXJ8tJFBwv0SH-O0v0Py3/pub?gid=1832559583&single=true&output=tsv",
  2025: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTAe4sWUPODv6VHupXs6PVYVr5Fj_uMcdnsVa5KpW12t-LOWYifumX07vgXntmp3_Gj5X9HLeXywtOC/pub?gid=1832559583&single=true&output=tsv",
  2026: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRWZ_H1Qva3Sm8ij0fi9pSnOtOcUq4Q9q8v_yxUiy3ZXSEgLR6KBM1Bypczd3XZbSr7t0uCtTr48U0h/pub?gid=1062328248&single=true&output=tsv"
};

// Función para toggle de tema
function toggleTheme() {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  
  // Agregar efecto de rotación al botón
  themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
  
  setTimeout(() => {
    if (root.classList.contains('light-theme')) {
      // Cambiar a tema oscuro
      root.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      // Cambiar a tema claro
      root.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    }
    
    // Restaurar el botón
    themeToggle.style.transform = 'scale(1) rotate(0deg)';
  }, 150);
}

// Cargar tema guardado
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
  }
}

// Inicialización cuando se carga la página
window.onload = function () {
  loadSavedTheme();
  fetchTSV();
  setupEventListeners();
  initializeAnimations();
};

// Manejo del historial del navegador
window.addEventListener("popstate", function () {
  fetchTSV();
});

// Inicializar animaciones futuristas
function initializeAnimations() {
  // Crear partículas adicionales
  createParticles();
  
  // Inicializar efectos de hover mejorados
  initializeHoverEffects();
}

// Crear partículas animadas
function createParticles() {
  const particlesContainer = document.querySelector('.particles');
  if (!particlesContainer) return;
  
  // Crear partículas adicionales
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: var(--neon-cyan);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--neon-cyan);
      animation: particleFloat ${6 + i}s ease-in-out infinite;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation-delay: ${i * 1.5}s;
    `;
    particlesContainer.appendChild(particle);
  }
}

// Inicializar efectos de hover
function initializeHoverEffects() {
  // Agregar efectos de glow a los botones
  const buttons = document.querySelectorAll('.cyber-button');
  buttons.forEach(addHoverEffect);
}

function addHoverEffect(button) {
  button.addEventListener('mouseenter', () => {
    button.style.boxShadow = '0 0 30px var(--neon-cyan), inset 0 0 30px rgba(0, 245, 255, 0.1)';
  });

  button.addEventListener('mouseleave', () => {
    if (!button.classList.contains('seleccionado')) {
      button.style.boxShadow = '';
    }
  });
}

// Íconos conocidos por categoría (clave normalizada: primera palabra, minúsculas, sin tildes)
const iconosCategorias = {
  educacion: '🎓',
  impacto: '🌍',
  salud: '⚕️',
  social: '👥',
  'e-commerce': '🛒',
  ecommerce: '🛒',
  economia: '🛒',
  entretenimiento: '🍿'

};

function normalizarTexto(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function iconoCategoria(categoria) {
  const clave = normalizarTexto(categoria.split(' ')[0]);
  return iconosCategorias[clave] || '📁';
}

// ID de botón a partir del nombre de la categoría
function idCategoria(categoria) {
  if (categoria === 'Todos') return 'Todos';
  return 'cat-' + normalizarTexto(categoria).replace(/[^a-z0-9]+/g, '-');
}

function crearBotonCategoria(categoria, esMovil) {
  const boton = document.createElement('button');
  boton.id = (esMovil ? 'mobile-' : '') + idCategoria(categoria);
  boton.className = 'cyber-button';
  boton.setAttribute('aria-pressed', 'false');
  boton.innerHTML = `
    <span class="button-content">
      <span class="button-icon">${iconoCategoria(categoria)}</span>
      <span class="button-text"></span>
    </span>
    ${esMovil ? '' : '<div class="button-glow"></div>'}
  `;
  boton.querySelector('.button-text').textContent = categoria;
  boton.addEventListener('click', () => {
    mostrarCategoria(categoria);
    if (esMovil) closeMobileFilters();
  });
  addHoverEffect(boton);
  return boton;
}

// Generar botones de categorías a partir de los datos cargados
function generarBotonesCategorias() {
  const categorias = [...new Set(datos.map(item => item.Categoria))]
    .sort((a, b) => a.localeCompare(b, 'es'));

  const contenedores = [
    { el: document.querySelector('.nav-buttons'), esMovil: false },
    { el: document.querySelector('.mobile-filters-grid'), esMovil: true }
  ];

  contenedores.forEach(({ el, esMovil }) => {
    if (!el) return;
    // Quitar botones generados previamente (se conserva "Todos")
    el.querySelectorAll('.cyber-button[id*="cat-"]').forEach(btn => btn.remove());
    categorias.forEach(categoria => {
      el.appendChild(crearBotonCategoria(categoria, esMovil));
    });
  });
}

// Configurar event listeners después de que el DOM esté cargado
function setupEventListeners() {
  // Mejorar el buscador con debouncing
  const buscador = document.getElementById("buscador");
  if (buscador) {
    let searchTimeout;
    
    buscador.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const terminoBusqueda = buscador.value.trim().toLowerCase();
        updateActiveButton(null);
        filtrarProyectos(terminoBusqueda);
        
        // Sincronizar con buscador móvil
        const buscadorMovil = document.getElementById('buscadorMovil');
        if (buscadorMovil) {
          buscadorMovil.value = buscador.value;
        }
      }, 300);
    });
    
    // Limpiar búsqueda al perder foco
    buscador.addEventListener("blur", function () {
      setTimeout(() => {
        if (buscador.value === "") {
          mostrarTodos();
        }
      }, 100);
    });
  }

  // Configurar búsqueda móvil
  const buscadorMovil = document.getElementById('buscadorMovil');
  if (buscadorMovil) {
    let searchTimeout;
    
    buscadorMovil.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const terminoBusqueda = buscadorMovil.value.trim().toLowerCase();
        updateActiveButton(null);
        filtrarProyectos(terminoBusqueda);
      }, 300);
    });
    
    // Cerrar drawer al presionar Enter
    buscadorMovil.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const terminoBusqueda = buscadorMovil.value.trim().toLowerCase();
        
        if (terminoBusqueda) {
          // Realizar búsqueda inmediata
          clearTimeout(searchTimeout);
          updateActiveButton(null);
          filtrarProyectos(terminoBusqueda);
          
          // Cerrar drawer después de un pequeño delay para mostrar que se procesó la búsqueda
          setTimeout(() => {
            closeMobileFilters();
          }, 200);
        } else {
          // Si no hay texto, mostrar todos y cerrar
          mostrarTodos();
          closeMobileFilters();
        }
      }
    });
    
    // Sincronizar con el buscador principal
    buscadorMovil.addEventListener('focus', function() {
      const buscadorPrincipal = document.getElementById('buscador');
      if (buscadorPrincipal && buscadorPrincipal.value) {
        buscadorMovil.value = buscadorPrincipal.value;
      }
    });
  }

  // Configurar atajos de teclado
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('myModal');
      if (modal && modal.style.display === 'block') {
        modal.style.display = 'none';
      }
      
      // Cerrar drawer de filtros móvil con ESC
      const drawer = document.getElementById('mobileFiltersDrawer');
      if (drawer && drawer.classList.contains('mobile-drawer-open')) {
        closeMobileFilters();
      }
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const buscador = document.getElementById('buscador');
      if (buscador) {
        buscador.focus();
      }
    }
  });

  // Configurar modal
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];
  
  if (span) {
    span.onclick = function () {
      modal.style.display = "none";
    };
  }
  
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
  
  // Escuchar cambios en el tamaño de ventana para manejar vista móvil
  window.addEventListener('resize', function() {
    handleMobileView();
  });
  
  // Ejecutar al cargar
  handleMobileView();
}

// Función principal para obtener datos del TSV
async function fetchTSV() {
  try {
    showLoader();
    
    const urlParams = new URLSearchParams(window.location.search);
    const year = urlParams.get("year") || '2026';
    
    const response = await fetch(excelUrls[year]);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    const rows = data.split("\n").map(line => line.split("\t")).slice(1);
    
    if (rows.length < 2) {
      showEmptyState(year);
      return;
    }
    
    // Procesar datos con validación
    datos = rows.map(row => ({
      Id: row[0] || '',
      Curso: row[1] || '',
      Nombre: row[2] || 'Proyecto sin título',
      Descripcion: row[3] || 'Sin descripción disponible',
      Categoria: (row[5] || '').trim() || 'General',
      Logo: row[6] || 'https://via.placeholder.com/200x120?text=Logo',
      Integrantes: row[7] || 'No especificado'
    })).filter(item => item.Nombre && item.Nombre !== 'Proyecto sin título');
    
    hideLoader();
    generarBotonesCategorias();
    mostrarBotones();
    mostrarTodos();
    
    // Manejar vista móvil después de cargar datos
    handleMobileView();
    
    // Agregar efectos de entrada
    setTimeout(() => {
      addCardAnimations();
    }, 100);
    
  } catch (error) {
    console.error("Error al cargar datos:", error);
    showErrorState(error.message);
  }
}

// Agregar animaciones a las cards
function addCardAnimations() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Mostrar loader futurista
function showLoader() {
  const resultadoDiv = document.getElementById("resultado");
  if (resultadoDiv) {
    resultadoDiv.innerHTML = `
      <div class="loader-container">
        <div class="cyber-loader">
          <div class="loader-ring"></div>
          <div class="loader-ring"></div>
          <div class="loader-ring"></div>
          <span class="loader-text">Cargando proyectos...</span>
        </div>
      </div>
    `;
  }
}

// Ocultar loader
function hideLoader() {
  const loaderContainer = document.querySelector(".loader-container");
  if (loaderContainer) {
    loaderContainer.style.display = "none";
  }
}

// Mostrar estado vacío
function showEmptyState(year) {
  const resultadoDiv = document.getElementById("resultado");
  if (resultadoDiv) {
    resultadoDiv.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🚀</div>
        <h3>No hay proyectos disponibles</h3>
        <p>Aún no están registrados los proyectos del año ${year}.</p>
      </div>
    `;
  }
  esconderBotones();
}

// Mostrar estado de error
function showErrorState(error) {
  const resultadoDiv = document.getElementById("resultado");
  if (resultadoDiv) {
    resultadoDiv.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Error al cargar los proyectos</h3>
        <p>No se pudieron cargar los datos. Por favor, intenta nuevamente.</p>
        <button onclick="fetchTSV()" class="retry-button">🔄 Reintentar</button>
      </div>
    `;
  }
  esconderBotones();
}

// Función para girar tarjetas
function girarTarjeta(button) {
  const tarjeta = button.closest(".flip-card");
  if (tarjeta) {
    tarjeta.classList.toggle("girar");
    
    // Efecto visual del botón con sonido futurista
    button.style.transform = 'scale(0.9)';
    button.style.boxShadow = '0 0 20px var(--neon-cyan)';
    
    setTimeout(() => {
      button.style.transform = '';
      button.style.boxShadow = '';
    }, 200);
  }
}

// Función para mostrar categorías
function mostrarCategoria(categoria) {
  updateActiveButton(categoria);
  
  const categoriaData = datos.filter(item => item.Categoria === categoria);
  
  renderProjects(categoriaData);
}

// Función para mostrar todos los proyectos
function mostrarTodos() {
  updateActiveButton('Todos');
  renderProjects(datos);
}

/* Funciones para el drawer de filtros móvil */
function toggleMobileFilters() {
  const drawer = document.getElementById('mobileFiltersDrawer');
  if (drawer) {
    drawer.classList.add('mobile-drawer-open');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    
    // Sincronizar búsquedas al abrir
    syncSearchFields();
    
    // Sincronizar estado activo cuando se abre el drawer
    syncMobileButtonStates();
  }
}

// Función para sincronizar estados entre botones desktop y móvil
function syncMobileButtonStates() {
  const activeDesktopButton = document.querySelector('.cyber-button.seleccionado:not([id^="mobile-"])');
  
  if (activeDesktopButton) {
    const activeId = activeDesktopButton.id;
    const mobileButton = document.getElementById('mobile-' + activeId);
    
    if (mobileButton) {
      // Limpiar todos los botones móviles primero
      const mobileBotones = document.querySelectorAll('[id^="mobile-"].cyber-button');
      mobileBotones.forEach(btn => btn.classList.remove("seleccionado"));
      
      // Activar el botón móvil correspondiente
      mobileButton.classList.add("seleccionado");
    }
  } else {
    // Si no hay ningún botón activo, activar "Todos" por defecto en móvil
    const todosMobile = document.getElementById('mobile-Todos');
    if (todosMobile) {
      const mobileBotones = document.querySelectorAll('[id^="mobile-"].cyber-button');
      mobileBotones.forEach(btn => btn.classList.remove("seleccionado"));
      todosMobile.classList.add("seleccionado");
    }
  }
}

function closeMobileFilters(event) {
  if (event && event.target !== event.currentTarget) {
    return; // Solo cerrar si se hace clic en el fondo
  }
  
  const drawer = document.getElementById('mobileFiltersDrawer');
  if (drawer) {
    drawer.classList.remove('mobile-drawer-open');
    document.body.style.overflow = ''; // Restaurar scroll del body
    
    // Sincronizar búsquedas al cerrar
    syncSearchFields();
  }
}

// Función para sincronizar campos de búsqueda
function syncSearchFields() {
  const buscador = document.getElementById('buscador');
  const buscadorMovil = document.getElementById('buscadorMovil');
  
  if (buscador && buscadorMovil) {
    // Sincronizar del principal al móvil si el principal tiene contenido
    if (buscador.value.trim() && !buscadorMovil.value.trim()) {
      buscadorMovil.value = buscador.value;
    }
    // Sincronizar del móvil al principal si el móvil tiene contenido
    else if (buscadorMovil.value.trim()) {
      buscador.value = buscadorMovil.value;
    }
  }
}

// Actualizar botón activo con efectos futuristas (desktop y móvil)
function updateActiveButton(activeCategory) {
  // Limpiar todos los botones (desktop)
  const botones = document.querySelectorAll(".cyber-button");
  
  botones.forEach(boton => {
    boton.classList.remove("seleccionado");
    boton.style.boxShadow = '';
  });
  
  if (activeCategory) {
    // Actualizar botón desktop
    const idBoton = idCategoria(activeCategory);
    const botonActivo = document.getElementById(idBoton);
    if (botonActivo) {
      botonActivo.classList.add("seleccionado");
      botonActivo.style.boxShadow = '0 0 30px var(--neon-cyan), inset 0 0 30px rgba(0, 245, 255, 0.2)';
    }

    // Actualizar botón móvil correspondiente
    const botonMovil = document.getElementById('mobile-' + idBoton);
    if (botonMovil) {
      botonMovil.classList.add("seleccionado");
    }
  }
}

// Función para renderizar proyectos
function renderProjects(projects) {
  const resultadoDiv = document.getElementById("resultado");
  if (!resultadoDiv) return;
  
  if (projects.length === 0) {
    resultadoDiv.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No se encontraron proyectos</h3>
        <p>No hay proyectos disponibles para mostrar.</p>
      </div>
    `;
    return;
  }
  
  resultadoDiv.innerHTML = "";
  
  projects.forEach((item, index) => {
    const card = createProjectCard(item, index);
    resultadoDiv.appendChild(card);
  });
  
  // Agregar animaciones de entrada
  setTimeout(() => {
    addCardAnimations();
    // Asegurar vista móvil después de renderizar
    handleMobileView();
  }, 50);
}

// Crear tarjeta de proyecto futurista
function createProjectCard(item, index) {
  const card = document.createElement("div");
  card.classList.add("flip-card");
  
  const categoria = item.Categoria.replace(/ /g, "");
  const logoUrl = item.Logo || `https://placehold.co/200x120?text=${item.Logo}`;
  
  card.innerHTML = `
    <div class="flip-card-inner ${categoria}">
      <div class="flip-card-front">
        <div class="curso-container">
          <div class="curso-position ${categoria}-background">
            <p id="curso">${truncateText(item.Curso, 80)}</p>
          </div>
        </div>
        <div class="logo-container">
          <img src="${logoUrl}" alt="Logo del proyecto ${item.Nombre}" id="logo" 
               onerror="this.src='https://placehold.co/200x120?text=Logo'">
        </div>
        <h3>${truncateText(item.Nombre, 60)}</h3>
        <p id="integrantes">${truncateText(item.Integrantes, 80)}</p>
        <div class="ubicacion-boton">
          <button class="girar-button ${categoria}-background" 
                  onclick="girarTarjeta(this)" 
                  title="Ver descripción">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="flip-card-back">
        <h3 id="mg-top">${truncateText(item.Nombre, 60)}</h3>
        ${createDescription(item.Descripcion)}
        <p><strong>Categoría:</strong> ${item.Categoria}</p>
        <button class="girar-button ${categoria}-background circular" 
                onclick="girarTarjeta(this)" 
                title="Volver">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  // Asegurar visibilidad del botón
  setTimeout(() => {
    const buttons = card.querySelectorAll('.girar-button');
    const containers = card.querySelectorAll('.ubicacion-boton');
    
    // Aplicar clases CSS en lugar de estilos inline
    buttons.forEach(button => {
      button.classList.add('visible-button');
    });
    
    containers.forEach(container => {
      container.classList.add('visible-container');
    });
  }, 10);
  
  return card;
}

// Función para truncar texto
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  return text.substring(0, maxLength) + '...';
}

// Crear descripción
function createDescription(descripcion) {
  if (!descripcion || descripcion.length <= 100) {
    return `<p id="descCard">${descripcion || 'Sin descripción disponible'}</p>`;
  }
  
  const words = descripcion.split(" ");
  if (words.length <= 25) {
    return `<p id="descCard">${descripcion}</p>`;
  }
  
  const truncatedWords = words.slice(0, 25).join(" ");
  // Crear un ID único para evitar problemas con las comillas
  const descId = 'desc_' + Math.random().toString(36).substr(2, 9);
  
  // Guardar la descripción completa en una variable global
  if (!window.descripciones) {
    window.descripciones = {};
  }
  window.descripciones[descId] = descripcion;
  
  return `<p onclick="mostrarDescripcionCompleta('${descId}')" 
             title="Clic para leer más" 
             id="descCard"
             style="cursor: pointer;">
             ${truncatedWords}... 
             <strong style="color: var(--neon-cyan); text-shadow: 0 0 10px var(--neon-cyan);">[Ver más]</strong>
           </p>`;
}

// Función para el modal mejorada
function mostrarDescripcionCompleta(descId) {
  const modal = document.getElementById("myModal");
  const modalParagraph = document.getElementById("modalParagraph");
  
  if (modal && modalParagraph) {
    // Obtener la descripción del objeto global
    const descripcion = window.descripciones && window.descripciones[descId] 
      ? window.descripciones[descId] 
      : descId; // Fallback si no encuentra el ID
    
    modalParagraph.textContent = descripcion;
    modal.style.display = "block";
    
    // Agregar animación de entrada futurista
    modal.style.animation = 'fadeIn 0.5s ease';
    
    // Agregar efecto de glow al modal
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.style.boxShadow = '0 0 50px var(--neon-cyan), inset 0 0 50px rgba(0, 245, 255, 0.1)';
    }
    
    // Enfocar el modal para accesibilidad
    modal.focus();
  }
}

// Función para filtrar proyectos
function filtrarProyectos(termino) {
  if (!termino) {
    mostrarTodos();
    return;
  }
  
  const proyectosFiltrados = datos.filter(proyecto => {
    const searchFields = [
      proyecto.Nombre,
      proyecto.Integrantes,
      proyecto.Curso,
      proyecto.Categoria,
      proyecto.Descripcion
    ].map(field => (field || '').toLowerCase());
    
    return searchFields.some(field => field.includes(termino));
  });
  
  renderProjects(proyectosFiltrados);
}

// Función para detectar si es móvil
function isMobile() {
  return window.innerWidth <= 768;
}

// Variables para el scroll en móvil
let lastScrollTop = 0;
let scrollTimeout;

// Función para manejar el scroll en móvil
function handleMobileScroll() {
  if (!isMobile()) return;
  
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Limpiar timeout anterior
  clearTimeout(scrollTimeout);
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolleando hacia abajo - ocultar navbar
    navbar.classList.add('hidden');
  } else {
    // Scrolleando hacia arriba o cerca del top - mostrar navbar
    navbar.classList.remove('hidden');
  }
  
  // Actualizar posición anterior después de un delay
  scrollTimeout = setTimeout(() => {
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, 50);
}

// Manejar vista móvil
function handleMobileView() {
  const botones = document.querySelector(".botones-categorias");
  const buscador = document.getElementById("buscador");
  
  if (isMobile()) {
    // En móvil, la navbar es visible por CSS, solo gestionar scroll
    setupMobileScrollListener();
    
    // Asegurar que todos los botones de descripción sean visibles
    setTimeout(() => {
      const descriptionButtons = document.querySelectorAll('.girar-button');
      const buttonContainers = document.querySelectorAll('.ubicacion-boton');
      
      descriptionButtons.forEach(button => {
        button.style.display = 'flex';
        button.style.opacity = '1';
        button.style.visibility = 'visible';
        button.style.position = 'relative';
        button.style.zIndex = '20';
      });
      
      buttonContainers.forEach(container => {
        container.style.display = 'flex';
        container.style.visibility = 'visible';
      });
    }, 100);
    
  } else {
    // En desktop, mostrar navbar normal si hay datos
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      navbar.classList.remove('hidden');
      navbar.style.position = 'static'; // Resetear posición para desktop
    }
    
    if (datos.length > 0) {
      mostrarBotones();
    }
    
    // Remover listener de scroll en desktop
    window.removeEventListener('scroll', handleMobileScroll);
  }
}

// Configurar listener de scroll para móvil
function setupMobileScrollListener() {
  // Remover listener anterior si existe
  window.removeEventListener('scroll', handleMobileScroll);
  // Agregar nuevo listener
  window.addEventListener('scroll', handleMobileScroll, { passive: true });
}

// Funciones de utilidad para botones
function mostrarBotones() {
  const botones = document.querySelector(".botones-categorias");
  const buscador = document.getElementById("buscador");
  
  if (isMobile()) {
    // En móvil, la navbar ya es visible por CSS, solo asegurar que no esté oculta
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      navbar.style.display = "flex";
    }
  } else {
    // En desktop, mostrar botones normalmente
    if (botones) {
      botones.style.display = "flex";
      botones.style.animation = 'fadeIn 0.5s ease';
    }
    if (buscador) {
      buscador.style.display = "block";
    }
  }
}

function esconderBotones() {
  const botones = document.querySelector(".botones-categorias");
  const buscador = document.getElementById("buscador");
  
  if (botones) {
    botones.style.display = "none";
  }
  if (buscador) {
    buscador.style.display = "none";
  }
}

// Función para scroll to top con efectos
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  
  // Agregar efecto visual futurista
  const button = document.getElementById("scrollToTopButton");
  if (button) {
    button.style.transform = 'scale(0.8)';
    button.style.boxShadow = '0 0 40px var(--neon-cyan)';
    
    setTimeout(() => {
      button.style.transform = '';
      button.style.boxShadow = '';
    }, 200);
  }
}

// Manejo del scroll con efectos futuristas
window.addEventListener("scroll", function () {
  const scrollToTopButton = document.getElementById("scrollToTopButton");
  
  if (scrollToTopButton) {
    if (window.scrollY > 300) {
      scrollToTopButton.style.display = "flex";
      scrollToTopButton.style.animation = 'fadeIn 0.3s ease';
    } else {
      scrollToTopButton.style.display = "none";
    }
  }
  
  // Efecto parallax en el header
  const header = document.querySelector('.futuristic-header');
  if (header) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    header.style.transform = `translateY(${rate}px)`;
  }
});

// Agregar efectos de entrada al cargar
document.addEventListener('DOMContentLoaded', function() {
  // Agregar clase de carga
  document.body.classList.add('loading');
  
  // Quitar clase de carga después de un tiempo
  setTimeout(() => {
    document.body.classList.remove('loading');
  }, 1000);
});

// Agregar estilos dinámicos para efectos adicionales
const style = document.createElement('style');
style.textContent = `
  /* Efectos de carga */
  .loading {
    overflow: hidden;
  }
  
  .loading * {
    animation-play-state: paused !important;
  }
  
  /* Efectos de partículas */
  .particle {
    pointer-events: none;
  }
  
  /* Transiciones suaves */
  .flip-card {
    transition: all 0.3s ease;
  }
  
  /* Efectos de glow mejorados */
  .cyber-button:hover,
  .girar-button:hover {
    animation: buttonGlow 0.3s ease;
  }
  
  @keyframes buttonGlow {
    0% { box-shadow: 0 0 5px var(--neon-cyan); }
    50% { box-shadow: 0 0 30px var(--neon-cyan), inset 0 0 20px rgba(0, 245, 255, 0.2); }
    100% { box-shadow: 0 0 20px var(--neon-cyan), inset 0 0 10px rgba(0, 245, 255, 0.1); }
  }
  
  /* Animaciones de entrada */
  @keyframes slideInUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .card-container .flip-card {
    animation: slideInUp 0.6s ease forwards;
  }
`;
document.head.appendChild(style);

// Analytics (mantener el código original)
(function (h, o, t, j, a, r) {
  h.hj =
    h.hj ||
    function () {
      (h.hj.q = h.hj.q || []).push(arguments);
    };
  h._hjSettings = { hjid: 3697742, hjsv: 6 };
  a = o.getElementsByTagName("head")[0];
  r = o.createElement("script");
  r.async = 1;
  r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
  a.appendChild(r);
})(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
