import {Component, Input, OnInit} from '@angular/core';
import {CoverCarousel} from '../../../../models/CoverCarousel';
import { Router } from '@angular/router';
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
    'width': 250,
    'max-width': 300,
    'hide-delay': 50
  };

  constructor(private router: Router,
              private interactionService: InteractionService) { }

  ngOnInit(): void {
  }

  navigate(){
    if(!this.isGameCardEmpty()) {
      this.router.navigate([`/home/details`, this.game.game.index]);
    }
  }

  onHover() {
    if(!this.isGameCardEmpty()) {
      this.interactionService.onGameCardHover(this.game.game);
    }
  }

  onHoverOut() {
    if(!this.isGameCardEmpty()) {
      this.interactionService.onGameCardHover(null);
    }
  }

  isGameCardEmpty() {
    return this.game.game.name === "No Game"
  }
}
