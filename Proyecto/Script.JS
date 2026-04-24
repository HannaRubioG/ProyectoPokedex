async function agregaralEquipo(pokemonid) {
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonid}`);
        const detalles = await respuesta.json();

        // Verificar límite del equipo
        let equipo = JSON.parse(localStorage.getItem('equipoPokemon')) || [];
        if (equipo.length >= 6) {
            alert("Tu equipo está lleno (máximo 6 Pokémon)");
            return;
        }

        // Mostrar modal para ingresar nombre
        const InfoPokeModal = document.getElementById("CartaPoke");
        const InfoPokeContent = InfoPokeModal.querySelector('.InfoPoke');
        InfoPokeContent.innerHTML = `
            <span class="cerrar">&times;</span>
            <h2>Dale un nombre a ${detalles.name}</h2>
            <input type="text" id="nombreEquipo" placeholder="Nombre del Pokémon en tu equipo">
            <button id="guardarNombre">Guardar</button>
        `;
        
        InfoPokeModal.style.display = "block";

        // Configurar botón guardar
        document.getElementById('guardarNombre').onclick = function() {
            guardarNombre(detalles);
        };

        // Configurar cierre del modal
        const span = InfoPokeContent.querySelector(".cerrar");
        span.onclick = function() {
            InfoPokeModal.style.display = "none";
        };
        window.onclick = function(event) {
            if (event.target == InfoPokeModal) {
                InfoPokeModal.style.display = "none";
            }
        };
    } catch (error) {
        console.error("Error al agregar al equipo", error);
        alert("Error al agregar al equipo");
    }
}

function guardarNombre(detalles) {
    const nombre = document.getElementById('nombreEquipo').value;
    const InfoPokeModal = document.getElementById("CartaPoke");
    
    if (nombre) {
        // Agregar Pokémon al equipo con el nombre personalizado
        let equipo = JSON.parse(localStorage.getItem('equipoPokemon')) || [];
        
        // Guardar también el nombre personalizado
        detalles.nombrePersonalizado = nombre;
        equipo.push(detalles);
        localStorage.setItem('equipoPokemon', JSON.stringify(equipo));
        
        InfoPokeModal.style.display = "none";
        alert(`${nombre.toUpperCase()} ha sido agregado a tu equipo!`);
        
        // Actualizar la vista del equipo si existe la función
        if (typeof mostarEquipos === 'function') {
            mostarEquipos();
        }
    } else {
        alert('Por favor, ingresa un nombre para el Pokémon.');
    }
}
function mostarEquipos() {
    try {
        const equipo = JSON.parse(localStorage.getItem('equipoPokemon')) || [];
        const contenedorEquipoP = document.getElementById("contenedorEquipo");
        const InfoEquipoContent = contenedorEquipoP.querySelector('.InfoEquipo');
        
        // Limpiar contenido anterior (mantener el botón cerrar)
        const btnCerrar = InfoEquipoContent.querySelector('.cerrar');
        InfoEquipoContent.innerHTML = '';
        if (btnCerrar) InfoEquipoContent.appendChild(btnCerrar);
        
        // Agregar título
        const titulo = document.createElement('h3');
        titulo.textContent = 'Equipo Pokémon';
        InfoEquipoContent.appendChild(titulo);

        // Mostrar modal
        contenedorEquipoP.style.display = "block";

        // Configurar cierre del modal
        const span = InfoEquipoContent.querySelector(".cerrar");
        if (span) {
            span.onclick = function() {
                contenedorEquipoP.style.display = "none";
            };
        }
        window.onclick = function(event) {
            if (event.target == contenedorEquipoP) {
                contenedorEquipoP.style.display = "none";
            }
        };

        if (equipo.length === 0) {
            const mensaje = document.createElement('p');
            mensaje.textContent = 'Tu equipo está vacío';
            InfoEquipoContent.appendChild(mensaje);
            return;
        }

        equipo.forEach(pokemon => {
            const carta = document.createElement('div');
            const nombreMostrar = pokemon.nombrePersonalizado || pokemon.name;
            carta.innerHTML = `
                <h3>${nombreMostrar.toUpperCase()}</h3>
                <span id="eliminar" onclick="eliminarPokemon(this)"> &times; </span>
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <p>Altura: ${pokemon.height}</p>
                <p>Peso: ${pokemon.weight}</p>
            `;
            InfoEquipoContent.appendChild(carta);
            carta.addEventListener('click', () => OnclickInfoPoke(pokemon.id));
        });
    } catch (error) {
        console.error("Error al cargar los equipos", error);
        alert("Error al cargar los equipos");
    }
}
function eliminarPokemon(elemento) {
    const equipo = JSON.parse(localStorage.getItem('equipoPokemon')) || [];
    const carta = elemento.parentElement;
    const nombrePokemon = carta.querySelector('h3').textContent.toLowerCase();
    const index = equipo.findIndex(p => (p.nombrePersonalizado || p.name).toLowerCase() === nombrePokemon);
    if (index !== -1) {
        equipo.splice(index, 1);
        localStorage.setItem('equipoPokemon', JSON.stringify(equipo));
        carta.remove();
    }
}


//modal Whos that pokemon
// Get the modal
var modal = document.getElementById("modalwtp");

// Get the button that opens the modal
var btn = document.getElementById("guess");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
  randomPokemon();
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  document.getElementById('op1').textContent = " ";
  document.getElementById('op2').textContent = " ";
  document.getElementById('op3').textContent = " ";
  document.getElementById('op4').textContent = " ";
  modal.style.display = "none";
  document.getElementById('CartaPoke').style.display = "none";
  document.getElementsByClassName('InfoPoke')[0].innerHTML = " ";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.getElementById('op1').textContent = " ";
    document.getElementById('op2').textContent = " ";
    document.getElementById('op3').textContent = " ";
    document.getElementById('op4').textContent = " ";
  }
}

async function fetchPokemon(id) {
  try{
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  
  if (!res.ok) throw new Error('No encontrado');
  const data = await res.json();

  displayPokemon(data)
} catch (error){

}
}

let pokemonCorrect = null;
let opcorrecta = null;

async function randomPokemon() {
  const id = Math.floor(Math.random() * 1010) + 1;
await fetchPokemon(id);
document.getElementById('check').style.display = "none";
document.getElementById('imgwtp').style.filter = "brightness(0%)"; // Oculta la imagen al cargar un nuevo Pokémon
document.getElementById('op1').style.backgroundColor = ""; // Resetea el fondo de las opciones
document.getElementById('op2').style.backgroundColor = "";
document.getElementById('op3').style.backgroundColor = "";
document.getElementById('op4').style.backgroundColor = "";


}

async function displayPokemon(data){
    img = document.getElementById('imgwtp');
    img.src = data.sprites.other["official-artwork"].front_default || data.sprites.front_default
    correctop = Math.floor(Math.random() * 4) + 1;

    for(let i = 1; i <= 4; i++){
      let randomid = Math.floor(Math.random() * 1010) + 1;
      const otrasop = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomid}`);
      const randomData = await otrasop.json();
      if(i !== correctop){
        document.getElementById(`op${i}`).textContent = randomData.name;
      }
    }

    switch(correctop){
      case 1:
        document.getElementById('op1').textContent = data.name;
        break;

      case 2:
        document.getElementById('op2').textContent = data.name;
        break;

      case 3:
        document.getElementById('op3').textContent = data.name;
        break;

      case 4:
        document.getElementById('op4').textContent = data.name;
        break;   
    }
    pokemonCorrect = data;
    opcorrecta = correctop;
   
  };
  async function elegirop(btnid){
    document.getElementById('check').style.display = "block";
    if (btnid.textContent==pokemonCorrect.name){
        btnid.style.backgroundColor = "#90EE90"; // Cambia el fondo del botón elegido a verde claro
        document.getElementById('check').src ='https://tse1.mm.bing.net/th/id/OIP.mkmUCrfrlgzt9oUWeLfWnwHaIe?rs=1&pid=ImgDetMain&o=7&rm=3';  

    }
    else {
        document.getElementById(`op${opcorrecta}`).style.backgroundColor = "#90EE90"; // Resalta la opción correcta en verde claro
        btnid.style.backgroundColor = "#FF7F7F"; // Cambia el fondo del botón elegido a rojo claro
        document.getElementById('check').src = 'https://www.pngall.com/wp-content/uploads/8/Red-Mark-Wrong-Transparent.png'
    }

    document.getElementById('imgwtp').style.filter = "brightness(100%)"; // Revela la imagen al elegir una opción
    

    
    setTimeout(function() {
    randomPokemon();
    }, 3000);
    
  }



// Info pokemon
async function OnclickInfoPoke(pokemonid) {
    try {
        // Hacer fetch a info del Pokémon seleccionado
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonid}`);
        const detalles = await respuesta.json();

        // Obtener elementos del modal (ajusta los IDs según tu HTML)
        const InfoPokeModal = document.getElementById("CartaPoke");
        const InfoPokeContent = InfoPokeModal.querySelector('.InfoPoke');

        // Crear contenido detallad
        html = `
            <span class="cerrar">&times;</span>
            <h2>${detalles.name.toUpperCase()}</h2>
            <button onclick="agregaralEquipo(${detalles.id})"><img style="width: 20px; height: auto;" src='https://www.pngall.com/wp-content/uploads/4/Pokeball-PNG-File.png'></img></button>
            <img id="imgDefault" src="${detalles.sprites.front_default}" alt="${detalles.name}">
            <p><strong>ID:</strong> ${detalles.id}</p>
            <p><strong>Tipo(s):</strong> ${detalles.types.map(t => t.type.name).join(', ')}</p>
            <p><strong>Altura:</strong> ${detalles.height / 10} m</p>
            <p><strong>Peso:</strong> ${detalles.weight / 10} kg</p>
            <p><strong>Habilidades:</strong> ${detalles.abilities.map(a => a.ability.name).join(', ')}</p>
        `;
        html += `<button onclick="evolucionesModal(${detalles.id})">Evoluciones</button>`;
        html += `<button id="shinyButton" onclick="shiny(${detalles.id})">Shiny</button>`;
        html += `<button id="Pokemov" onclick="MovimientosPoke(${detalles.id})">Movimientos</button>`;
        html += `<button id="statspoke" onclick="StatsPoke(${detalles.id})">Stats</button>`;

        InfoPokeContent.innerHTML = html;

        // Mostrar el modal
        InfoPokeModal.style.display = "block";

        // cerrar el modal al hacer clic en la "x"
        const span = InfoPokeContent.querySelector(".cerrar");
        span.onclick = function() {
            InfoPokeModal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == InfoPokeModal) {
                InfoPokeModal.style.display = "none";
            }
        }

    } catch (error) {
        console.error("Error al cargar detalles del Pokémon:", error);
        alert("Error al cargar la información del Pokémon.");
    }
}
async function StatsPoke(pokemonid) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonid}`);
        const detalles = await res.json();
        const stats = detalles.stats;
        const InfoPokeModal = document.getElementById("CartaPoke");
        const InfoPokeContent = InfoPokeModal.querySelector('.InfoPoke');

        let html = `
            <span class="cerrar">&times;</span>
            <h2>Stats de ${detalles.name.toUpperCase()}</h2>
            <div class="stats-container">
        `;
        stats.forEach(stat => {
            html += `
                <div class="stat-row">
                    <div class="stat-name">${stat.stat.name.replace('-', ' ')}</div>
                    <div class="stat-val">${stat.base_stat}</div>
                    <div class="stat-bar-wrap">
                        <div class="stat-bar" style="width: ${Math.min(stat.base_stat / 255 * 100, 100)}%"></div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        InfoPokeContent.innerHTML = html;

        const span = InfoPokeContent.querySelector(".cerrar");
        span.onclick = function() {
            InfoPokeModal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == InfoPokeModal) {
                InfoPokeModal.style.display = "none";
            }
        }
    } catch (error) {
        console.error("Error al cargar stats del Pokémon:", error);
        alert("Error al cargar los stats del Pokémon.");
    }
}

async function MovimientosPoke(pokemonid) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonid}`);
        const detalles = await res.json();
        const movimientos = detalles.moves;
        const InfoPokeModal = document.getElementById("CartaPoke");
        const InfoPokeContent = InfoPokeModal.querySelector('.InfoPoke');
        let html = `
            <span class="cerrar">&times;</span>
            <h2>Movimientos de ${detalles.name.toUpperCase()}</h2>
            <ul style="list-style: none; padding: 0;">
        `;
        movimientos.forEach(mov => {
            html += `<li>${mov.move.name}</li>`;
        });
        html += `</ul>`;
        html += `<button onclick="OnclickInfoPoke(${detalles.id})">Info</button>`;
        InfoPokeContent.innerHTML = html;

        const span = InfoPokeContent.querySelector(".cerrar");
        span.onclick = function() {
            InfoPokeModal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == InfoPokeModal) {
                InfoPokeModal.style.display = "none";
            }
        }
    } catch (error) {
        console.error("Error al cargar movimientos del Pokémon:", error);
        alert("Error al cargar los movimientos del Pokémon.");
    }
}


async function shiny(pokemonid) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonid}`);
        const detalles = await res.json();
        const imgShiny = detalles.sprites.front_shiny;

        const InfoPokeModal = document.getElementById("CartaPoke");
        const InfoPokeContent = InfoPokeModal.querySelector('.InfoPoke');

        document.getElementById("imgDefault").src = imgShiny;
        document.getElementById("shinyButton").textContent = "Normal";
        document.getElementById("shinyButton").onclick = function() {
            normal(pokemonid);
        }
    } catch (error) {
        console.error("Error al cargar la imagen shiny:", error);
        alert("Error al cargar la imagen shiny del Pokémon.");
    }
}

async function normal (pokemonid) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonid}`);
        const detalles = await res.json();
        const imgnr = detalles.sprites.front_default;

        const InfoPokeModal = document.getElementById("CartaPoke");
        const InfoPokeContent = InfoPokeModal.querySelector('.InfoPoke');

        document.getElementById("imgDefault").src = imgnr;
        document.getElementById("shinyButton").textContent = "Shiny";
        document.getElementById("shinyButton").onclick = function() {
            shiny(pokemonid);
        }

    } catch (error) {
        console.error("Error al cargar la imagen shiny:", error);
        alert("Error al cargar la imagen shiny del Pokémon.");
    }
}

async function evolucionesModal(pokemon) {
    try {
        // Obtener la especie del Pokémon
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
        const data = await respuesta.json();
        
        // Obtener la cadena de evolución
        const resEvol = await fetch(data.evolution_chain.url);
        const evolData = await resEvol.json();

        // Recorrer la cadena y obtener datos de cada evolución
        let evoluciones = [];
        let cadena = evolData.chain;
        
        while (cadena) {
            const nombreEspecies = cadena.species.name;
            
            // Obtener datos del Pokémon para la imagen
            const resPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombreEspecies}`);
            const pokemonData = await resPoke.json();
            
            evoluciones.push({
                nombre: nombreEspecies,
                imagen: pokemonData.sprites.front_default
            });
            
            cadena = cadena.evolves_to[0] || null;
        }

        // Mostrar en el modal
        const InfoPokeModal = document.getElementById("CartaPoke");
        const InfoPokeContent = InfoPokeModal.querySelector('.InfoPoke');

        let html = `
            <span class="cerrar">&times;</span>
            <h2>Evoluciones de ${data.name.toUpperCase()}</h2>
            <div style="display: flex; gap: 20px; justify-content: center;">
        `;
        
        evoluciones.forEach(evo => {
            html += `
                <div style="text-align: center;">
                    <img src="${evo.imagen}" alt="${evo.nombre}" style="width: 100px; height: 100px;">
                    <p>${evo.nombre}</p>
                </div>
            `;
        });
        
        html += `</div>`;

        html += `<button onclick="OnclickInfoPoke(${pokemon})">Info</button>`;

        InfoPokeContent.innerHTML = html
        ;

        const span = InfoPokeContent.querySelector(".cerrar");
        span.onclick = function() {
            InfoPokeModal.style.display = "none";
        }

    } catch (error) {
        console.error("Error al cargar evoluciones:", error);
        alert("Error al cargar las evoluciones del Pokémon.");
    }
}





// Filtro 

const inputFiltro = document.getElementById('buscarPokemon');

// input para que reaccione a cada tecla

inputFiltro.addEventListener('input', (evento) => {

    const textoBusqueda = evento.target.value.toLowerCase(); // minúsculas
    const Tarjetas = document.querySelectorAll('.cuadro');

    let tarjetasVisibles = 0;

    Tarjetas.forEach(tarjeta => {
        const Letras = tarjeta.querySelector('p');

        if (Letras) {
            
            const textoCompleto = Letras.textContent.toLowerCase();
            const nombrePokemon = textoCompleto.replace("nombre: ", "").trim();

            if (nombrePokemon.startsWith(textoBusqueda)) {
                tarjeta.style.display = 'block'; // Mostrar
                tarjetasVisibles++;
            } else {
                tarjeta.style.display = 'none';  // Ocultar
            }
        }
    });

    // Mensajes
    if (textoBusqueda !== '') {
        loader.style.display = 'none';
        
        if (tarjetasVisibles === 0) {
            aviso.style.display = 'block';
        } else {
            aviso.style.display = 'none';
        }
    } else {
        loader.style.display = 'block'; 
        aviso.style.display = 'none';   
    }

}); 


const contenedor = document.getElementById('contenedorPokemones');
const loader = document.getElementById('loader');
const aviso = document.getElementById("aviso");

let inicio = 0;      
const limite = 1025;    
let Cargando = false;

// Cargar pokemones o cargar pokemones filtrados
let resultadosFiltrados = [];
let inicioFiltrado = 0;

async function cargarMas(lista, esBusqueda) { //esBusqueda es una variable de verdadero/falso
    if (Cargando) return;
    
    let desde = esBusqueda ? inicioFiltrado : inicio; // empieza a cargar info desde el 0 sin importar si se cargaron más pokemones antes de filtrar (es como un if/else, es un operador ternario)
    let bloque = lista.slice(desde, desde + limite); //obtiene datos de donde se quedo y carga otro bloque de limite mas

    if (bloque.length === 0) return;

    Cargando = true;
    try {
        const detalles = await Promise.all(
            bloque.map(async (poke) => {
                const res = await fetch(poke.url);
                return res.json();
            })
        );
        detalles.forEach(CardPokemon);

        if (esBusqueda) inicioFiltrado += limite;
        else inicio += limite;
    } catch (error) {
        console.error("Error al cargar detalles", error);
    } finally {
        Cargando = false;
    }
}

async function cargarPokemones() {
    if (Cargando) return; 
    Cargando = true;
    try {
        
        const url = "https://pokeapi.co/api/v2/pokemon?limit=" + limite + "&offset=" + inicio; //&offset es para posicionar elementos
        const respuesta = await fetch(url);
        const data = await respuesta.json();

        const detallesPokemones = await Promise.all(
            data.results.map(async (UnPokemon) => {
                const res = await fetch(UnPokemon.url);
                return res.json();
            })
        );

        detallesPokemones.forEach(CardPokemon);

        inicio += limite;

    } catch (error) {
        console.error("Hubo un error cargando los Pokémones", error);
    } finally {
        Cargando = false; 
    }
}

// Algo de clases ahi 

//Tarjeta del pokemon cuando estan todos 

function CardPokemon(pokemon) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'cuadro';
    
    // Agregar el atributo data-tipo con el primer tipo del Pokémon
    const tipoPrimario = pokemon.types[0].type.name;
    tarjeta.setAttribute('data-tipo', tipoPrimario);

    let tipos = pokemon.types.map(t => t.type.name).join(', ');

    tarjeta.innerHTML = 
        "<img src='" + pokemon.sprites.front_default + "' alt='" + pokemon.name + "'>" +
        "<p>Nombre: " + pokemon.name + "</p>" +
        "<p>ID: " + pokemon.id + "</p>" +
        "<p>Tipo: " + tipos + "</p>";
        

    tarjeta.addEventListener('click', () => OnclickInfoPoke(pokemon.id)); // Pasar el ID del Pokémon a la función

    contenedor.appendChild(tarjeta);
}

// "un vigilante" revisa si hay entradas y si si hay hace lo sig

const observer = new IntersectionObserver((entradas) => { 
    // Si vemos el texto "Cargando más Pokémon...", ejecutamos la función
    if (entradas[0].isIntersecting) {
        
        const textoBusqueda = document.getElementById('buscarPokemon').value.trim();
        const tipoSeleccionado = document.getElementById('filtroTipo').value; 
        
        if (textoBusqueda === '' && tipoSeleccionado === '') {
            cargarPokemones(); 
        } else {
            // Si hay texto o hay un tipo seleccionado, usa la función de cargarMas
            cargarMas(resultadosFiltrados, true); 
        }
    }
}, {
    rootMargin: '200px'  //amplia la "vison" del "vigilante" para que cuando aparezca el mensaje de cargando ya se hayan cargado sin tener que ver ese mensaje en pantalla
});

observer.observe(loader);


async function filtrarPorTipo(tipoSeleccionado) {
    limpiarPantalla(); // Limpiamos rastro de items/movimientos

    //Volvemos a mostrar la Pokedex y ocultamos los movimientos/items
    document.getElementById('contenedorPokemones').style.display = 'grid';
   
    // Carga pokemones
    document.getElementById('contenedorPokemones').style.display = 'grid';

    document.getElementById('buscarPokemon').value = ''; 
    
    resultadosFiltrados = [];
    contenedor.innerHTML = ''; 
    inicioFiltrado = 0;
    loader.style.display = 'none'; //Vigilante desactivado
    
    // Si elige "Todos los tipos" solo carga a los Pokemones
    if (tipoSeleccionado === '') {
        inicio = 0;
        cargarPokemones(); 
        loader.style.display = 'block';
        aviso.style.display = 'none';
        return; 
    }

    // Si elige un tipo específico
    try {
        //loader.style.display = 'block'; 
        aviso.style.display = 'none';

        const respuesta = await fetch("https://pokeapi.co/api/v2/type/" + tipoSeleccionado);
        const data = await respuesta.json();
        
        resultadosFiltrados = data.pokemon.map(p => p.pokemon);

        if (resultadosFiltrados.length > 0) {
            cargarMas(resultadosFiltrados, true); //cargas mas es true y por lo tanto esBusqueda es true
            loader.style.display = 'block'; // Vigilante activado
        } else {
            aviso.style.display = 'block';
            //loader.style.display = 'none';
        }

    } catch (error) {
        console.error("Hubo un error al buscar por tipo", error);
    }
}
const selectTipo = document.getElementById('filtroTipo');

selectTipo.addEventListener('change', (evento) => { //change ya existe en js
    // Toma el valor de la lista y se lo manda a la funcion  
    filtrarPorTipo(evento.target.value); //evento=info, target=select de HTML, value=valor(tipo en este caso)
});

// BUSCAR MOVIMIENTOS

async function buscarMovimiento(nombreMov) {
    limpiarPantalla(); // Borramos todos los datos anteriores

    // Mostramos la tarjeta de movimientos
    const resMov = document.getElementById('resultadoMovimiento');
    if (resMov) resMov.style.display = 'block';
    
    document.getElementById("nomMov").innerHTML = "Buscando movimiento...";

    fetch("https://pokeapi.co/api/v2/move/" + nombreMov)
    .then(response => {
        if(!response.ok) throw new Error('Movimiento no encontrado');
        return response.json();
    })
    .then(data => {
        mostrarInfoMov(data); 
    })
    .catch(error => {
        console.error('Problema:', error);
        document.getElementById("nomMov").innerHTML = "Movimiento no encontrado o no tiene Pokémon que lo aprendan";
    });
}

async function mostrarInfoMov(movimiento) {
    let nom = document.getElementById("nomMov");
    let tipo = document.getElementById("tipoMov");
    let listaPokemones = document.getElementById("listaPokemonMov");

    let efecto = document.getElementById("efectoMov"); //Efecto  (si funciona aun)

    let poder = document.getElementById("poderMov"); //POder 

    nom.innerHTML = "Movimiento: " + movimiento.name;
    tipo.innerHTML = "Tipo: " + movimiento.type.name;

    efecto.innerHTML = "Efecto: " + movimiento.effect_chance; // 
    poder.innerHTML = "Poder: " + movimiento.power;

    listaPokemones.innerHTML = "Cargando Pokémon...";

    let pokemonSabe = movimiento.learned_by_pokemon.slice(0, 15); 

    try {
        const detalles = await Promise.all(
            pokemonSabe.map(async p => {
                const res = await fetch(p.url);
                return res.json();
            })
        );

        listaPokemones.innerHTML = ""; // Borrar el aviso de cargando

        detalles.forEach(poke => {
            
            const tarjeta = document.createElement('div');
            tarjeta.className = 'cuadro'; 
            let tipos = poke.types.map(t => t.type.name).join(', ');

            let img = (poke.sprites && poke.sprites.front_default) ? poke.sprites.front_default : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

            tarjeta.innerHTML = 
                "<img src='" + img + "'>" +
                "<p>Nombre: " + poke.name + "</p>" +
                "<p>ID: " + poke.id + "</p>" +
                "<p>Tipo: " + tipos + "</p>";

            listaPokemones.appendChild(tarjeta); 
            tarjeta.addEventListener('click', () => OnclickInfoPoke(poke.id));
        });
        
    } catch (error) {
        console.error(error);
        listaPokemones.innerHTML = "Error al cargar imágenes.";
    }
}

document.getElementById("btnBuscarMov").addEventListener("click", () => {
    const busqueda = document.getElementById("inputMovimiento").value.toLowerCase().trim();
    
    if (busqueda !== "") {
        // Reemplaza espacios por guiones 
        const nombreLimpio = busqueda.replace(/\s+/g, '-');
        buscarMovimiento(nombreLimpio);
    }
});

// BUSCAR ITEMS

document.getElementById("btnBuscarItem").addEventListener("click", () => {
    const valor = document.getElementById("inputItem").value.toLowerCase().trim();
    if (valor !== "") {
        const nombreLimpio = valor.replace(/\s+/g, '-');
        buscarItem(nombreLimpio); 
    }
});

async function buscarItem(nombreItem) {

    limpiarPantalla(); // Borramos todos los datos anteriores

    document.getElementById('resultadoItem').style.display = 'block';
    document.getElementById("nomItem").innerHTML = "Buscando...";

    fetch("https://pokeapi.co/api/v2/item/" + nombreItem)
    .then(response => {
        if(!response.ok) throw new Error('Item no encontrado');
        return response.json();
    })
    .then(data => {
        mostrarInfoItem(data); 
    })
    .catch(error => {
        console.error('Problema:', error);
        document.getElementById("nomItem").innerHTML = "Item no encontrado";
    });
}

async function mostrarInfoItem(item) {
    let nom = document.getElementById("nomItem");
    let img = document.getElementById("imgItem");
    let desc = document.getElementById("descItem");

    nom.innerHTML = "Item: " + item.name;
    
    // Imagen
    if (item.sprites && item.sprites.default) {
        img.src = item.sprites.default;
        img.style.display = "block";
    }

    // Efecto del item 
    const entradaEfecto = item.effect_entries?.find(e => e.language.name === 'en');
    if (desc && entradaEfecto) {
        desc.innerHTML = "<strong>Efecto:</strong> " + entradaEfecto.short_effect;
    }
}

function limpiarPantalla() {
    // Limpiar Pokedex sin que desaparezca 
    document.getElementById('contenedorPokemones').style.display = 'none';
    document.getElementById('loader').style.display = 'none';

    // Limpiar Items sin que desaparezca
    if (document.getElementById('resultadoItem')) document.getElementById('resultadoItem').style.display = 'none';
    document.getElementById("nomItem").innerHTML = "";
    document.getElementById("descItem").innerHTML = "";
    document.getElementById("imgItem").src = "";

    // Limpiar Movimientos sin que desaparezca
    if (document.getElementById('resultadoMovimiento')) document.getElementById('resultadoMovimiento').style.display = 'none';
    document.getElementById("nomMov").innerHTML = "";
    document.getElementById("tipoMov").innerHTML = "";
    document.getElementById("listaPokemonMov").innerHTML = ""; 
}