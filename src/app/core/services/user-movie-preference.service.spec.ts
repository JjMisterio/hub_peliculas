import { TestBed } from '@angular/core/testing';

import { UserMoviePreferenceService } from './user-movie-preference.service';

describe('UserMoviePreferenceService', () => {
  let service: UserMoviePreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMoviePreferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
