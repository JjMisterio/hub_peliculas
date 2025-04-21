import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '@core/services/title.service';
import { Title } from '@core/models/title.model';
import { switchMap } from 'rxjs';
import { NavbarComponent } from '@shared/navbar/navbar.component';

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
export class TitleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private titleService = inject(TitleService);

  title!: Title;

  /**
   * Inicializa el componente cargando los detalles de la película
   * Obtiene el ID de la película de los parámetros de la ruta
   */
  ngOnInit(): void {
    this.route.params
      .pipe(switchMap(params => this.titleService.getTitleById(+params['id'])))
      .subscribe(data => this.title = data);
  }

  /**
   * Genera la URL completa para la imagen de fondo de la película
   * @param path - Ruta parcial de la imagen
   * @returns string - URL completa de la imagen
   */
  getBackdropUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w780${path}`;
  }
}
