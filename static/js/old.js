
function mostrarSin() {
    var resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = "";
  
    var sinergizados = datos.filter(function (item) {
      return item.Sinergizado == "TRUE";
    });
  
    if (sinergizados.length > 0) {
      sinergizados.forEach(function (item) {
        var card = document.createElement("div");
        card.classList.add("flip-card");
  
        card.innerHTML = `
            <div class="flip-card-inner">
                <div class="flip-card-front SinergizadoC">
                    <div >
                        <img src=${item.Logo} alt="Avatar">
                    </div>
                    <h3>${item.Nombre}</h3>
                    <p>${item.Slogan?.slice(0, 80)}</p>
                    <button class="girar-button" onclick="girarTarjeta(this)">+ Detalles</button>
                    ${Sinergizado(item)}
                    </div>
                <div class="flip-card-back ${item.Categoria}">
                    <h3>${item.Nombre}</h3>
                    ${truncateDescription(item.Descripcion, 10, item)}
  
                   <p ><b>Integrantes:</b>  ${
                     item.Integrantes
                   }<br><b>Categoria</b>: ${item.Categoria}</p>
                    <button class="girar-button" onclick="girarTarjeta(this)">Volver</button>
                </div>
            </div>
        `;
        resultadoDiv.appendChild(card);
      });
  
      var botones = document.querySelectorAll(".botones-categorias button");
  
      id = "SinergizadosC";
  
      botones.forEach(function (boton) {
        boton.classList.remove("Todos");
        boton.classList.remove("button-Negocios");
        boton.classList.remove("button-Sociedad");
        boton.classList.remove("button-Salud");
        boton.classList.remove("button-Arte");
  
        if (boton.id == "Sinergizado") {
          boton.classList.add("SinergizadoC");
        }
      });
    }
  }
  