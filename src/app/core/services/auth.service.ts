import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

/**
 * Servicio que maneja la autenticación de usuarios
 * Proporciona métodos para login, logout y verificación del estado de autenticación
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 semana
  private currentUser: User | null = null;
  private isBrowser: boolean;

  constructor(
    private userService: UserService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    }
  }

  /**
   * Autentica al usuario con email y contraseña
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns Observable<boolean> - true si la autenticación es exitosa, false en caso contrario
   */
  login(email: string, password: string): Observable<boolean> {
    return this.userService.login({ email, password }).pipe(
      map(user => {
        if (user) {
          this.currentUser = user;
          const expiration = Date.now() + this.SESSION_DURATION;
          
          if (this.isBrowser) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('sessionExpires', expiration.toString());
          }
          
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error detallado en login:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        return of(false);
      })
    );
  }

  /**
   * Cierra la sesión del usuario actual
   * Elimina los datos de autenticación del localStorage
   */
  logout() {
    this.currentUser = null;
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('sessionExpires');
    }
  }

  /**
   * Verifica si el usuario está autenticado
   * Comprueba el estado de autenticación y la expiración de la sesión
   * @returns boolean - true si el usuario está autenticado, false en caso contrario
   */
  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    
    const expires = parseInt(localStorage.getItem('sessionExpires') || '0', 10);
    if (Date.now() > expires) {
      this.logout();
      return false;
    }
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  /**
   * Obtiene el usuario actual
   * @returns User | null - El usuario actual o null si no hay sesión activa
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Obtiene el ID del usuario actual
   * @returns number | null - El ID del usuario actual o null si no hay sesión activa
   */
  getCurrentUserId(): number | null {
    return this.currentUser?.idUser || null;
  }
}
