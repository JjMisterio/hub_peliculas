import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TitleService } from '@core/services/title.service';
import { Title } from '@core/models/title.model';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let titleService: jasmine.SpyObj<TitleService>;

  const mockTitles: Title[] = [{
    id: 1,
    title: 'Test Movie 1',
    overview: 'Test overview 1',
    poster_path: '/test1.jpg',
    backdrop_path: '/backdrop1.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5,
    genre_ids: [1, 2, 3]
  }];

  const mockNowPlaying: Title[] = [...mockTitles];
  const mockPopular: Title[] = [{ ...mockTitles[0], id: 2, title: 'Popular Movie' }];
  const mockTopRated: Title[] = [{ ...mockTitles[0], id: 3, title: 'Top Rated Movie' }];
  const mockUpcoming: Title[] = [{ ...mockTitles[0], id: 4, title: 'Upcoming Movie' }];

  beforeEach(async () => {
    const titleServiceSpy = jasmine.createSpyObj('TitleService', [
      'getNowPlayingTitles',
      'getPopularTitles',
      'getTopRatedTitles',
      'getUpcomingTitles'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: TitleService, useValue: titleServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    titleService = TestBed.inject(TitleService) as jasmine.SpyObj<TitleService>;

    titleService.getNowPlayingTitles.and.returnValue(of(mockNowPlaying));
    titleService.getPopularTitles.and.returnValue(of(mockPopular));
    titleService.getTopRatedTitles.and.returnValue(of(mockTopRated));
    titleService.getUpcomingTitles.and.returnValue(of(mockUpcoming));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });


  it('Debería mostrar la sección y tarjetas de "En Cartelera" después de que el observable emita', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const section = fixture.debugElement.query(By.css('#cartelera'));
    expect(section).toBeTruthy();

    const cards = section.queryAll(By.css('app-title-card'));
    expect(cards.length).toBe(mockNowPlaying.length);
  }));

  it('Debería mostrar la sección y tarjetas de "Populares" después de que el observable emita', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const section = fixture.debugElement.query(By.css('#populares'));
    expect(section).toBeTruthy();
    const cards = section.queryAll(By.css('app-title-card'));
    expect(cards.length).toBe(mockPopular.length);
  }));

  it('Debería mostrar la sección y tarjetas de "Mejor Valoradas" después de que el observable emita', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const section = fixture.debugElement.query(By.css('#valoradas'));
    expect(section).toBeTruthy();
    const cards = section.queryAll(By.css('app-title-card'));
    expect(cards.length).toBe(mockTopRated.length);
  }));

  it('Debería mostrar la sección y tarjetas de "Próximamente" después de que el observable emita', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const section = fixture.debugElement.query(By.css('#proximamente'));
    expect(section).toBeTruthy();
    const cards = section.queryAll(By.css('app-title-card'));
    expect(cards.length).toBe(mockUpcoming.length);
  }));
});
