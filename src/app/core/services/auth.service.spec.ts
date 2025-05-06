import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  it('Debería crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('Debería retornar true y guardar datos en localStorage cuando las credenciales son correctas', () => {
      const result = service.login('admin@maraton.com', '12345678');
      
      expect(result).toBeTrue();
      expect(localStorage.getItem('isLoggedIn')).toBe('true');
      expect(localStorage.getItem('sessionExpires')).toBeTruthy();
    });

    it('Debería retornar false cuando el email es incorrecto', () => {
      const result = service.login('usuario@incorrecto.com', '12345678');
      
      expect(result).toBeFalse();
      expect(localStorage.getItem('isLoggedIn')).toBeNull();
      expect(localStorage.getItem('sessionExpires')).toBeNull();
    });

    it('Debería retornar false cuando la contraseña es incorrecta', () => {
      const result = service.login('admin@maraton.com', 'contraseña_incorrecta');
      
      expect(result).toBeFalse();
      expect(localStorage.getItem('isLoggedIn')).toBeNull();
      expect(localStorage.getItem('sessionExpires')).toBeNull();
    });
  });
});
