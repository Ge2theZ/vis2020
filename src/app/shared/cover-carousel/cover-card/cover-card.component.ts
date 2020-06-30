import {Component, Input, OnInit} from '@angular/core';
import {CoverCarousel} from '../../../../models/CoverCarousel';
import { Router, NavigationExtras } from '@angular/router';
import {NavigationService} from '../../../services/navigate.service';

@Component({
  selector: 'app-cover-card',
  templateUrl: './cover-card.component.html',
  styleUrls: ['./cover-card.component.css']
})
export class CoverCardComponent implements OnInit {
  @Input() game: CoverCarousel;

  constructor(private router: Router,
              private navigationService: NavigationService) { }

  ngOnInit(): void {
  }

  navigate(){
    this.router.navigate([`/home/details/${this.game.game.name}`]);
    this.navigationService.updateGame(this.game.game);
  }
}
