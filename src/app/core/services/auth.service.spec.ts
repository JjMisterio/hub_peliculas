import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { User } from '../models/user.model';

const mockUser: User = {
  idUser: 1,
  name: 'Test User',
  email: 'test@example.com',
  dateCreation: new Date(),
  dateModified: new Date()
};

const mockLoginResponse = {
  user: mockUser,
  token: 'fake-jwt-token'
};


describe('AuthService', () => {
  let authService: AuthService;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const configureTestBed = () => {
    const spy = jasmine.createSpyObj('UserService', ['login']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: spy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    authService = TestBed.inject(AuthService);
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  };

  afterEach(() => {
    localStorage.clear();
  });


  describe('cuando se crea sin datos en localStorage', () => {
    beforeEach(() => {
      localStorage.clear();
      configureTestBed();
    });

    it('Debería crearse correctamente y no tener usuario actual', () => {
      expect(authService).toBeTruthy();
      expect(authService.getCurrentUser()).toBeNull();
    });

    it('login debería retornar true y guardar datos cuando las credenciales son correctas', (done: DoneFn) => {
      userServiceSpy.login.and.returnValue(of(mockLoginResponse));

      authService.login('test@example.com', 'password123').subscribe(result => {
        expect(result).toBe(true);
        expect(authService.getCurrentUser()).toEqual(mockUser);
        expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockUser));
        expect(localStorage.getItem('token')).toBe('fake-jwt-token');
        done();
      });
    });

    it('login debería retornar false cuando las credenciales son incorrectas', (done: DoneFn) => {
        const errorResponse = { status: 401, error: 'Credenciales inválidas' };
        userServiceSpy.login.and.returnValue(throwError(() => errorResponse));
  
        authService.login('test@example.com', 'wrongpassword').subscribe(result => {
          expect(result).toBe(false);
          expect(authService.getCurrentUser()).toBeNull();
          expect(localStorage.getItem('token')).toBeNull();
          done();
        });
      });
  });

  describe('cuando se crea con datos en localStorage', () => {
    beforeEach(() => {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      localStorage.setItem('token', 'fake-token-from-storage');
      configureTestBed();
    });


    it('isLoggedIn debería devolver true', () => {
        expect(authService.isLoggedIn()).toBe(true);
    });

    it('logout debería limpiar el estado y el localStorage', () => {
      authService.logout();

      expect(authService.getCurrentUser()).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

});