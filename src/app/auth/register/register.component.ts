import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

/**
 * Componente que maneja el registro de nuevos usuarios
 * Permite a los usuarios crear una nueva cuenta con nombre, email y contraseña
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form: any;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router) {
    // Inicializa el formulario con validaciones para nombre, email y contraseña
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  /**
   * Maneja el proceso de registro de usuarios
   * Valida el formulario y redirige al usuario a la página de login si el registro es exitoso
   * Muestra un mensaje de error si el formulario no es válido
   */
  register() {
    if (this.form.invalid) {
      this.errorMessage = 'Revisa los campos: email válido y contraseña mínimo 8 caracteres';
      return;
    }
    const { name, email } = this.form.value;
    console.log('Usuario registrado:', name, email);
    this.router.navigate(['/login']);
  }
}
