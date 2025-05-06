import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleCardComponent } from './title-card.component';
import { provideRouter } from '@angular/router';
import { Title } from '@core/models/title.model';

describe('TitleCardComponent', () => {
  let component: TitleCardComponent;
  let fixture: ComponentFixture<TitleCardComponent>;

  const mockTitle: Title = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    overview: 'Test overview',
    release_date: '2024-01-01',
    vote_average: 8.5,
    backdrop_path: '/backdrop.jpg',
    genre_ids: [1, 2, 3]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleCardComponent],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TitleCardComponent);
    component = fixture.componentInstance;
    component.title = mockTitle;
    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Debería generar la URL de imagen correcta', () => {
    const imageUrl = component.getImageUrl('/test.jpg');
    expect(imageUrl).toBe('https://image.tmdb.org/t/p/w500/test.jpg');
  });

  it('Debería mostrarse el título correctamente', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Test Movie');
  });
});
