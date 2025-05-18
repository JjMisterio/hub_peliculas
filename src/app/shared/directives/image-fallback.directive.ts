import { Directive, Input, ElementRef, HostListener, OnInit } from '@angular/core';

/**
 * Directiva que maneja el fallback de imágenes cuando la URL original falla
 * Proporciona una imagen por defecto y maneja los errores de carga
 */
@Directive({
  selector: 'img[appImageFallback]', // Se aplicará a etiquetas <img> que tengan el atributo appImageFallback
  standalone: true,
})
export class ImageFallbackDirective implements OnInit {
  /** URL de la imagen de fallback a mostrar cuando la imagen original falla */
  @Input() appImageFallback: string = 'assets/images/default-poster.webp';

  /** URL de la imagen principal a mostrar (opcional) */
  @Input() src?: string;

  /** Indica si ya se intentó cargar la imagen original */
  private hasTriedOriginalSrc = false;

  /** Indica si ya se intentó cargar la imagen de fallback */
  private hasTriedFallback = false;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  /**
   * Inicializa la directiva y configura la imagen inicial
   * Verifica si la imagen original ya está cargada y maneja errores iniciales
   */
  ngOnInit(): void {
    if (this.src) {
      this.el.nativeElement.src = this.src;
    }
    if (this.el.nativeElement.complete && this.el.nativeElement.naturalWidth === 0) {
        this.handleError();
    }
  }

  /**
   * Maneja el evento de error al cargar una imagen
   * Intenta cargar la imagen de fallback si la original falla
   */
  @HostListener('error')
  handleError() {
    if (!this.hasTriedOriginalSrc) {
        this.hasTriedOriginalSrc = true;
        console.warn(`Imagen original falló: ${this.el.nativeElement.src}. Intentando fallback.`);
        this.el.nativeElement.src = this.appImageFallback;
        return;
    }

    if (this.hasTriedOriginalSrc && !this.hasTriedFallback) {
        this.hasTriedFallback = true;
        console.error(`Imagen de fallback también falló: ${this.appImageFallback}`);
    }
  }

  /**
   * Maneja el evento de carga exitosa de una imagen
   * Resetea los flags de intentos para permitir reintentos futuros
   */
  @HostListener('load')
  handleLoad() {
    if (this.el.nativeElement.src !== this.appImageFallback) {
        this.hasTriedOriginalSrc = false;
        this.hasTriedFallback = false;
    } else if (this.el.nativeElement.src === this.appImageFallback && this.hasTriedOriginalSrc) {
        this.hasTriedFallback = true;
    }
  }
}