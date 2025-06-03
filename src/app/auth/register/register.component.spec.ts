import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { RegisterService } from '@core/services/register.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { User } from '@core/models/user.model';
import { RouterTestingModule } from '@angular/router/testing';

class DummyLoginComponent {}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let registerServiceSpy: jasmine.SpyObj<RegisterService>;

  const mockUser: User = {
    idUser: 1,
    name: 'Test User',
    email: 'test@example.com',
    dateCreation: new Date(),
    dateModified: new Date()
  };

  const mockRegisterApiResponse = mockUser;


  beforeEach(async () => {
    const spy = jasmine.createSpyObj('RegisterService', ['register']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyLoginComponent }
        ])
      ],
      providers: [
        { provide: RegisterService, useValue: spy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    registerServiceSpy = TestBed.inject(RegisterService) as jasmine.SpyObj<RegisterService>;

    spyOn(router, 'navigate').and.stub();

    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  describe('Formulario y Validadores', () => {
    it('Debería inicializar el formulario con 4 campos vacíos', () => {
      expect(component.form.get('name')?.value).toBe('');
      expect(component.form.get('email')?.value).toBe('');
      expect(component.form.get('password')?.value).toBe('');
      expect(component.form.get('confirmPassword')?.value).toBe('');
    });

    it('Debería marcar el formulario como inválido si está vacío', () => {
      expect(component.form.valid).toBeFalse();
    });

    it('Debería marcar el formulario como inválido si el email no es válido', () => {
      component.form.get('email')?.setValue('correo-invalido');
      fixture.detectChanges();
      expect(component.form.get('email')?.hasError('email')).toBeTrue();
      expect(component.form.get('email')?.hasError('invalidEmailFormat')).toBeTrue();
    });

    it('Debería marcar el formulario como inválido si las contraseñas no coinciden', () => {
      component.form.get('password')?.setValue('password123');
      component.form.get('confirmPassword')?.setValue('password456');
      fixture.detectChanges();
      expect(component.form.hasError('passwordMismatch')).toBeTrue();
      expect(component.form.get('confirmPassword')?.hasError('passwordMismatch')).toBeTrue();
    });

    it('Debería ser válido cuando todos los campos son correctos', () => {
      component.form.patchValue({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
      fixture.detectChanges();
      expect(component.form.valid).toBeTrue();
    });
  });

  describe('Método register()', () => {
    it('no debería llamar al servicio si el formulario es inválido', () => {
      component.form.get('name')?.setValue('');
      fixture.detectChanges();
      component.register();
      expect(registerServiceSpy.register).not.toHaveBeenCalled();
      expect(component.errorMessage).toBe('Por favor, completa todos los campos correctamente');
    });

    //CORREGIR
    /*it('debería llamar al servicio, mostrar notificación y navegar al login en un registro exitoso', fakeAsync(() => {
      component.form.patchValue({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
      fixture.detectChanges();

      registerServiceSpy.register.and.returnValue(of(mockRegisterApiResponse));

      component.register();

      expect(component.isLoading).toBeTrue();
      expect(registerServiceSpy.register).toHaveBeenCalledTimes(1);

      tick();
      fixture.detectChanges();

      expect(component.isLoading).toBeFalse();
      expect(component.showNotification).toBeTrue();
      expect(component.notificationMessage).toBe('¡Registro exitoso!');
      expect(router.navigate).not.toHaveBeenCalled();

      tick(2000);

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));*/

    /*it('debería mostrar un mensaje de error si el servicio falla', fakeAsync(() => {
      component.form.patchValue({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
      fixture.detectChanges();

      const errorResponse = new HttpErrorResponse({
        error: { message: 'Este correo ya está en uso.' },
        status: 400
      });
      registerServiceSpy.register.and.returnValue(throwError(() => errorResponse));

      component.register();

      expect(component.isLoading).toBeTrue();

      tick();
      fixture.detectChanges();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Este correo ya está en uso.');
      expect(component.showNotification).toBeFalse();
      expect(router.navigate).not.toHaveBeenCalled();
    }));*/
  });
});