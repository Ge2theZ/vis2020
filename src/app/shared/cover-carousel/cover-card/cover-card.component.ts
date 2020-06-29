import {Component, Input, OnInit} from '@angular/core';
import {CoverCarousel} from '../../../../models/CoverCarousel';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-cover-card',
  templateUrl: './cover-card.component.html',
  styleUrls: ['./cover-card.component.css']
})
export class CoverCardComponent implements OnInit {
  @Input() game: CoverCarousel;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigate(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
          game: JSON.stringify(this.game.game)
      }
    } 
    console.log(this.game)
    this.router.navigate([`/home/details/${this.game.game.name}`], navigationExtras);
  }
}
