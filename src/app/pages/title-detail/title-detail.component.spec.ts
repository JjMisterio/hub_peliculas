import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleDetailComponent } from './title-detail.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TitleService } from '@core/services/title.service';
import { Title } from '@core/models/title.model';
import { of } from 'rxjs';

describe('TitleDetailComponent', () => {
  let component: TitleDetailComponent;
  let fixture: ComponentFixture<TitleDetailComponent>;
  let titleService: jasmine.SpyObj<TitleService>;
  let route: ActivatedRoute; 

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

  const testId = '1';
  const testIdAsNumber = 1;

  beforeEach(async () => {
    const titleServiceSpy = jasmine.createSpyObj('TitleService', ['getTitleById']);
    titleServiceSpy.getTitleById.withArgs(testIdAsNumber).and.returnValue(of(mockTitle));

    await TestBed.configureTestingModule({
      imports: [TitleDetailComponent],
      providers: [
        { provide: TitleService, useValue: titleServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: testId }),
            snapshot: {
              params: { id: testId },
              paramMap: convertToParamMap({ id: testId })
            },
            paramMap: of(convertToParamMap({ id: testId }))
          }
        },
      ]
    }).compileComponents();

    titleService = TestBed.inject(TitleService) as jasmine.SpyObj<TitleService>;
    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(TitleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Debería cargar los detalles de la película al inicializar', () => {
      expect(component.title).toEqual(mockTitle);
      expect(titleService.getTitleById).toHaveBeenCalledWith(testIdAsNumber);
  });

  it('Debería generar la URL correcta para la imagen de fondo', () => {
    component.title = mockTitle;
    fixture.detectChanges();

    const backdropUrl = component.getBackdropUrl('/test-backdrop.jpg');
    expect(backdropUrl).toBe('https://image.tmdb.org/t/p/w780/test-backdrop.jpg');

    if (mockTitle.backdrop_path) {
       const backdropUrlFromMock = component.getBackdropUrl(mockTitle.backdrop_path);
       expect(backdropUrlFromMock).toBe(`https://image.tmdb.org/t/p/w780${mockTitle.backdrop_path}`);
    }
  });
});