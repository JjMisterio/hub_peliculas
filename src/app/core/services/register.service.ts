import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { User, CreateUserDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = `${environment.apiUrl}/Users`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Registra un nuevo usuario
   * @param userData Datos del usuario a registrar
   * @returns Observable con el usuario creado
   */
  register(userData: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData, this.httpOptions);
  }

  /**
   * Verifica si un email ya está registrado
   * @param email Email a verificar
   * @returns Observable con true si el email está disponible, false si ya está registrado
   */
  isEmailAvailable(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email/${email}`);
  }
}
