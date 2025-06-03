import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LoginComponent } from './login.component';
import { AuthService } from '@core/services/auth.service';

import { RouterTestingModule } from '@angular/router/testing';

class DummyHomeComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyHomeComponent }
        ])
      ],
      providers: [
        { provide: AuthService, useValue: spy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate').and.stub();

    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  describe('Formulario y Validadores', () => {
    it('Debería inicializar el formulario con email y password vacíos', () => {
      expect(component.form.get('email')?.value).toBe('');
      expect(component.form.get('password')?.value).toBe('');
    });

    it('Debería marcar el formulario como inválido si está vacío', () => {
      expect(component.form.valid).toBeFalse();
    });

    it('Debería marcar el email como inválido si tiene un formato incorrecto', () => {
      component.form.get('email')?.setValue('correo-invalido');
      fixture.detectChanges();
      expect(component.form.get('email')?.hasError('email')).toBeTrue();
      expect(component.form.get('email')?.hasError('invalidEmailFormat')).toBeTrue();
    });

     it('Debería marcar el password como inválido si es muy corto', () => {
      component.form.get('password')?.setValue('123');
      fixture.detectChanges();
      expect(component.form.get('password')?.hasError('minlength')).toBeTrue();
    });

    it('Debería ser válido cuando el email y password tienen formatos correctos', () => {
      component.form.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      fixture.detectChanges();
      expect(component.form.valid).toBeTrue();
    });
  });

  describe('Método login()', () => {
    it('debería mostrar notificación de error si el formulario es inválido', () => {
      component.form.get('email')?.setValue('correo-invalido');
      fixture.detectChanges();

      component.login();

      expect(authServiceSpy.login).not.toHaveBeenCalled();
      expect(component.showNotification).toBeTrue();
      expect(component.notificationMessage).toBe('Por favor, complete todos los campos correctamente');
      expect(component.notificationType).toBe('error');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    //COREGIR
    /*it('debería llamar a authService.login, mostrar notificación de éxito y navegar en un login exitoso', fakeAsync(() => {
      component.form.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      fixture.detectChanges();
      authServiceSpy.login.and.returnValue(of(true));

      component.login();
      fixture.detectChanges();

      expect(component.isLoading).toBeTrue();
      expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password123');

      tick();
      fixture.detectChanges();

      expect(component.isLoading).toBeFalse();
      expect(component.showNotification).toBeTrue();
      expect(component.notificationMessage).toBe('¡Inicio de sesión exitoso!');
      expect(component.notificationType).toBe('success');

      tick(2000);
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    }));

    it('debería mostrar notificación de error si authService.login devuelve false', fakeAsync(() => {
      component.form.patchValue({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      fixture.detectChanges();
      authServiceSpy.login.and.returnValue(of(false));

      component.login();
      fixture.detectChanges();

      expect(component.isLoading).toBeTrue();

      tick();
      fixture.detectChanges();

      expect(component.isLoading).toBeFalse();
      expect(component.showNotification).toBeTrue();
      expect(component.notificationMessage).toBe('Credenciales incorrectas');
      expect(component.notificationType).toBe('error');
      expect(router.navigate).not.toHaveBeenCalled();
    }));

    it('debería mostrar notificación de error si authService.login falla (error de API)', fakeAsync(() => {
      component.form.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      fixture.detectChanges();
      const apiError = new HttpErrorResponse({ error: { message: 'Error del servidor simulado' }, status: 500 });
      authServiceSpy.login.and.returnValue(throwError(() => apiError));

      component.login();
      fixture.detectChanges();

      expect(component.isLoading).toBeTrue();

      tick();
      fixture.detectChanges();

      expect(component.isLoading).toBeFalse();
      expect(component.showNotification).toBeTrue();
      expect(component.notificationMessage).toBe('Error del servidor simulado');
      expect(component.notificationType).toBe('error');
      expect(router.navigate).not.toHaveBeenCalled();
    }));*/
  });

  describe('onNotificationClose', () => {
    it('debería poner showNotification a false', () => {
      component.showNotification = true;
      component.onNotificationClose();
      expect(component.showNotification).toBeFalse();
    });
  });
});