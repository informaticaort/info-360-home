window.onload = function () {
  fetchTSV();
};

window.addEventListener("popstate", function () {
  fetchTSV();
});

const tsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTG4QwspZOrk3UP6zhZVUcb4uSZxEUZGPE4Pda-WXNfiGYP11rftONqyU9SXJ8tJFBwv0SH-O0v0Py3/pub?gid=1832559583&single=true&output=tsv"; // Reemplaza con la URL de tu archivo TSV

async function fetchTSV() {
  try {
    var loader = document.getElementById("loader");
    loader.style.display = "block";

    const response = await fetch(tsvUrl);
    const data = await response.text();

    let rows = data.split("\n").map((line) => line.split("\t"));
    rows = rows.slice(1, rows.length);

    datos = rows.map((row) => {
      return {
        Id: row[0],
        Curso: row[1],
        Nombre: row[2],
        Integrantes: row[7],
        Descripcion: row[3],
        Categoria: row[5],
        Logo: row[6],
      };
    });

    console.log("Datos cargados:", datos);

    loader.style.display = "none";
  } catch (error) {
    console.error("Error al leer el archivo TSV:", error);
  }
  mostrarTodos();
}

function girarTarjeta(button) {
  const tarjeta = button.closest(".flip-card");
  tarjeta.classList.toggle("girar");
}

function mostrarCategoria(categoria) {
  var resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "";

  var categoriaData = datos.filter(function (item) {
    return item.Categoria.split(" ")[0].includes(categoria);
  });

  if (categoriaData.length > 0) {
    categoriaData.forEach(function (item) {
      var card = document.createElement("div");
      card.classList.add("flip-card");
      let cat = item.Categoria.replace(/ /g, "");
      card.innerHTML = `
          <div class="flip-card-inner ${cat}">
              <div class="flip-card-front ">
                  <div class="curso-container">
                    <div class="curso-position ${cat}-background">
                      <p id="curso">${item.Curso?.slice(0, 80)}</p>
                    </div>
                  </div>
                  <div >
                      <img src=${item.Logo} alt="Avatar" id="logo">
                  </div>
                  <h3>${item.Nombre}</h3>
                  <p id="integrantes">${item.Integrantes?.slice(0, 80)}</p>
                  <div class="ubicacion-boton">
                  <button class="girar-button ${cat}-background" onclick="girarTarjeta(this)">+</button>
                  </div>
                  </div>
              <div class="flip-card-back">
                  <h3 id="mg-top">${item.Nombre}</h3>
                  ${truncateDescription(item.Descripcion, 25, item)}

                 <p><b>Categoria</b>: ${item.Categoria}</p>
                  <button class="girar-button ${cat}-background circular" onclick="girarTarjeta(this)">Volver</button>
              </div>
          </div>
      `;
      resultadoDiv.appendChild(card);
    });

    var botones = document.querySelectorAll(".botones-categorias button");

    botones.forEach(function (boton) {
      boton.classList.remove("button-" + boton.id);
      boton.classList.remove("Todos");
      boton.classList.remove("seleccionado");
    });
    console.log("a");
    document.getElementById(categoria).classList.add("seleccionado");
  } else {
    resultadoDiv.innerHTML =
      "<p>No hay datos disponibles para esta categoría.</p>";
  }
}

function mostrarTodos() {
  var botones = document.querySelectorAll(".botones-categorias button");
  botones.forEach(function (boton) {
    boton.className = "button-55";
  });
  var botonSeleccionado = document.getElementById("Todos");
  if (botonSeleccionado) {
    botonSeleccionado.classList.add("seleccionado");
  }
  var resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "";

  datos.forEach(function (item) {
    var card = document.createElement("div");
    var card = document.createElement("div");
    card.classList.add("flip-card");
    let cat = item.Categoria.replace(/ /g, "");
    card.innerHTML = `
          <div class="flip-card-inner ${cat}">
              <div class="flip-card-front ">
                  <div class="curso-container">
                    <div class="curso-position ${cat}-background">
                      <p id="curso">${item.Curso?.slice(0, 80)}</p>
                    </div>
                  </div>
                  <div >
                      <img src=${item.Logo} alt="Avatar" id="logo">
                  </div>
                  <h3>${item.Nombre}</h3>
                  <p id="integrantes">${item.Integrantes?.slice(0, 80)}</p>
                  <div class="ubicacion-boton">
                  <button class="girar-button ${cat}-background" onclick="girarTarjeta(this)">+</button>
                  </div>
                  </div>
              <div class="flip-card-back">
                  <h3 id="mg-top">${item.Nombre}</h3>
                  ${truncateDescription(item.Descripcion, 25, item)}

                 <p><b>Categoria</b>: ${item.Categoria}</p>
                  <button class="girar-button ${cat}-background circular" onclick="girarTarjeta(this)">Volver</button>
              </div>
          </div>
      `;
    resultadoDiv.appendChild(card);
  });
}

function truncateDescription(description, wordCount, item) {
  if (description?.length > 100) {
    const words = description.split(" ");
    if (words.length <= wordCount) {
      return `<p id="descCard">${description}</p><br>`;
    }
    let truncatedWords = words?.slice(0, wordCount);
    truncatedWords = truncatedWords.join(" ");

    return `<p onclick="mostrarDescripcionCompleta('${description}')" title="leer +" id="descCard">${truncatedWords} ... <b>[+]</b></p>
  
  `;
  } else {
    return `<p id="descCard">${description}</p><br>`;
  }
}

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var modalParagraph = document.getElementById("modalParagraph");
var modalImage = document.getElementById("modalImage");
var span = document.getElementsByClassName("close")[0];

function mostrarDescripcionCompleta(descripcion) {
  modal.style.display = "block";
  modalParagraph.textContent = descripcion;
}

span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const buscador = document.getElementById("buscador");

buscador.addEventListener("input", function () {
  var botones = document.querySelectorAll(".botones-categorias button");
  botones.forEach(function (boton) {
    boton.className = "button-55";
  });

  const terminoBusqueda = buscador.value.trim().toLowerCase();
  filtrarProyectos(terminoBusqueda);
  buscador.addEventListener("blur", function () {
    buscador.value = "";
  });
});

function filtrarProyectos(termino) {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "";

  const proyectosFiltrados = datos.filter(function (proyecto) {
    const titulo = proyecto.Nombre.toLowerCase();
    const integrantes = proyecto.Integrantes.toLowerCase();
    return (
      titulo.includes(termino) ||
      integrantes.includes(termino)
    );
  });

  if (proyectosFiltrados.length > 0) {
    proyectosFiltrados.forEach(function (item) {
      var card = document.createElement("div");
      card.classList.add("flip-card");
      let cat = item.Categoria.replace(/ /g, "");
    card.innerHTML = `
          <div class="flip-card-inner ${cat}">
              <div class="flip-card-front ">
                  <div class="curso-container">
                    <div class="curso-position ${cat}-background">
                      <p id="curso">${item.Curso?.slice(0, 80)}</p>
                    </div>
                  </div>
                  <div >
                      <img src=${item.Logo} alt="Avatar" id="logo">
                  </div>
                  <h3>${item.Nombre}</h3>
                  <p id="integrantes">${item.Integrantes?.slice(0, 80)}</p>
                  <div class="ubicacion-boton">
                  <button class="girar-button ${cat}-background" onclick="girarTarjeta(this)">+</button>
                  </div>
                  </div>
              <div class="flip-card-back">
                  <h3 id="mg-top">${item.Nombre}</h3>
                  ${truncateDescription(item.Descripcion, 25, item)}

                 <p><b>Categoria</b>: ${item.Categoria}</p>
                  <button class="girar-button ${cat}-background circular" onclick="girarTarjeta(this)">Volver</button>
              </div>
          </div>
      `;
      resultadoDiv.appendChild(card);
    });
  } else {
    resultadoDiv.innerHTML = "<p>No se encontraron proyectos.</p>";
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
window.addEventListener("scroll", function () {
  var scrollToTopButton = document.getElementById("scrollToTopButton");

  if (window.scrollY > 300) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
});

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
