import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RegisterService } from './register.service';
import { environment } from '@environments/environment';
import { User, CreateUserDto } from '../models/user.model';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;
  let apiUrl: string;

  const mockCreateUserDto: CreateUserDto = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  const mockUserResponse: User = {
    idUser: 1,
    name: 'Test User',
    email: 'test@example.com',
    dateCreation: new Date(),
    dateModified: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegisterService]
    });

    service = TestBed.inject(RegisterService);
    httpMock = TestBed.inject(HttpTestingController);
    apiUrl = `${environment.apiUrl}/Users`;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('debería registrar un usuario y devolver el usuario creado (POST)', () => {
      service.register(mockCreateUserDto).subscribe(user => {
        expect(user).toEqual(mockUserResponse);
        expect(user.idUser).toBeDefined();
      });

      // Assert
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateUserDto);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');

      req.flush(mockUserResponse);
    });

    it('debería manejar errores del servidor al registrar', () => {
      const errorMessage = 'Error en el servidor al registrar';
      
      service.register(mockCreateUserDto).subscribe({
        next: () => fail('debería haber fallado con un error del servidor'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('isEmailAvailable', () => {
    it('debería devolver true si el email está disponible (GET)', () => {
      const email = 'new@example.com';

      service.isEmailAvailable(email).subscribe(isAvailable => {
        expect(isAvailable).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/check-email/${email}`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('debería devolver false si el email NO está disponible (GET)', () => {
      const email = 'taken@example.com';

      service.isEmailAvailable(email).subscribe(isAvailable => {
        expect(isAvailable).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/check-email/${email}`);
      expect(req.request.method).toBe('GET');
      req.flush(false);
    });

    it('debería manejar errores del servidor al verificar el email', () => {
        const email = 'error@example.com';
        const errorMessage = 'Error al verificar email';

        service.isEmailAvailable(email).subscribe({
            next: () => fail('debería haber fallado con un error del servidor'),
            error: (error) => {
              expect(error.status).toBe(500);
            }
          });
    
        const req = httpMock.expectOne(`${apiUrl}/check-email/${email}`);
        expect(req.request.method).toBe('GET');
        req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });
  });
});