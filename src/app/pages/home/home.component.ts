import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '@core/services/title.service';
import { Title } from '@core/models/title.model';
import { TitleCardComponent } from '@shared/title-card/title-card.component';
import { NavbarComponent } from '@shared/navbar/navbar.component';

/**
 * Componente principal que muestra las diferentes categorías de películas
 * Incluye secciones para películas en cartelera, populares, mejor valoradas y próximos estrenos
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TitleCardComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private titleService = inject(TitleService);
  
  // Arrays para almacenar las diferentes categorías de películas
  nowPlaying: Title[] = [];
  popular: Title[] = [];
  topRated: Title[] = [];
  upcoming: Title[] = [];

  /**
   * Inicializa el componente cargando las diferentes categorías de películas
   */
  ngOnInit(): void {
    this.titleService.getNowPlayingTitles().subscribe((res) => {
      this.nowPlaying = res;
    });
    this.titleService.getPopularTitles().subscribe((res) => {
      this.popular = res;
    });
    this.titleService.getTopRatedTitles().subscribe((res) => {
      this.topRated = res;
    });
    this.titleService.getUpcomingTitles().subscribe((res) => {
      this.upcoming = res;
    });
  }
}
