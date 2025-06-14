import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RegisterService } from '@core/services/register.service';
import { CreateUserDto } from '@core/models/user.model';
import { NotificationDialogComponent } from '@shared/notification-dialog/notification-dialog.component';

/**
 * Componente que maneja el registro de nuevos usuarios
 * Permite a los usuarios crear una nueva cuenta con nombre, email y contraseña
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NotificationDialogComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form: any;
  errorMessage = '';
  isLoading = false;
  showNotification = false;
  notificationMessage = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private registerService: RegisterService
  ) {
    // Inicializa el formulario con validaciones para nombre, email y contraseña
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailDomainValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Validador personalizado para verificar el formato del correo electrónico
   * Asegura que el correo tenga un dominio y una extensión válida
   */
  private emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) return null;

    // Expresión regular para validar el formato del correo
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return { invalidEmailFormat: true };
    }

    return null;
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  /**
   * Maneja el proceso de registro de usuarios
   * Valida el formulario y redirige al usuario a la página de login si el registro es exitoso
   * Muestra un mensaje de error si el formulario no es válido
   */
  register() {
    if (this.form.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { name, email, password } = this.form.value;
    const userData: CreateUserDto = { name, email, password };

    this.registerService.register(userData).subscribe({
      next: () => {
        this.showNotification = true;
        this.notificationMessage = '¡Registro exitoso!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.errorMessage = 'Error al registrar usuario. Por favor, intente nuevamente.';
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onNotificationClose() {
    this.showNotification = false;
  }
}
