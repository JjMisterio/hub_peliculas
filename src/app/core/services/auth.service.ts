import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 semana

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

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('sessionExpires');
  }

  isLoggedIn(): boolean {
    const expires = parseInt(localStorage.getItem('sessionExpires') || '0', 10);
    if (Date.now() > expires) {
      this.logout();
      return false;
    }
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
