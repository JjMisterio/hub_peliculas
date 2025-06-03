import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserMoviePreferenceService } from './user-movie-preference.service';
import { environment } from '@environments/environment';
import { CreateUserMoviePreferenceDto, UpdateUserMoviePreferenceDto, UserMoviePreference } from '../models/user-movie-preference.model';

describe('UserMoviePreferenceService', () => {
  let service: UserMoviePreferenceService;
  let httpMock: HttpTestingController;
  let apiUrl: string;

  const mockPreference: UserMoviePreference = {
    idUserPreference: 1,
    idUser: 1,
    idMovieTmdb: 123,
    isFavorite: true,
    isHidden: false,
    dateModified: new Date(),
    userName: "Usuario Prueba",
    userEmail: "usuario@prueba.com"
  };

  const mockPreferencesArray: UserMoviePreference[] = [
    mockPreference,
    { 
      idUserPreference: 2, 
      idUser: 1, 
      idMovieTmdb: 456, 
      isFavorite: false, 
      isHidden: true, 
      dateModified: new Date(),
      userName: "Usuario Prueba",
      userEmail: "usuario@prueba.com"
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserMoviePreferenceService]
    });

    service = TestBed.inject(UserMoviePreferenceService);
    httpMock = TestBed.inject(HttpTestingController);
    apiUrl = `${environment.apiUrl}/UserMoviePreferences`;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPreferences', () => {
    it('debería devolver todas las preferencias (GET)', () => {
      service.getAllPreferences().subscribe(prefs => {
        expect(prefs.length).toBe(2);
        expect(prefs).toEqual(mockPreferencesArray);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPreferencesArray);
    });
  });

  describe('getUserPreferences', () => {
    it('debería devolver las preferencias para un usuario específico (GET)', () => {
      const userId = 1;

      service.getUserPreferences(userId).subscribe(prefs => {
        expect(prefs.length).toBe(2);
        expect(prefs).toEqual(mockPreferencesArray);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPreferencesArray);
    });
  });

  describe('createPreference', () => {
    it('debería crear una nueva preferencia y devolverla (POST)', () => {
      const newPreferenceDto: CreateUserMoviePreferenceDto = {
        idUser: 1,
        idMovieTmdb: 789,
        isFavorite: true,
        isHidden: false
      };

      service.createPreference(newPreferenceDto).subscribe(createdPref => {
        expect(createdPref).toEqual(mockPreference);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPreferenceDto);
      req.flush(mockPreference);
    });
  });

  describe('updatePreference', () => {
    it('debería actualizar una preferencia existente (PUT)', () => {
      const preferenceId = 1;
      const updateDto: UpdateUserMoviePreferenceDto = { 
        idUser: 1,
        idMovieTmdb: 123,
        isFavorite: false, 
        isHidden: true 
      };

      service.updatePreference(preferenceId, updateDto).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/${preferenceId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateDto);
      req.flush(null);
    });
  });

  describe('deletePreference', () => {
    it('debería eliminar una preferencia (DELETE)', () => {
      const preferenceId = 1;

      service.deletePreference(preferenceId).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/${preferenceId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('isMovieFavorite', () => {
    it('debería devolver true si la película es favorita', () => {
      const userId = 1;
      const movieId = 123;

      service.isMovieFavorite(userId, movieId).subscribe(isFav => {
        expect(isFav).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPreferencesArray);
    });

    it('debería devolver false si la preferencia existe pero no es favorita', () => {
      const userId = 1;
      const movieId = 456;

      service.isMovieFavorite(userId, movieId).subscribe(isFav => {
        expect(isFav).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPreferencesArray);
    });

    it('debería devolver false si no existe una preferencia para esa película', () => {
      const userId = 1;
      const movieId = 999;

      service.isMovieFavorite(userId, movieId).subscribe(isFav => {
        expect(isFav).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPreferencesArray);
    });
  });
});