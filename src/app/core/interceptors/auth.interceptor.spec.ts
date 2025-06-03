import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería añadir un token de autorización si está disponible', () => {
    const fakeToken = 'my-fake-jwt-token';
    authServiceSpy.getToken.and.returnValue(fakeToken);

    httpClient.get('/test-url').subscribe();

    const httpRequest = httpMock.expectOne('/test-url');
    expect(httpRequest.request.headers.has('Authorization')).toBeTrue();
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);

    httpRequest.flush({});
  });

  it('NO debería añadir un token de autorización si no está disponible', () => {
    authServiceSpy.getToken.and.returnValue(null);

    httpClient.get('/test-url').subscribe();

    const httpRequest = httpMock.expectOne('/test-url');
    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();

    httpRequest.flush({});
  });

  it('debería pasar la petición sin modificar si el token es una cadena vacía', () => {
    authServiceSpy.getToken.and.returnValue('');

    httpClient.get('/test-url').subscribe();
    const httpRequest = httpMock.expectOne('/test-url');

    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
    httpRequest.flush({});
  });

  it('debería funcionar con diferentes métodos HTTP (ej. POST)', () => {
    const fakeToken = 'my-fake-jwt-token-for-post';
    authServiceSpy.getToken.and.returnValue(fakeToken);
    const postData = { data: 'test' };

    httpClient.post('/test-url-post', postData).subscribe();

    const httpRequest = httpMock.expectOne('/test-url-post');
    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.headers.has('Authorization')).toBeTrue();
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
    expect(httpRequest.request.body).toEqual(postData);

    httpRequest.flush({});
  });
});