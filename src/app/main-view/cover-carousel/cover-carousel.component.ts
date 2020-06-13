import {Component, Input, OnInit} from '@angular/core';
import {CoverCarousel} from '../../../models/CoverCarousel';

@Component({
  selector: 'app-cover-carousel',
  templateUrl: './cover-carousel.component.html',
  styleUrls: ['./cover-carousel.component.css']
})
export class CoverCarouselComponent implements OnInit {
  @Input() data: CoverCarousel[];
  @Input() cardName: string;

  constructor() { }

  ngOnInit(): void {
  }

}
