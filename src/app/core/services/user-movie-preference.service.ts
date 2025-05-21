import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { UserMoviePreference, CreateUserMoviePreferenceDto, UpdateUserMoviePreferenceDto } from '../models/user-movie-preference.model';

@Injectable({
  providedIn: 'root'
})
export class UserMoviePreferenceService {
  private apiUrl = `${environment.apiUrl}/UserMoviePreferences`;

  constructor(private http: HttpClient) { }

  // Obtener todas las preferencias
  getAllPreferences(): Observable<UserMoviePreference[]> {
    return this.http.get<UserMoviePreference[]>(this.apiUrl);
  }

  // Obtener una preferencia específica
  getPreference(id: number): Observable<UserMoviePreference> {
    return this.http.get<UserMoviePreference>(`${this.apiUrl}/${id}`);
  }

  // Obtener preferencias de un usuario específico
  getUserPreferences(userId: number): Observable<UserMoviePreference[]> {
    return this.http.get<UserMoviePreference[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Crear una nueva preferencia
  createPreference(preference: CreateUserMoviePreferenceDto): Observable<UserMoviePreference> {
    return this.http.post<UserMoviePreference>(this.apiUrl, preference);
  }

  // Actualizar una preferencia existente
  updatePreference(id: number, preference: UpdateUserMoviePreferenceDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, preference);
  }

  // Eliminar una preferencia
  deletePreference(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método auxiliar para verificar si una película es favorita
  isMovieFavorite(userId: number, movieId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.getUserPreferences(userId).subscribe(
        preferences => {
          const preference = preferences.find(p => p.idMovieTmdb === movieId);
          observer.next(preference?.isFavorite ?? false);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  // Método auxiliar para verificar si una película está oculta
  isMovieHidden(userId: number, movieId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.getUserPreferences(userId).subscribe(
        preferences => {
          const preference = preferences.find(p => p.idMovieTmdb === movieId);
          observer.next(preference?.isHidden ?? false);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }
}
