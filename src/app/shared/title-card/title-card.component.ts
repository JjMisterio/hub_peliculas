import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@core/models/title.model';

/**
 * Componente que muestra una tarjeta con la información básica de una película
 * Incluye la imagen del póster y enlaces a los detalles de la película
 */
@Component({
  selector: 'app-title-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './title-card.component.html',
  styleUrl: './title-card.component.scss'
})
export class TitleCardComponent {
  @Input() title!: Title;

  /**
   * Genera la URL completa para la imagen del póster de la película
   * @param path - Ruta parcial de la imagen
   * @returns string - URL completa de la imagen
   */
  getImageUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}
