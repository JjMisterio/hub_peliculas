import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '@core/services/title.service';
import { Title } from '@core/models/title.model';
//import { TitleCardComponent } from '@shared/title-card/title-card.component';
import { NavbarComponent } from '@shared/navbar/navbar.component';
import { TitleCarouselComponent } from '@shared/title-carousel/title-carousel.component';
import { Observable } from 'rxjs';

/**
 * Componente principal que muestra las diferentes categorías de películas
 * Utiliza observables para obtener los datos de la API y los pasa a los componentes hijos
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, TitleCarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private titleService = inject(TitleService);

  /**
   * Observables para almacenar las diferentes categorías de películas
   * Se asignan en ngOnInit y se consumen en el template usando el pipe async
   */
  nowPlaying$!: Observable<Title[]>;
  popular$!: Observable<Title[]>;
  topRated$!: Observable<Title[]>;
  upcoming$!: Observable<Title[]>;

  /**
   * Inicializa el componente y asigna los observables de cada categoría
   */
  ngOnInit(): void {
    this.nowPlaying$ = this.titleService.getNowPlayingTitles();
    this.popular$ = this.titleService.getPopularTitles();
    this.topRated$ = this.titleService.getTopRatedTitles();
    this.upcoming$ = this.titleService.getUpcomingTitles();
  }
}