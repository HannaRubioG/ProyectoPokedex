//Modales
// Get the modal
var modal = document.getElementById("CartaPoke");

// Get the button that opens the modal
var btnPoke = document.getElementById("btnmodalPoke");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("cerrar")[0];

// When the user clicks on the button, open the modal
btnPoke.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
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

async function cargarPokemones() {
    if (Cargando) return; 
    Cargando = true;
    try {
        
        const url = "https://pokeapi.co/api/v2/pokemon?limit=" + limite + "&offset=" + inicio;
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
function CardPokemon(pokemon) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'cuadro'; 

    let tipos = pokemon.types.map(t => t.type.name).join(', ');

    tarjeta.innerHTML = 
        "<img src='" + pokemon.sprites.front_default + "' alt='" + pokemon.name + "'>" +
        "<p>Nombre: " + pokemon.name + "</p>" +
        "<p>ID: " + pokemon.id + "</p>" +
        "<p>Tipo: " + tipos + "</p>";

    contenedor.appendChild(tarjeta);
}

// "un vigilante" revisa si hay entradas y si si hay hace lo sig
const observer = new IntersectionObserver((entradas) => { 
    // Si vemos el texto "Cargando más Pokémon...", ejecutamos la función
    const textoBusqueda = document.getElementById('buscarPokemon').value;
    if (entradas[0].isIntersecting && textoBusqueda === '') { //quitar lo de and
        cargarPokemones();
        console.log(aviso);
    }
}, {
    rootMargin: '200px'  //amplia la "vison" del "vigilante" para que cuando aparezca el mensaje de cargando ya se hayan cargado sin tener que ver ese mensaje en pantalla
});

observer.observe(loader);

