import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CoverCarousel} from '../../../../models/CoverCarousel';
import {DataService} from '../../../services/DataService';
import {StaticCarousel} from '../genre-carousel/genre-carousel.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../services/navigate.service';

@Component({
  selector: 'app-publisher-carousel',
  templateUrl: './publisher-carousel.component.html',
  styleUrls: ['./publisher-carousel.component.css']
})
export class PublisherCarouselComponent implements OnInit {
  data: CoverCarousel[];
  staticCarousels: StaticCarousel[] = [];
  genre: string;

  constructor(public dataService: DataService,
              public router: Router,
              public route: ActivatedRoute,
              public navigationService: NavigationService) { }

  ngOnInit(): void {
    this.genre = this.route.snapshot.params.genreId;
    this.navigationService.updateGenre(this.genre);


    this.dataService.liveCarousel$.subscribe(data => {
      this.data = data;
    });

    //gets called if dataservice is ready
    this.dataService.onReady$.subscribe(ready => {
      if(ready){
        this.dataService.updateCoverCarousel("Racing", 1970, 2019);
        this.calculateStaticCarouselData(this.dataService.getPublisher());
      }
    });
  }

  trackByFn(index) {
    return index;
  }

  calculateStaticCarouselData(publishers: string[]) {
    for (let publisher of publishers) {
      this.staticCarousels.push({title: publisher, data: this.dataService.getStaticCarouselDataForPublisher(this.genre, publisher,1980,2019)});
    }
  }
}
