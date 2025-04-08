// Función para verificar si el usuario está autenticado
function checkAuth() {
    if (window.location.pathname.includes('index.html')) {
        if (!sessionStorage.getItem('isLoggedIn')) {
            window.location.href = 'login.html';
        }
    }
}

// Función para iniciar sesión
function login() {
    sessionStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'index.html';
    return false;
}

// Función para cerrar sesión
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    
    window.location.href = 'login.html';
}

// Verificar la autenticación cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});
