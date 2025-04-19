import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '../../core/services/title.service';
import { Title } from '../../core/models/title.model';
import { switchMap } from 'rxjs';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-title-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './title-detail.component.html',
  styleUrl: './title-detail.component.scss'
})
export class TitleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private titleService = inject(TitleService);

  title!: Title;

  ngOnInit(): void {
    this.route.params
      .pipe(switchMap(params => this.titleService.getTitleById(+params['id'])))
      .subscribe(data => this.title = data);
  }

  getBackdropUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w780${path}`;
  }
}
