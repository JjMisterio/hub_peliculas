import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ImageFallbackDirective } from './image-fallback.directive';

@Component({
  standalone: true,
  imports: [ImageFallbackDirective],
  template: `
    <img id="test-image" src="invalid-url.jpg" appImageFallback="assets/images/custom-fallback.jpg">

    <img id="default-fallback-image" src="another-invalid.jpg" appImageFallback>
  `
})
class TestHostComponent {}


describe('ImageFallbackDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('debería crear el componente anfitrión con la directiva', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('debería cambiar el src a la imagen de fallback personalizada en un evento de error', () => {
    const imgElement: HTMLImageElement = fixture.debugElement.query(By.css('#test-image')).nativeElement;
    const customFallbackSrc = 'assets/images/custom-fallback.jpg';

    imgElement.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(imgElement.src).toContain(customFallbackSrc);
  });

  //CORREGIR
  /*it('debería usar el fallback por defecto de la directiva si no se especifica uno', fakeAsync(() => {
    const imgElement: HTMLImageElement = fixture.debugElement.query(By.css('#default-fallback-image')).nativeElement;
    const defaultFallbackSrc = 'assets/images/default-poster.webp';

    imgElement.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    tick();

    expect(imgElement.src).toContain(defaultFallbackSrc);
  }));*/

  it('NO debería cambiar el src si la imagen se carga correctamente (evento load)', () => {
    const imgElement: HTMLImageElement = fixture.debugElement.query(By.css('#test-image')).nativeElement;
    const originalSrc = imgElement.src;

    imgElement.dispatchEvent(new Event('load'));
    fixture.detectChanges();

    expect(imgElement.src).toBe(originalSrc);
    expect(imgElement.src).not.toContain('custom-fallback.jpg');
  });

  it('no debería entrar en un bucle si la imagen de fallback también falla', () => {
    const imgElement: HTMLImageElement = fixture.debugElement.query(By.css('#test-image')).nativeElement;
    const customFallbackSrc = 'assets/images/custom-fallback.jpg';

    spyOn(console, 'error');

    imgElement.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(imgElement.src).toContain(customFallbackSrc);

    imgElement.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(imgElement.src).toContain(customFallbackSrc);
    expect(console.error).toHaveBeenCalledWith(jasmine.stringMatching(/Imagen de fallback también falló/));
  });
});