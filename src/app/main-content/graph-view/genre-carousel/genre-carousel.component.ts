import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/DataService';
import {CoverCarousel} from '../../../../models/CoverCarousel';

export interface StaticCarousel {
  title: string,
  data : CoverCarousel[]
}

@Component({
  selector: 'app-genre-carousel',
  templateUrl: './genre-carousel.component.html',
  styleUrls: ['./genre-carousel.component.css']
})
export class GenreCarouselComponent implements OnInit {
  data: CoverCarousel[] = [];
  staticCarousels: StaticCarousel[] = [];

  constructor(public dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.liveCarousel$.subscribe(data => {
      this.data = data;
    });

    //gets called if dataservice is ready
    this.dataService.onReady$.subscribe(ready => {
      if (ready) {
        this.dataService.updateCoverCarousel('Racing', null, 1970, 2019, 7);
        this.calculateStaticCarouselData(this.dataService.getGenres());
      }
    });
  }

  trackByFn(index) {
    return index;
  }

  calculateStaticCarouselData(cards: string[]) {
    for (let card of cards) {
      this.dataService.getCoverCarousel(card,null,1980,2019, 7).then(data => {
        this.staticCarousels.push({title: card, data: data});
      })

    }
  }
}
