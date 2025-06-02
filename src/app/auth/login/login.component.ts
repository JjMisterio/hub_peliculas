import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NotificationDialogComponent } from '@shared/notification-dialog/notification-dialog.component';

/**
 * Componente que maneja la funcionalidad de inicio de sesión
 * Permite a los usuarios ingresar con su email y contraseña
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NotificationDialogComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: any;
  errorMessage = '';
  isLoading = false;
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Inicializa el formulario con validaciones para email y contraseña
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.emailDomainValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]]
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
   * Maneja el proceso de inicio de sesión
   * Verifica las credenciales y redirige al usuario si son correctas
   * Muestra un mensaje de error si las credenciales son incorrectas
   */
  login() {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { email, password } = this.form.value;
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response) {
            this.showNotification = true;
            this.notificationMessage = '¡Inicio de sesión exitoso!';
            this.notificationType = 'success';
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2000);
          } else {
            this.showNotification = true;
            this.notificationMessage = 'Credenciales incorrectas';
            this.notificationType = 'error';
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.showNotification = true;
          this.notificationMessage = error.error?.message || 'Error al iniciar sesión';
          this.notificationType = 'error';
          this.isLoading = false;
        }
      });
    } else {
      this.showNotification = true;
      this.notificationMessage = 'Por favor, complete todos los campos correctamente';
      this.notificationType = 'error';
    }
  }

  onNotificationClose() {
    this.showNotification = false;
  }
}