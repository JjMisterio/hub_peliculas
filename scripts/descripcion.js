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
        tendencias: { titulo: 'Tendencias', items: [] },
        peliculas: { titulo: 'Películas', items: [] },
        series: { titulo: 'Series', items: [] },
        favoritos: { titulo: 'Favoritos', items: [] },
        ocultos: { titulo: 'Ocultos', items: [] }
    };

    // Organizar los títulos por categorías
    titulos.forEach(titulo => {
        if (titulo.tendencia) secciones.tendencias.items.push(titulo);
        if (titulo.tipo === 'pelicula') secciones.peliculas.items.push(titulo);
        if (titulo.tipo === 'serie') secciones.series.items.push(titulo);
        if (titulo.favorito) secciones.favoritos.items.push(titulo);
        if (titulo.oculto) secciones.ocultos.items.push(titulo);
    });

    // Generar el HTML para cada sección
    let html = '';
    for (const [key, seccion] of Object.entries(secciones)) {
        if (seccion.items.length > 0) {
            html += `
                <div class="seccion mb-5">
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
                            <p><strong>Estado:</strong> ${titulo.oculto ? 'Oculto' : 'Visible'}</p>
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

// Cargar los datos cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarDatos); 