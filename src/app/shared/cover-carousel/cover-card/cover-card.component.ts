import {Component, Input, OnInit} from '@angular/core';
import {CoverCarousel} from '../../../../models/CoverCarousel';

@Component({
  selector: 'app-cover-card',
  templateUrl: './cover-card.component.html',
  styleUrls: ['./cover-card.component.css']
})
export class CoverCardComponent implements OnInit {
  @Input() game: CoverCarousel;

  constructor() { }

  ngOnInit(): void {
  }

}
