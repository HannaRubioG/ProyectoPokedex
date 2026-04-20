// Info pokemon
async function OnclickInfoPoke(pokemon) {
    try {;
        // Hacer fetch a info del Pokémon seleccionado
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
        const respuesta = await fetch(url);
        const detalles = await respuesta.json();

        // Obtener elementos del modal (ajusta los IDs según tu HTML)
        const modal = document.getElementById("CartaPoke");
        const modalContent = modal.querySelector('InfoPoke');

        // Crear contenido detallado
        modalContent.innerHTML = `
            <span class="cerrar">&times;</span>
            <h2>${detalles.name.toUpperCase()}</h2>
            <img src="${detalles.sprites.front_default}" alt="${detalles.name}">
            <p>ID: ${detalles.id}</p>
            <p>Tipo(s): ${detalles.types.map(t => t.type.name).join(', ')}</p>
            <p>Altura: ${detalles.height / 10} m</p>
            <p>Peso: ${detalles.weight / 10} kg</p>
            <p>Habilidades: </p>
            <p>Stats:</p>

        `;

        // Mostrar el modal
        modal.style.display = "block";

        // cerrar el modal al hacer clic en la "x"
        const span = modalContent.querySelector(".cerrar");
        span.onclick = function() {
            modal.style.display = "none";
        }

    } catch (error) {
        console.error("Error al cargar detalles del Pokémon:", error);
        alert("Error al cargar la información del Pokémon.");
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

    document.getElementById('contenedorPokemones').style.display = 'none';
    document.getElementById('loader').style.display = 'none';
    document.getElementById('aviso').style.display = 'none';
    
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
    });
}

async function mostrarInfoMov(movimiento) {
    let nom = document.getElementById("nomMov");
    let tipo = document.getElementById("tipoMov");
    let listaPokemones = document.getElementById("listaPokemonMov");

    nom.innerHTML = "Movimiento: " + movimiento.name;
    tipo.innerHTML = "Tipo: " + movimiento.type.name;

    let pokemonSabe = movimiento.learned_by_pokemon.slice(0, 10); 

    let nombresPokemones = pokemonSabe.map(p => p.name);

    listaPokemones.innerHTML = "Lo aprenden: <br>" + nombresPokemones.join(", ");
}

document.getElementById("btnBuscarMov").addEventListener("click", () => {
    const busqueda = document.getElementById("inputMovimiento").value.toLowerCase().trim();
    
    if (busqueda !== "") {
        // Reemplaza espacios por guiones 
        const nombreLimpio = busqueda.replace(/\s+/g, '-');
        buscarMovimiento(nombreLimpio);
    }
});