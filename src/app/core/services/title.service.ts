import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Title } from '../models/title.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private baseUrl = environment.tmdbBaseUrl;
  private apiKey = environment.tmdbApiKey;

  constructor(private http: HttpClient) {}

  private fetchTitles(endpoint: string): Observable<Title[]> {
    const url = `${this.baseUrl}/movie/${endpoint}`;
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http.get<{ results: Title[] }>(url, { params }).pipe(
      map(response => response.results)
    );
  }

  getNowPlayingTitles(): Observable<Title[]> {
    return this.fetchTitles('now_playing?language=es-MX&page=1');
  }

  getPopularTitles(): Observable<Title[]> {
    return this.fetchTitles('popular?language=es-MX&page=1');
  }

  getTopRatedTitles(): Observable<Title[]> {
    return this.fetchTitles('top_rated?language=es-MX&page=1');
  }

  getUpcomingTitles(): Observable<Title[]> {
    return this.fetchTitles('upcoming?language=es-MX&page=1');
  }

  getTitleById(id: number): Observable<Title> {
    const url = `${this.baseUrl}/movie/${id}?language=es-MX`;
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http.get<Title>(url, { params });
  }
}

