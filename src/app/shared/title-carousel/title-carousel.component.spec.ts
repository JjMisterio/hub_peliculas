import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { TitleCarouselComponent } from './title-carousel.component';
import { Title } from '@core/models/title.model';

const mockTitles: Title[] = [
  { id: 1, title: 'Movie 1', overview: 'Overview 1', poster_path: '/poster1.jpg', backdrop_path: '/backdrop1.jpg', release_date: '2023-01-01', vote_average: 7.5, genre_ids: [1] },
  { id: 2, title: 'Movie 2', overview: 'Overview 2', poster_path: '/poster2.jpg', backdrop_path: '/backdrop2.jpg', release_date: '2023-02-01', vote_average: 8.0, genre_ids: [2] },
  { id: 3, title: 'Movie 3', overview: 'Overview 3', poster_path: '/poster3.jpg', backdrop_path: '/backdrop3.jpg', release_date: '2023-03-01', vote_average: 6.5, genre_ids: [3] },
  { id: 4, title: 'Movie 4', overview: 'Overview 4', poster_path: '/poster4.jpg', backdrop_path: '/backdrop4.jpg', release_date: '2023-04-01', vote_average: 7.0, genre_ids: [4] },
  { id: 5, title: 'Movie 5', overview: 'Overview 5', poster_path: '/poster5.jpg', backdrop_path: '/backdrop5.jpg', release_date: '2023-05-01', vote_average: 8.2, genre_ids: [5] },
  { id: 6, title: 'Movie 6', overview: 'Overview 6', poster_path: '/poster6.jpg', backdrop_path: '/backdrop6.jpg', release_date: '2023-06-01', vote_average: 7.8, genre_ids: [6] },
];

@Component({
  standalone: true,
  imports: [TitleCarouselComponent, RouterTestingModule],
  template: `
    <app-title-carousel
      [titleSection]="testSectionTitle"
      [titles]="testTitles">
    </app-title-carousel>
  `
})
class TestHostComponent {
  testSectionTitle: string = 'Test Section';
  testTitles: Title[] | null = mockTitles;
}


describe('TitleCarouselComponent', () => {
  let component: TitleCarouselComponent;
  let fixture: ComponentFixture<TitleCarouselComponent>;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TitleCarouselComponent,
        TestHostComponent,
        RouterTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleCarouselComponent);
    component = fixture.componentInstance;

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
  });

  it('debería crearse', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería mostrar el título de la sección proporcionado a través del Input', () => {
    const testTitle = 'Películas Populares';
    component.titleSection = testTitle;
    fixture.detectChanges();

    const h2Element = fixture.debugElement.query(By.css('.carousel-header h2'));
    expect(h2Element).toBeTruthy();
    expect(h2Element.nativeElement.textContent).toBe(testTitle);
  });

  it('debería renderizar el número correcto de app-title-card (verificando con NO_ERRORS_SCHEMA)', () => {
    component.titles = mockTitles;
    fixture.detectChanges();
    const cardElements = fixture.debugElement.queryAll(By.css('app-title-card'));
    expect(cardElements.length).toBe(mockTitles.length);
  });

  it('debería mostrar los botones de navegación si hay suficientes títulos (>5)', () => {
    component.titles = mockTitles;
    fixture.detectChanges();
    const navButtonsDiv = fixture.debugElement.query(By.css('.carousel-nav-buttons'));
    expect(navButtonsDiv).toBeTruthy();
  });

  it('NO debería mostrar los botones de navegación si hay pocos títulos (<=5)', () => {
    component.titles = mockTitles.slice(0, 4);
    fixture.detectChanges();
    const navButtonsDiv = fixture.debugElement.query(By.css('.carousel-nav-buttons'));
    expect(navButtonsDiv).toBeNull();
  });

  describe('Métodos de Scroll', () => {
    let carouselContentEl: HTMLElement;
    let scrollBySpy: jasmine.Spy;

    beforeEach(() => {
      component.titles = mockTitles;
      fixture.detectChanges();
      
      expect(component.carouselContent).toBeTruthy('carouselContent ViewChild no está definido');
      expect(component.carouselContent.nativeElement).toBeTruthy('carouselContent.nativeElement no está definido');
      
      carouselContentEl = component.carouselContent.nativeElement;
      scrollBySpy = spyOn(carouselContentEl, 'scrollBy').and.callThrough();
    });

    it('scrollLeft() debería llamar a scrollBy con un valor negativo', () => {
      component.scrollLeft();
      const expectedScrollAmount = component['getScrollAmount']();
      expect(scrollBySpy).toHaveBeenCalledWith({ left: -expectedScrollAmount, behavior: 'smooth' });
    });

    it('scrollRight() debería llamar a scrollBy con un valor positivo', () => {
      component.scrollRight();
      const expectedScrollAmount = component['getScrollAmount']();
      expect(scrollBySpy).toHaveBeenCalledWith({ left: expectedScrollAmount, behavior: 'smooth' });
    });

    it('getScrollAmount() debería devolver un valor basado en el clientWidth de app-title-card o un default', () => {
        const mockCardEl = document.createElement('app-title-card');
        Object.defineProperty(mockCardEl, 'clientWidth', { value: 150, configurable: true });
        
        while (carouselContentEl.firstChild) {
            carouselContentEl.removeChild(carouselContentEl.firstChild);
        }
        carouselContentEl.appendChild(mockCardEl);

        let scrollAmount = component['getScrollAmount']();
        expect(scrollAmount).toBe(150 * 3);

        carouselContentEl.removeChild(mockCardEl);

        while (carouselContentEl.firstChild) {
            carouselContentEl.removeChild(carouselContentEl.firstChild);
        }
        scrollAmount = component['getScrollAmount']();
        expect(scrollAmount).toBe(200 * 3);
    });
  });

  describe('trackById', () => {
    it('debería devolver el id del item', () => {
      const item: Title = mockTitles[0];
      expect(component.trackById(0, item)).toBe(item.id);
    });
  });

  describe('Con TestHostComponent', () => {
    let carouselInstanceFromHost: TitleCarouselComponent;

    beforeEach(() => {
        hostFixture.detectChanges();
        const carouselDebugElement = hostFixture.debugElement.query(By.directive(TitleCarouselComponent));
        expect(carouselDebugElement).toBeTruthy('No se encontró TitleCarouselComponent en TestHostComponent');
        carouselInstanceFromHost = carouselDebugElement.componentInstance;
    });

    it('debería recibir titleSection y titles del componente anfitrión', () => {
        expect(carouselInstanceFromHost.titleSection).toBe(hostComponent.testSectionTitle);
        expect(carouselInstanceFromHost.titles).toEqual(hostComponent.testTitles);
    });
  });
});