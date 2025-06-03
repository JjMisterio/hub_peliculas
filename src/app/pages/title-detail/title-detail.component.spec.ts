import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, Subscription } from 'rxjs';

import { TitleDetailComponent } from './title-detail.component';
import { TitleService } from '@core/services/title.service';
import { UserMoviePreferenceService } from '@core/services/user-movie-preference.service';
import { AuthService } from '@core/services/auth.service';
import { Title } from '@core/models/title.model';
import { UserMoviePreference, UpdateUserMoviePreferenceDto, CreateUserMoviePreferenceDto } from '@core/models/user-movie-preference.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TitleDetailComponent', () => {
  let component: TitleDetailComponent;
  let fixture: ComponentFixture<TitleDetailComponent>;
  let titleServiceSpy: jasmine.SpyObj<TitleService>;
  let userMoviePreferenceServiceSpy: jasmine.SpyObj<UserMoviePreferenceService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let activatedRouteMock: any;

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

  const mockUserPreference: UserMoviePreference = {
    idUserPreference: 10,
    idUser: 1,
    idMovieTmdb: mockTitle.id,
    isFavorite: true,
    isHidden: false,
    dateModified: new Date(),
    userName: 'Test User',
    userEmail: 'test@user.com'
  };

  const testMovieIdString = '1';
  const testMovieIdNumber = 1;
  const testUserId = 1;

  beforeEach(async () => {
    titleServiceSpy = jasmine.createSpyObj('TitleService', ['getTitleById']);
    userMoviePreferenceServiceSpy = jasmine.createSpyObj('UserMoviePreferenceService', [
      'getUserPreferences',
      'createPreference',
      'updatePreference'
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUserId']);

    activatedRouteMock = {
      params: of({ id: testMovieIdString }),
      snapshot: {
        params: { id: testMovieIdString },
        paramMap: convertToParamMap({ id: testMovieIdString })
      },
      paramMap: of(convertToParamMap({ id: testMovieIdString }))
    };

    await TestBed.configureTestingModule({
      imports: [TitleDetailComponent],
      providers: [
        { provide: TitleService, useValue: titleServiceSpy },
        { provide: UserMoviePreferenceService, useValue: userMoviePreferenceServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TitleDetailComponent);
    component = fixture.componentInstance;

    titleServiceSpy.getTitleById.and.callFake((id: string | number) => {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      return of(mockTitle);
    });
    
    authServiceSpy.getCurrentUserId.and.returnValue(testUserId);
    userMoviePreferenceServiceSpy.getUserPreferences.and.returnValue(of([mockUserPreference]));

    localStorage.clear();
  });

  it('Debería crearse', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Inicialización (ngOnInit)', () => {
    //CORREGIR
    /*it('Debería cargar los detalles de la película y las preferencias del usuario', fakeAsync(() => {
      localStorage.removeItem('moviePreferences');

      fixture.detectChanges();
      tick();

      expect(authServiceSpy.getCurrentUserId).toHaveBeenCalled();
      expect(titleServiceSpy.getTitleById).toHaveBeenCalledWith(testMovieIdNumber);
      expect(component.title).toEqual(mockTitle);
      expect(component.stars).toEqual([1, 1, 1, 1, 0]);

      tick();
      fixture.detectChanges();

      expect(userMoviePreferenceServiceSpy.getUserPreferences).toHaveBeenCalledWith(testUserId);
      expect(component.isFavorite).toBe(mockUserPreference.isFavorite);
      expect(component.isHidden).toBe(mockUserPreference.isHidden);
      expect((component as any).preferenceId).toBe(mockUserPreference.idUserPreference);
    }));*/

    it('Debería cargar el estado del título desde localStorage si está disponible', fakeAsync(() => {
        const localPreference = {
            idUserPreference: 20,
            isFavorite: false,
            isHidden: true
        };
        const preferences = { [mockTitle.id]: localPreference };
        localStorage.setItem('moviePreferences', JSON.stringify(preferences));

        fixture.detectChanges();

        expect(component.title).toEqual(mockTitle);
        expect(component.isFavorite).toBe(localPreference.isFavorite);
        expect(component.isHidden).toBe(localPreference.isHidden);
        expect((component as any).preferenceId).toBe(localPreference.idUserPreference);
        expect(userMoviePreferenceServiceSpy.getUserPreferences).not.toHaveBeenCalled();
    }));
  });

  it('Debería generar la URL correcta para la imagen de fondo', () => {
    component.title = mockTitle;

    const backdropUrl = component.getBackdropUrl('/test-backdrop.jpg');
    expect(backdropUrl).toBe('https://image.tmdb.org/t/p/original/test-backdrop.jpg');

    if (mockTitle.backdrop_path) {
       const backdropUrlFromMock = component.getBackdropUrl(mockTitle.backdrop_path);
       expect(backdropUrlFromMock).toBe(`https://image.tmdb.org/t/p/original${mockTitle.backdrop_path}`);
    }
  });

  //CORREGIR
  /*it('Debería formatear la fecha correctamente', () => {
    const formattedDate = component.formatDate('2024-07-13');
    expect(formattedDate).toBe('13 de julio de 2024');

    const formattedDate2 = component.formatDate('2023-01-05');
    expect(formattedDate2).toBe('5 de enero de 2023');
  });*/

  it('Debería calcular las estrellas correctamente', () => {
    component.calculateStars(8.5);
    expect(component.stars).toEqual([1, 1, 1, 1, 0]);

    component.calculateStars(7.0);
    expect(component.stars).toEqual([1, 1, 1, 0.5, 0]);

    component.calculateStars(6.2);
    expect(component.stars).toEqual([1, 1, 1, 0, 0]);
  });

  describe('toggleFavorite', () => {
    beforeEach(() => {
        authServiceSpy.getCurrentUserId.and.returnValue(testUserId);
        titleServiceSpy.getTitleById.and.returnValue(of(mockTitle));
    });

    it('debería crear una nueva preferencia si no existe y se marca como favorito', fakeAsync(() => {
        userMoviePreferenceServiceSpy.getUserPreferences.and.returnValue(of([]));
        const newPrefResponse: UserMoviePreference = {
            idUserPreference: 99,
            idUser: testUserId,
            idMovieTmdb: mockTitle.id,
            isFavorite: true,
            isHidden: false,
            dateModified: new Date(),
            userName: '', userEmail: ''
        };
        userMoviePreferenceServiceSpy.createPreference.and.returnValue(of(newPrefResponse));

        fixture.detectChanges();
        tick();
        tick();

        component.isFavorite = false;
        component.isHidden = false;
        (component as any).preferenceId = null;

        component.toggleFavorite();
        tick();

        expect(component.isFavorite).toBe(true);
        const expectedCreateDto: CreateUserMoviePreferenceDto = {
            idUser: testUserId,
            idMovieTmdb: mockTitle.id,
            isFavorite: true,
            isHidden: false
        };
        expect(userMoviePreferenceServiceSpy.createPreference).toHaveBeenCalledWith(expectedCreateDto);
        expect((component as any).preferenceId).toBe(newPrefResponse.idUserPreference);
    }));

    it('debería actualizar una preferencia existente al alternar favorito', fakeAsync(() => {
        userMoviePreferenceServiceSpy.getUserPreferences.and.returnValue(of([mockUserPreference]));
        userMoviePreferenceServiceSpy.updatePreference.and.returnValue(of(void 0));

        fixture.detectChanges();
        tick();
        tick();

        expect(component.isFavorite).toBe(true);
        expect(component.isHidden).toBe(false);
        expect((component as any).preferenceId).toBe(mockUserPreference.idUserPreference);

        component.toggleFavorite();
        tick();

        expect(component.isFavorite).toBe(false);
        const expectedUpdateDto: UpdateUserMoviePreferenceDto = {
            idUser: testUserId,
            idMovieTmdb: mockTitle.id,
            isFavorite: false,
            isHidden: mockUserPreference.isHidden
        };
        expect(userMoviePreferenceServiceSpy.updatePreference).toHaveBeenCalledWith(mockUserPreference.idUserPreference, expectedUpdateDto);
    }));
  });

  describe('toggleHidden', () => {
    beforeEach(() => {
        authServiceSpy.getCurrentUserId.and.returnValue(testUserId);
        titleServiceSpy.getTitleById.and.returnValue(of(mockTitle));
    });

    it('debería crear una nueva preferencia si no existe y se marca como oculta', fakeAsync(() => {
        userMoviePreferenceServiceSpy.getUserPreferences.and.returnValue(of([]));
        const newPrefResponse: UserMoviePreference = {
            idUserPreference: 101, idUser: testUserId, idMovieTmdb: mockTitle.id,
            isFavorite: false, isHidden: true, dateModified: new Date(), userName: '', userEmail: ''
        };
        userMoviePreferenceServiceSpy.createPreference.and.returnValue(of(newPrefResponse));

        fixture.detectChanges(); tick(); tick();

        component.isHidden = false;
        component.isFavorite = false;
        (component as any).preferenceId = null;

        component.toggleHidden();
        tick();

        expect(component.isHidden).toBe(true);
        const expectedCreateDto: CreateUserMoviePreferenceDto = {
            idUser: testUserId, idMovieTmdb: mockTitle.id,
            isFavorite: false, isHidden: true
        };
        expect(userMoviePreferenceServiceSpy.createPreference).toHaveBeenCalledWith(expectedCreateDto);
        expect((component as any).preferenceId).toBe(newPrefResponse.idUserPreference);
    }));

    it('debería actualizar una preferencia existente al alternar oculta', fakeAsync(() => {
        userMoviePreferenceServiceSpy.getUserPreferences.and.returnValue(of([mockUserPreference]));
        userMoviePreferenceServiceSpy.updatePreference.and.returnValue(of(void 0));

        fixture.detectChanges(); tick(); tick();

        expect(component.isHidden).toBe(false);
        expect(component.isFavorite).toBe(true);
        expect((component as any).preferenceId).toBe(mockUserPreference.idUserPreference);

        component.toggleHidden();
        tick();

        expect(component.isHidden).toBe(true);
        const expectedUpdateDto: UpdateUserMoviePreferenceDto = {
            idUser: testUserId, idMovieTmdb: mockTitle.id,
            isFavorite: mockUserPreference.isFavorite,
            isHidden: true
        };
        expect(userMoviePreferenceServiceSpy.updatePreference).toHaveBeenCalledWith(mockUserPreference.idUserPreference, expectedUpdateDto);
    }));
  });

  it('debería desuscribirse de las suscripciones en ngOnDestroy', () => {
    fixture.detectChanges();
    const initialSubscriptionCount = component['subscriptions'].length;
    expect(initialSubscriptionCount).toBeGreaterThan(0);

    component['subscriptions'].forEach(sub => spyOn(sub, 'unsubscribe'));

    component.ngOnDestroy();

    component['subscriptions'].forEach(sub => {
      expect(sub.unsubscribe).toHaveBeenCalled();
    });
  });
});