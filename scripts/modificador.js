let titulosGlobales = [];

// Función para actualizar el estado de favorito
async function toggleFavorito(id) {
    try {
        const tituloIndex = titulosGlobales.findIndex(t => t.id === id);
        if (tituloIndex !== -1) {
            // Actualizar el estado en la variable global
            titulosGlobales[tituloIndex].favorito = !titulosGlobales[tituloIndex].favorito;
            
            // Recargar el contenido para reflejar los cambios
            cargarDatos();
        }
    } catch (error) {
        console.error('Error al actualizar favorito:', error);
    }
}

// Función para actualizar el estado de oculto
async function toggleOculto(id) {
    try {
        const tituloIndex = titulosGlobales.findIndex(t => t.id === id);
        if (tituloIndex !== -1) {
            // Actualizar el estado en la variable global
            titulosGlobales[tituloIndex].oculto = !titulosGlobales[tituloIndex].oculto;
            
            // Recargar el contenido para reflejar los cambios
            cargarDatos();
        }
    } catch (error) {
        console.error('Error al actualizar estado oculto:', error);
    }
}

// Función para actualizar el texto del botón de favorito
function actualizarBotonFavorito(id, esFavorito) {
    const botonFavorito = document.getElementById(`btnFavorito_${id}`);
    if (botonFavorito) {
        botonFavorito.textContent = esFavorito ? 'Ya no me gusta' : 'Me gusta';
    }
}

// Función para actualizar el texto del botón de oculto
function actualizarBotonOculto(id, estaOculto) {
    const botonOculto = document.getElementById(`btnOculto_${id}`);
    if (botonOculto) {
        botonOculto.textContent = estaOculto ? 'Desocultar' : 'Ocultar';
    }
}

// Función para cargar los títulos
async function cargarTitulos() {
    try {
        const response = await fetch('database.json');
        titulosGlobales = await response.json();
    } catch (error) {
        console.error('Error al cargar los títulos:', error);
    }
}

// Cargar los títulos cuando se inicia la página
document.addEventListener('DOMContentLoaded', cargarTitulos); 