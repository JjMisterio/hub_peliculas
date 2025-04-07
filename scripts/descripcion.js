// Función para cargar datos desde un JSON
async function cargarDatosDesdeJSON(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        // Aquí procesarías los datos del JSON
        console.log('Datos cargados:', data);
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Función para cargar y procesar los datos del JSON
async function cargarDatos() {
    try {
        const response = await fetch('database.json');
        const titulos = await response.json();
        generarContenido(titulos);
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Función para generar el contenido dinámico
function generarContenido(titulos) {
    const contenidoDinamico = document.getElementById('contenidoDinamico');
    const secciones = {
        tendencias: { titulo: 'Tendencias', items: [], id: 'tendencias' },
        peliculas: { titulo: 'Películas', items: [], id: 'peliculas' },
        series: { titulo: 'Series', items: [], id: 'series' },
        favoritos: { titulo: 'Favoritos', items: [], id: 'favoritos' },
        accion: { titulo: 'Acción', items: [], id: 'accion' },
        comedia: { titulo: 'Comedia', items: [], id: 'comedia' },
        drama: { titulo: 'Drama', items: [], id: 'drama' },
        terror: { titulo: 'Terror', items: [], id: 'terror' },
        romance: { titulo: 'Romance', items: [], id: 'romance' },
        fantasia: { titulo: 'Fantasía', items: [], id: 'fantasia' },
        animacion: { titulo: 'Animación', items: [], id: 'animacion' },
        musicales: { titulo: 'Musicales', items: [], id: 'musicales' },
        ocultos: { titulo: 'Ocultos', items: [], id: 'ocultos' }
    };

    // Mapeo de géneros a IDs de sección
    const mapeoGeneros = {
        'Acción': 'accion',
        'Comedia': 'comedia',
        'Drama': 'drama',
        'Terror': 'terror',
        'Romance': 'romance',
        'Fantasía': 'fantasia',
        'Animación': 'animacion',
        'Musicales': 'musicales'
    };

    // Organizar los títulos por categorías
    titulos.forEach(titulo => {
        // Si el título está oculto, solo se agrega a la sección de ocultos
        if (titulo.oculto) {
            secciones.ocultos.items.push(titulo);
            return; // Saltamos al siguiente título
        }

        // Si no está oculto, se agrega a las demás categorías correspondientes
        if (titulo.tendencia) secciones.tendencias.items.push(titulo);
        if (titulo.tipo === 'pelicula') secciones.peliculas.items.push(titulo);
        if (titulo.tipo === 'serie') secciones.series.items.push(titulo);
        if (titulo.favorito) secciones.favoritos.items.push(titulo);
        
        // Organizar por género
        if (titulo.genero && mapeoGeneros[titulo.genero]) {
            const seccionId = mapeoGeneros[titulo.genero];
            secciones[seccionId].items.push(titulo);
        }
    });

    // Generar el HTML para cada sección
    let html = '';
    for (const [key, seccion] of Object.entries(secciones)) {
        if (seccion.items.length > 0) {
            html += `
                <div class="seccion mb-5" id="${seccion.id}">
                    <h2 class="mb-4">${seccion.titulo}</h2>
                    <div class="row">
                        ${generarCards(seccion.items)}
                    </div>
                </div>
            `;
        }
    }

    contenidoDinamico.innerHTML = html;
}

// Función para generar las cards de los títulos
function generarCards(items) {
    return items.map(item => `
        <div class="col-md-3 mb-4">
            <div class="card">
                <img src="${item.src}" class="card-img-top" alt="${item.titulo}" 
                     onclick="mostrarInformacion(${item.id})">
            </div>
        </div>
    `).join('');
}

// Función para mostrar la información del título
function mostrarInformacion(id) {
    fetch('database.json')
        .then(response => response.json())
        .then(titulos => {
            const titulo = titulos.find(t => t.id === id);
            const detallesDiv = document.getElementById('detallesTitulo');
            const modal = new bootstrap.Modal(document.getElementById('modalTitulo'));
            
            if (titulo) {
                detallesDiv.innerHTML = `
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${titulo.src}" class="img-fluid rounded" alt="${titulo.titulo}">
                        </div>
                        <div class="col-md-8">
                            <h4>${titulo.titulo}</h4>
                            <p><strong>Tipo:</strong> ${titulo.tipo === 'pelicula' ? 'Película' : 'Serie'}</p>
                            <p><strong>Año:</strong> ${titulo.año}</p>
                            <p><strong>Género:</strong> ${titulo.genero}</p>
                            <p><strong>Director:</strong> ${titulo.director}</p>
                            <p><strong>Duración:</strong> ${titulo.duracion}</p>
                            <p><strong>Calificación:</strong> ${titulo.calificacion}/5</p>
                            <p><strong>Actores:</strong> ${titulo.actores.join(', ')}</p>
                            <p><strong>Descripción:</strong> ${titulo.descripcion}</p>
                        </div>
                    </div>
                `;
            } else {
                detallesDiv.innerHTML = '<p>No se encontró información del título.</p>';
            }
            
            modal.show();
        })
        .catch(error => console.error('Error al cargar los detalles:', error));
}

// Función para hacer scroll a una sección
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Función para inicializar los eventos de navegación
function inicializarNavegacion() {
    // Botón Inicio
    document.querySelector('.btn-dark[onclick="scrollToTop()"]').onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Botones de navegación
    const botones = ['peliculas', 'series', 'tendencias', 'favoritos'];
    botones.forEach(boton => {
        const elemento = document.querySelector(`.btn-dark[onclick="scrollToSection('${boton}')"]`);
        if (elemento) {
            elemento.onclick = () => scrollToSection(boton);
        }
    });
}

// Cargar los datos cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    inicializarNavegacion();
}); 