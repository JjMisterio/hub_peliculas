import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Title } from '../models/title.model';
import { environment } from '@environments/environment';

/**
 * Servicio que maneja las peticiones a la API de TMDB
 * Proporciona métodos para obtener diferentes categorías de películas
 */
@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private baseUrl = environment.tmdbBaseUrl;
  private apiKey = environment.tmdbApiKey;

  constructor(private http: HttpClient) {}

  /**
   * Método privado para realizar peticiones genéricas a la API de TMDB
   * @param endpoint - Ruta específica de la API
   * @returns Observable<Title[]> - Lista de títulos
   */
  private fetchTitles(endpoint: string): Observable<Title[]> {
    const url = `${this.baseUrl}/movie/${endpoint}`;
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http.get<{ results: Title[] }>(url, { params }).pipe(
      map(response => response.results)
    );
  }

  /**
   * Obtiene las películas actualmente en cartelera
   * @returns Observable<Title[]> - Lista de películas en cartelera
   */
  getNowPlayingTitles(): Observable<Title[]> {
    return this.fetchTitles('now_playing?language=es-MX&page=1');
  }

  /**
   * Obtiene las películas más populares
   * @returns Observable<Title[]> - Lista de películas populares
   */
  getPopularTitles(): Observable<Title[]> {
    return this.fetchTitles('popular?language=es-MX&page=1');
  }

  /**
   * Obtiene las películas mejor valoradas
   * @returns Observable<Title[]> - Lista de películas mejor valoradas
   */
  getTopRatedTitles(): Observable<Title[]> {
    return this.fetchTitles('top_rated?language=es-MX&page=1');
  }

  /**
   * Obtiene las próximas películas a estrenar
   * @returns Observable<Title[]> - Lista de próximos estrenos
   */
  getUpcomingTitles(): Observable<Title[]> {
    return this.fetchTitles('upcoming?language=es-MX&page=1');
  }

  /**
   * Obtiene los detalles de una película específica por su ID
   * @param id - ID de la película
   * @returns Observable<Title> - Detalles de la película
   */
  getTitleById(id: number): Observable<Title> {
    const url = `${this.baseUrl}/movie/${id}?language=es-MX`;
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http.get<Title>(url, { params });
  }
}

