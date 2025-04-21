import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

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
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

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
