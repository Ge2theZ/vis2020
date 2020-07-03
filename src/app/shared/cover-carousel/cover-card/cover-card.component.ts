import {Component, Input, OnInit} from '@angular/core';
import {CoverCarousel} from '../../../../models/CoverCarousel';
import { Router, NavigationExtras } from '@angular/router';
import {NavigationService} from '../../../services/navigate.service';
import {InteractionService} from '../../../services/interaction.service';

@Component({
  selector: 'app-cover-card',
  templateUrl: './cover-card.component.html',
  styleUrls: ['./cover-card.component.css']
})
export class CoverCardComponent implements OnInit {
  @Input() game: CoverCarousel;
  tooltipOptions = {
    'placement': 'left',
    'contentType' : 'template',
    'theme': 'light',
    'width': 200,
    'max-width': 300,
    'hide-delay': 50
  };

  constructor(private router: Router,
              private navigationService: NavigationService,
              private interactionService: InteractionService) { }

  ngOnInit(): void {
  }

  navigate(){
    if(!this.isGameCardEmpty()) {
      this.router.navigate([`/home/details`, this.navigationService.encodeURLElement(this.game.game.name)]);
      this.navigationService.updateGame(this.game.game);
    }
  }

  onHover() {
    if(!this.isGameCardEmpty()) {
      this.interactionService.onGameCardHover(this.game.game);
    }

  }

  isGameCardEmpty() {
    return this.game.game.name === "No Game"
  }
}
