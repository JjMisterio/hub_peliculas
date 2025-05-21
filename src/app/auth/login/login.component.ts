import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

/**
 * Componente que maneja la funcionalidad de inicio de sesión
 * Permite a los usuarios ingresar con su email y contraseña
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: any;
  errorMessage = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Inicializa el formulario con validaciones para email y contraseña
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
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
        next: (success) => {
          if (success) {
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Credenciales incorrectas';
          }
        },
        error: (error) => {
          this.errorMessage = 'Error al iniciar sesión. Por favor, intente nuevamente.';
          console.error('Error de login:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente';
    }
  }
}