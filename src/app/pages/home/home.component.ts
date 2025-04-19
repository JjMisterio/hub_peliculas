import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../core/services/title.service';
import { Title } from '../../core/models/title.model';
import { TitleCardComponent } from '../../shared/title-card/title-card.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TitleCardComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private titleService = inject(TitleService);
  nowPlaying: Title[] = [];
  popular: Title[] = [];
  topRated: Title[] = [];
  upcoming: Title[] = [];

  ngOnInit(): void {
    this.titleService.getNowPlayingTitles().subscribe((res) => {
      this.nowPlaying = res;
    });
    this.titleService.getPopularTitles().subscribe((res) => {
      this.popular = res;
    });
    this.titleService.getTopRatedTitles().subscribe((res) => {
      this.topRated = res;
    });
    this.titleService.getUpcomingTitles().subscribe((res) => {
      this.upcoming = res;
    });
  }
}
