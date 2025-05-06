import { TestBed } from '@angular/core/testing';
import { TitleService } from './title.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Title } from '../models/title.model';
import { environment } from '@environments/environment';

describe('TitleService', () => {
  let service: TitleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TitleService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TitleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('Deberían obtenerse los títulos de cartelera', () => {
    const mockTitles: Title[] = [
      {
        id: 1,
        title: 'Test Movie',
        overview: 'Test overview',
        poster_path: '/test.jpg',
        backdrop_path: '/backdrop.jpg',
        release_date: '2024-01-01',
        vote_average: 8.5,
        genre_ids: [1, 2, 3]
      }
    ];

    service.getNowPlayingTitles().subscribe(titles => {
      expect(titles).toEqual(mockTitles);
    });

    const req = httpMock.expectOne(`${environment.tmdbBaseUrl}/movie/now_playing?language=es-MX&page=1&api_key=${environment.tmdbApiKey}`);
    expect(req.request.method).toBe('GET');
    req.flush({ results: mockTitles });
  });
});
