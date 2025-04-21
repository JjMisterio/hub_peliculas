import { Injectable } from '@angular/core';

/**
 * Servicio que maneja la autenticación de usuarios
 * Proporciona métodos para login, logout y verificación del estado de autenticación
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 semana

  /**
   * Autentica al usuario con email y contraseña
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns boolean - true si la autenticación es exitosa, false en caso contrario
   */
  login(email: string, password: string): boolean {
    if (email === 'admin@maraton.com' && password === '12345678') {
      this.isAuthenticated = true;
      const expiration = Date.now() + this.SESSION_DURATION;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('sessionExpires', expiration.toString());
      return true;
    }
    return false;
  }

  /**
   * Cierra la sesión del usuario actual
   * Elimina los datos de autenticación del localStorage
   */
  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('sessionExpires');
  }

  /**
   * Verifica si el usuario está autenticado
   * Comprueba el estado de autenticación y la expiración de la sesión
   * @returns boolean - true si el usuario está autenticado, false en caso contrario
   */
  isLoggedIn(): boolean {
    const expires = parseInt(localStorage.getItem('sessionExpires') || '0', 10);
    if (Date.now() > expires) {
      this.logout();
      return false;
    }
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
