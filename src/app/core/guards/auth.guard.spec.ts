import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '@core/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => AuthGuard(...guardParameters));

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;
    spyOn(router, 'navigate');
  });

  it('Debería ser creado', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('Debería permitir el acceso cuando el usuario está autenticado', () => {
    authService.isLoggedIn.and.returnValue(true);
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('Debería denegar el acceso y redirigir al login cuando el usuario no está autenticado', () => {
    authService.isLoggedIn.and.returnValue(false);
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
