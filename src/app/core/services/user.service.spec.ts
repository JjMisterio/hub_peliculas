import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { environment } from '@environments/environment';
import { User, CreateUserDto, LoginDto } from '../models/user.model';
import { AuthResponse } from '../models/auth-response.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let apiUrl: string;

  const mockUser: User = {
    idUser: 1,
    name: 'Test User',
    email: 'test@example.com',
    dateCreation: new Date(),
    dateModified: new Date()
  };

  const mockUsersArray: User[] = [
    mockUser,
    { 
      idUser: 2, 
      name: 'Another User', 
      email: 'another@example.com', 
      dateCreation: new Date(), 
      dateModified: new Date() 
    }
  ];

  const mockAuthResponse: AuthResponse = {
    token: 'fake-jwt-token',
    user: mockUser
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    apiUrl = `${environment.apiUrl}/users`;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllUsers', () => {
    it('debería devolver todos los usuarios (GET)', () => {
      service.getAllUsers().subscribe(users => {
        expect(users.length).toBe(2);
        expect(users).toEqual(mockUsersArray);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsersArray);
    });
  });

  describe('getUser', () => {
    it('debería devolver un usuario específico por ID (GET)', () => {
      const userId = 1;
      service.getUser(userId).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('getUserByEmail', () => {
    it('debería devolver un usuario específico por email (GET)', () => {
      const userEmail = 'test@example.com';
      service.getUserByEmail(userEmail).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/email/${userEmail}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('createUser', () => {
    it('debería crear un nuevo usuario y devolverlo (POST)', () => {
      const newUserDto: CreateUserDto = { 
        name: 'New User', 
        email: 'new@example.com', 
        password: 'password123' 
      };
      
      const createdUserResponse: User = { 
        idUser: 3,
        name: newUserDto.name,
        email: newUserDto.email,
        dateCreation: new Date(),
        dateModified: new Date()
      };

      service.createUser(newUserDto).subscribe(user => {
        expect(user).toEqual(createdUserResponse);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUserDto);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(createdUserResponse);
    });
  });

  describe('updateUser', () => {
    it('debería actualizar un usuario existente y devolverlo (PUT)', () => {
      const userId = 1;
      const updatedUserData: User = { 
        ...mockUser, 
        name: 'Updated Test User' 
      };

      service.updateUser(userId, updatedUserData).subscribe(user => {
        expect(user).toEqual(updatedUserData);
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedUserData);
      req.flush(updatedUserData);
    });
  });

  describe('deleteUser', () => {
    it('debería eliminar un usuario (DELETE)', () => {
      const userId = 1;
      service.deleteUser(userId).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('login', () => {
    it('debería loguear un usuario y devolver AuthResponse (POST)', () => {
      const credentials: LoginDto = { 
        email: 'test@example.com', 
        password: 'password123' 
      };
      
      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockAuthResponse);
    });
  });

  describe('register', () => {
    it('debería registrar un nuevo usuario y devolver AuthResponse (POST)', () => {
      const newUser: User = { 
        idUser: 0,
        name: 'Registered User',
        email: 'register@example.com',
        dateCreation: new Date(),
        dateModified: new Date()
      };
      
      const registerResponse: AuthResponse = {
        token: 'new-jwt-token',
        user: {
          idUser: 3,
          name: newUser.name,
          email: newUser.email,
          dateCreation: new Date(),
          dateModified: new Date()
        }
      };

      service.register(newUser).subscribe(response => {
        expect(response).toEqual(registerResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(registerResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('debería obtener el usuario actual (GET a /me)', () => {
      service.getCurrentUser().subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('isEmailRegistered', () => {
    it('debería devolver true si getUserByEmail tiene éxito', () => {
      const email = 'test@example.com';
      service.isEmailRegistered(email).subscribe(isRegistered => {
        expect(isRegistered).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/email/${email}`);
      req.flush(mockUser);
    });

    it('debería devolver false si getUserByEmail devuelve un 404', () => {
      const email = 'nonexistent@example.com';
      service.isEmailRegistered(email).subscribe(isRegistered => {
        expect(isRegistered).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/email/${email}`);
      req.flush({}, { status: 404, statusText: 'Not Found' });
    });

    it('debería propagar otros errores de getUserByEmail', () => {
      const email = 'error@example.com';
      service.isEmailRegistered(email).subscribe({
        next: () => fail('debería haber fallado'),
        error: (err) => {
          expect(err.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/email/${email}`);
      req.flush({}, { status: 500, statusText: 'Server Error' });
    });
  });
});