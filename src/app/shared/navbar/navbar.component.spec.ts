import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ViewportScroller } from '@angular/common';
import { of } from 'rxjs';
import { Location } from '@angular/common';

const testRoutes = [
  { path: 'login', component: class DummyLoginComponent {} },
  { path: '', component: class DummyHomeComponent {} }
];

class DummyLoginComponent {}
class DummyHomeComponent {}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        RouterTestingModule.withRoutes(testRoutes)
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        ViewportScroller,
        { provide: Location, useValue: jasmine.createSpyObj('Location', ['back']) }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    spyOn(router, 'navigate').and.resolveTo(true);

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Debería cerrar sesión y redirigir al login', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('Debería alternar el estado del menú', () => {
    expect(component.menuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.menuOpen).toBeTrue();
    component.toggleMenu();
    expect(component.menuOpen).toBeFalse();
  });

  it('Debería cerrar el menú', () => {
    component.menuOpen = true;
    fixture.detectChanges();
    component.closeMenu();
    expect(component.menuOpen).toBeFalse();
  });

});