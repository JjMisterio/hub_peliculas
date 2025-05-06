import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

class DummyLoginComponent {}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
           { path: 'register', component: RegisterComponent },
           { path: 'login', component: DummyLoginComponent }
        ])
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { params: {}, paramMap: convertToParamMap({}) },
            paramMap: of(convertToParamMap({}))
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

    spyOn(router, 'navigate').and.stub();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Debería inicializar el formulario con campos vacíos', () => {
    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('Debería mostrar error cuando el formulario es inválido', () => {
    component.form.patchValue({
      name: '',
      email: 'correo-invalido',
      password: '123'
    });
    component.register();
    expect(component.errorMessage).toBe('Revisa los campos: email válido y contraseña mínimo 8 caracteres');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('Debería ser válido cuando el formulario tiene datos correctos', () => {
    component.form.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    expect(component.form.valid).toBeTrue();
  });

  it('Debería redirigir al login cuando el registro es exitoso', () => {
    component.form.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    component.register();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});