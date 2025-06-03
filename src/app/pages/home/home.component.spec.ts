import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TitleService } from '@core/services/title.service';
import { AuthService } from '@core/services/auth.service';
import { Title } from '@core/models/title.model';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let titleServiceSpy: jasmine.SpyObj<TitleService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockTitles: Title[] = [{
    id: 1,
    title: 'Test Movie',
    overview: 'Test overview',
    poster_path: '/test.jpg',
    backdrop_path: '/backdrop.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5,
    genre_ids: [1, 2, 3]
  }];

  const mockNowPlaying: Title[] = [...mockTitles];
  const mockPopular: Title[] = [{ ...mockTitles[0], id: 2, title: 'Popular Movie' }];
  const mockTopRated: Title[] = [{ ...mockTitles[0], id: 3, title: 'Top Rated Movie' }];
  const mockUpcoming: Title[] = [{ ...mockTitles[0], id: 4, title: 'Upcoming Movie' }];

  beforeEach(async () => {
    titleServiceSpy = jasmine.createSpyObj('TitleService', [
      'getNowPlayingTitles',
      'getPopularTitles',
      'getTopRatedTitles',
      'getUpcomingTitles'
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getCurrentUserId', 'getCurrentUser', 'logout']); // Añade los métodos que Navbar podría usar

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: TitleService, useValue: titleServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    titleServiceSpy.getNowPlayingTitles.and.returnValue(of(mockNowPlaying));
    titleServiceSpy.getPopularTitles.and.returnValue(of(mockPopular));
    titleServiceSpy.getTopRatedTitles.and.returnValue(of(mockTopRated));
    titleServiceSpy.getUpcomingTitles.and.returnValue(of(mockUpcoming));

    authServiceSpy.isLoggedIn.and.returnValue(false);
    authServiceSpy.getCurrentUserId.and.returnValue(null);
    authServiceSpy.getCurrentUser.and.returnValue(null);

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

  });

  it('Debería crearse', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('Debería asignar los observables de títulos en ngOnInit', () => {
    fixture.detectChanges();

    expect(titleServiceSpy.getNowPlayingTitles).toHaveBeenCalled();
    expect(component.nowPlaying$).toBeDefined();

    expect(titleServiceSpy.getPopularTitles).toHaveBeenCalled();
    expect(component.popular$).toBeDefined();

    expect(titleServiceSpy.getTopRatedTitles).toHaveBeenCalled();
    expect(component.topRated$).toBeDefined();

    expect(titleServiceSpy.getUpcomingTitles).toHaveBeenCalled();
    expect(component.upcoming$).toBeDefined();
  });

  it('Debería mostrar la sección "En Cartelera" cuando nowPlaying$ emite datos', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const section = fixture.debugElement.query(By.css('section#cartelera'));
    expect(section).toBeTruthy();
    const carousel = section.query(By.css('app-title-carousel'));
    expect(carousel).toBeTruthy();
  }));

  it('Debería mostrar la sección "Populares" cuando popular$ emite datos', fakeAsync(() => {
    fixture.detectChanges(); tick(); fixture.detectChanges();
    const section = fixture.debugElement.query(By.css('section#populares'));
    expect(section).toBeTruthy();
    const carousel = section.query(By.css('app-title-carousel'));
    expect(carousel).toBeTruthy();
  }));

  it('Debería mostrar la sección "Mejor Valoradas" cuando topRated$ emite datos', fakeAsync(() => {
    fixture.detectChanges(); tick(); fixture.detectChanges();
    const section = fixture.debugElement.query(By.css('section#valoradas'));
    expect(section).toBeTruthy();
    const carousel = section.query(By.css('app-title-carousel'));
    expect(carousel).toBeTruthy();
  }));

  it('Debería mostrar la sección "Próximamente" cuando upcoming$ emite datos', fakeAsync(() => {
    fixture.detectChanges(); tick(); fixture.detectChanges();
    const section = fixture.debugElement.query(By.css('section#proximamente'));
    expect(section).toBeTruthy();
    const carousel = section.query(By.css('app-title-carousel'));
    expect(carousel).toBeTruthy();
  }));
});