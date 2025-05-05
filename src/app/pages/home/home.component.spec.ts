import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TitleService } from '@core/services/title.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Title } from '@core/models/title.model';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let titleService: jasmine.SpyObj<TitleService>;

  const mockTitle: Title = {
    id: 1,
    title: 'Test Movie',
    overview: 'Test overview',
    poster_path: '/test.jpg',
    backdrop_path: '/backdrop.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5,
    genre_ids: [1, 2, 3]
  };

  beforeEach(async () => {
    const titleServiceSpy = jasmine.createSpyObj('TitleService', [
      'getNowPlayingTitles',
      'getPopularTitles',
      'getTopRatedTitles',
      'getUpcomingTitles'
    ]);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: TitleService, useValue: titleServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    titleService = TestBed.inject(TitleService) as jasmine.SpyObj<TitleService>;
    titleService.getNowPlayingTitles.and.returnValue(of([mockTitle]));
    titleService.getPopularTitles.and.returnValue(of([mockTitle]));
    titleService.getTopRatedTitles.and.returnValue(of([mockTitle]));
    titleService.getUpcomingTitles.and.returnValue(of([mockTitle]));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Debería cargar las películas en cartelera', () => {
    expect(component.nowPlaying).toContain(mockTitle);
    expect(titleService.getNowPlayingTitles).toHaveBeenCalled();
  });

  it('Debería cargar las películas populares', () => {
    expect(component.popular).toContain(mockTitle);
    expect(titleService.getPopularTitles).toHaveBeenCalled();
  });

  it('Debería cargar las películas mejor valoradas', () => {
    expect(component.topRated).toContain(mockTitle);
    expect(titleService.getTopRatedTitles).toHaveBeenCalled();
  });

  it('Debería cargar los próximos estrenos', () => {
    expect(component.upcoming).toContain(mockTitle);
    expect(titleService.getUpcomingTitles).toHaveBeenCalled();
  });
});
