import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@core/models/title.model';
import { TitleCardComponent } from '@shared/title-card/title-card.component';

/**
 * Componente que muestra un carrusel horizontal de películas o series
 * Permite la navegación mediante botones de desplazamiento
 */
@Component({
  selector: 'app-title-carousel',
  standalone: true,
  imports: [CommonModule, TitleCardComponent],
  templateUrl: './title-carousel.component.html',
  styleUrls: ['./title-carousel.component.scss']
})
export class TitleCarouselComponent {
  /** Título de la sección que se muestra en el carrusel */
  @Input() titleSection: string = '';

  /** Array de películas o series a mostrar en el carrusel */
  @Input() titles: Title[] | null = [];

  /** Referencia al contenedor del carrusel para controlar el scroll */
  @ViewChild('carouselContent') carouselContent!: ElementRef<HTMLElement>;

  constructor() { }

  /**
   * Desplaza el carrusel hacia la izquierda
   * Utiliza scroll suave para una mejor experiencia de usuario
   */
  scrollLeft(): void {
    if (this.carouselContent) {
      this.carouselContent.nativeElement.scrollBy({ left: -this.getScrollAmount(), behavior: 'smooth' });
    }
  }

  /**
   * Desplaza el carrusel hacia la derecha
   * Utiliza scroll suave para una mejor experiencia de usuario
   */
  scrollRight(): void {
    if (this.carouselContent) {
      this.carouselContent.nativeElement.scrollBy({ left: this.getScrollAmount(), behavior: 'smooth' });
    }
  }

  /**
   * Calcula la cantidad de píxeles a desplazar basado en el ancho de las tarjetas
   * @returns number - Cantidad de píxeles a desplazar
   */
  private getScrollAmount(): number {
    if (this.carouselContent) {
        const cardWidth = this.carouselContent.nativeElement.querySelector('app-title-card')?.clientWidth || 200;
        return cardWidth * 3;
    }
    return 300;
  }

  /**
   * Función de seguimiento para optimizar el rendimiento del ngFor
   * @param index - Índice del elemento en el array
   * @param item - Elemento del array
   * @returns number - ID único del elemento
   */
  trackById(index: number, item: Title): number {
    return item.id;
  }
}