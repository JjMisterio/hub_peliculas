import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleCarouselComponent } from './title-carousel.component';

describe('TitleCarouselComponent', () => {
  let component: TitleCarouselComponent;
  let fixture: ComponentFixture<TitleCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
