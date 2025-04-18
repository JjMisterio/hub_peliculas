import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../core/services/title.service';
import { Title } from '../../core/models/title.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
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

  getImageUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}
