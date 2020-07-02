import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
export class PublisherCarouselComponent implements OnInit, AfterViewInit {
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
        this.dataService.updateCoverCarousel(this.genre, null, 1970, 2019, 7);
        this.calculateStaticCarouselData(this.dataService.getPublisher());
      }
    });
  }

  ngAfterViewInit(): void {

  }

  trackByFn(index) {
    return index;
  }

  calculateStaticCarouselData(publishers: string[]) {
    console.time("Start calculateStaticCarouselData");
    publishers.forEach(publisher => {
      this.dataService.getCoverCarousel(this.genre, publisher, 1980, 2019, 7).then(data => {
        this.staticCarousels.push({title: publisher, data: data});
      });
    });
    console.timeEnd("Start calculateStaticCarouselData");
  }
}
