import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  menuOpen = false;
  private readonly NAVBAR_OFFSET = 80; // Ajuste en píxeles para compensar el navbar

  constructor(
    private auth: AuthService, 
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  scrollToFragment(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      const yOffset = element.getBoundingClientRect().top + window.pageYOffset - this.NAVBAR_OFFSET;
      window.scrollTo({ top: yOffset, behavior: 'smooth' });
    }
  }
}

