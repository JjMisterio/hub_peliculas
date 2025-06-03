import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { User, CreateUserDto, UpdateUserDto, LoginDto } from '../models/user.model';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Obtener un usuario específico
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Obtener usuario por email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

  // Crear un nuevo usuario
  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, this.httpOptions);
  }

  // Actualizar un usuario existente
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Login de usuario
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  // Verificar si un email ya está registrado
  isEmailRegistered(email: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.getUserByEmail(email).subscribe(
        () => {
          observer.next(true);
          observer.complete();
        },
        error => {
          if (error.status === 404) {
            observer.next(false);
            observer.complete();
          } else {
            observer.error(error);
          }
        }
      );
    });
  }

  // Registrar un nuevo usuario
  register(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user);
  }

  // Obtener el usuario actual
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }
} 