import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '@core/services/title.service';
import { UserMoviePreferenceService } from '@core/services/user-movie-preference.service';
import { AuthService } from '@core/services/auth.service';
import { Title } from '@core/models/title.model';
import { UserMoviePreference, CreateUserMoviePreferenceDto, UpdateUserMoviePreferenceDto } from '@core/models/user-movie-preference.model';
import { NavbarComponent } from '@shared/navbar/navbar.component';
import { Subscription } from 'rxjs';

/**
 * Componente que muestra los detalles de una película específica
 * Obtiene la información de la película a través de su ID en la URL
 */
@Component({
  selector: 'app-title-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './title-detail.component.html',
  styleUrl: './title-detail.component.scss'
})
export class TitleDetailComponent implements OnInit, OnDestroy {
  title: Title | null = null;
  stars: number[] = [];
  isFavorite: boolean = false;
  isHidden: boolean = false;
  private currentUserId: number | null = null;
  private preferenceId: number | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private titleService: TitleService,
    private userMoviePreferenceService: UserMoviePreferenceService,
    private authService: AuthService
  ) {}

  /**
   * Inicializa el componente cargando los detalles de la película
   * Obtiene el ID de la película de los parámetros de la ruta
   */
  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        const id = params['id'];
        this.titleService.getTitleById(id).subscribe(title => {
          this.title = title;
          if (title) {
            this.calculateStars(title.vote_average);
            this.loadTitleState(title.id);
          }
        });
      })
    );
  }

  /**
   * Limpia las suscripciones al destruir el componente
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Genera la URL completa para la imagen de fondo de la película
   * @param path - Ruta parcial de la imagen
   * @returns string - URL completa de la imagen
   */
  getBackdropUrl(path: string): string {
    return `https://image.tmdb.org/t/p/original${path}`;
  }

  /**
   * Formatea la fecha de estreno de la película al formato español
   * @param dateString - Fecha en formato string
   * @returns string - Fecha formateada en español
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month} de ${year}`;
  }

  /**
   * Calcula el número de estrellas a mostrar basado en la valoración
   * @param rating - Valoración de la película (escala de 10)
   */
  calculateStars(rating: number): void {
    const starRating = (rating / 2);
    this.stars = Array(5).fill(0).map((_, index) => {
      if (index < Math.floor(starRating)) {
        return 1;
      } else if (index === Math.floor(starRating) && starRating % 1 >= 0.5) {
        return 0.5;
      }
      return 0;
    });
  }

  /**
   * Carga el estado de preferencias de la película
   * Primero verifica en localStorage, si no existe consulta la API
   * @param movieId - ID de la película en TMDB
   */
  private loadTitleState(movieId: number): void {
    if (!this.currentUserId) return;

    // Primero intentar cargar desde localStorage
    const storedPreferences = localStorage.getItem('moviePreferences');
    if (storedPreferences) {
      const preferences = JSON.parse(storedPreferences);
      const moviePreference = preferences[movieId];
      if (moviePreference) {
        this.isFavorite = moviePreference.isFavorite;
        this.isHidden = moviePreference.isHidden;
        this.preferenceId = moviePreference.idUserPreference;
        return;
      }
    }

    // Si no está en localStorage, consultar la API
    this.subscriptions.push(
      this.userMoviePreferenceService.getUserPreferences(this.currentUserId).subscribe(
        preferences => {
          const preference = preferences.find(p => p.idMovieTmdb === movieId);
          if (preference) {
            this.isFavorite = preference.isFavorite;
            this.isHidden = preference.isHidden;
            this.preferenceId = preference.idUserPreference;
            this.updateLocalStorage(movieId, preference);
          }
        }
      )
    );
  }

  /**
   * Actualiza el localStorage con las preferencias de la película
   * @param movieId - ID de la película en TMDB
   * @param preference - Preferencias de la película
   */
  private updateLocalStorage(movieId: number, preference: UserMoviePreference): void {
    const storedPreferences = localStorage.getItem('moviePreferences');
    const preferences = storedPreferences ? JSON.parse(storedPreferences) : {};
    preferences[movieId] = {
      idUserPreference: preference.idUserPreference,
      isFavorite: preference.isFavorite,
      isHidden: preference.isHidden
    };
    localStorage.setItem('moviePreferences', JSON.stringify(preferences));
  }

  /**
   * Alterna el estado de favorito de la película
   * Actualiza la API y el localStorage
   */
  toggleFavorite(): void {
    if (!this.currentUserId || !this.title) return;

    this.isFavorite = !this.isFavorite;
    
    if (this.preferenceId) {
      // Actualizar preferencia existente
      const updateDto: UpdateUserMoviePreferenceDto = {
        idUser: this.currentUserId,
        idMovieTmdb: this.title.id,
        isFavorite: this.isFavorite,
        isHidden: this.isHidden
      };
      
      this.subscriptions.push(
        this.userMoviePreferenceService.updatePreference(this.preferenceId, updateDto).subscribe(() => {
          this.updateLocalStorage(this.title!.id, {
            idUserPreference: this.preferenceId!,
            idUser: this.currentUserId!,
            idMovieTmdb: this.title!.id,
            isFavorite: this.isFavorite,
            isHidden: this.isHidden,
            dateModified: new Date(),
            userName: '',
            userEmail: ''
          });
        })
      );
    } else {
      // Crear nueva preferencia
      const createDto: CreateUserMoviePreferenceDto = {
        idUser: this.currentUserId,
        idMovieTmdb: this.title.id,
        isFavorite: this.isFavorite,
        isHidden: this.isHidden
      };
      
      this.subscriptions.push(
        this.userMoviePreferenceService.createPreference(createDto).subscribe(newPreference => {
          this.preferenceId = newPreference.idUserPreference;
          this.updateLocalStorage(this.title!.id, newPreference);
        })
      );
    }
  }

  /**
   * Alterna el estado de oculto de la película
   * Actualiza la API y el localStorage
   */
  toggleHidden(): void {
    if (!this.currentUserId || !this.title) return;

    this.isHidden = !this.isHidden;
    
    if (this.preferenceId) {
      // Actualizar preferencia existente
      const updateDto: UpdateUserMoviePreferenceDto = {
        idUser: this.currentUserId,
        idMovieTmdb: this.title.id,
        isFavorite: this.isFavorite,
        isHidden: this.isHidden
      };
      
      this.subscriptions.push(
        this.userMoviePreferenceService.updatePreference(this.preferenceId, updateDto).subscribe(() => {
          this.updateLocalStorage(this.title!.id, {
            idUserPreference: this.preferenceId!,
            idUser: this.currentUserId!,
            idMovieTmdb: this.title!.id,
            isFavorite: this.isFavorite,
            isHidden: this.isHidden,
            dateModified: new Date(),
            userName: '',
            userEmail: ''
          });
        })
      );
    } else {
      // Crear nueva preferencia
      const createDto: CreateUserMoviePreferenceDto = {
        idUser: this.currentUserId,
        idMovieTmdb: this.title.id,
        isFavorite: this.isFavorite,
        isHidden: this.isHidden
      };
      
      this.subscriptions.push(
        this.userMoviePreferenceService.createPreference(createDto).subscribe(newPreference => {
          this.preferenceId = newPreference.idUserPreference;
          this.updateLocalStorage(this.title!.id, newPreference);
        })
      );
    }
  }
}
