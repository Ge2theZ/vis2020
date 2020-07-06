import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {CoverCarousel} from '../../../../models/CoverCarousel';
import {DataService} from '../../../services/DataService';
import {StaticCarousel} from '../genre-carousel/genre-carousel.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-publisher-carousel',
  templateUrl: './publisher-carousel.component.html',
  styleUrls: ['./publisher-carousel.component.css']
})
export class PublisherCarouselComponent implements OnInit, AfterViewInit {
  data: CoverCarousel[];
  staticCarousels: StaticCarousel[] = [];
  genre: string;
  publisherList: string[];
  publisherIndex: number;
  carouselFullyLoaded = false;
  carouselReloadStepSize = 50;


  constructor(public dataService: DataService,
              public router: Router,
              public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.genre = this.route.snapshot.params.genreId;

    this.dataService.liveCarousel$.subscribe(data => {
      this.data = data;
    });

    //gets called if dataservice is ready
    this.dataService.onReady$.subscribe(ready => {
      if (ready) {
        this.dataService.updateCoverCarousel(this.genre, null, 1970, 2019, 7);
        this.publisherList = this.dataService.getPublishersForGenre(this.genre);
        console.log(this.publisherList);
        this.publisherIndex = 8;
        this.calculateStaticCarouselData(this.publisherList.slice(0, 8));
      }
    });
  }

  ngAfterViewInit(): void {

  }

  trackByFn(index) {
    return index;
  }

  backToTop() {
    window.scroll(0, 0);
  }

  calculateStaticCarouselData(publishers: string[]) {
    console.log('Publishers to be loaded: ', publishers);
    console.time('Start calculateStaticCarouselData');
    publishers.forEach(publisher => {
      this.dataService.getCoverCarousel(this.genre, publisher, 1980, 2019, 7).then(data => {
        this.staticCarousels.push({title: publisher, data: data});
      });
    });
    console.timeEnd('Start calculateStaticCarouselData');
  }


  @HostListener('window:scroll', [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (this.publisherIndex < this.publisherList.length) {
        // load the next 4 for publisher carousels
        let calculatedCarousels: StaticCarousel[] = [];
        let nextIndices = this.publisherIndex + this.carouselReloadStepSize > this.publisherList.length ? this.publisherList.length : this.publisherIndex + this.carouselReloadStepSize;
        this.publisherList.slice(this.publisherIndex, nextIndices).forEach(publisher => {
          this.dataService.getCoverCarousel(this.genre, publisher, 1980, 2019, 7).then(data => {
            calculatedCarousels.push({title: publisher, data: data});
            if (calculatedCarousels.length === (nextIndices - this.publisherIndex)) {
              this.staticCarousels.push(...calculatedCarousels);
              this.publisherIndex += (nextIndices - this.publisherIndex);
            }
          });
        });
      } else {
        this.carouselFullyLoaded = true;
        console.log('No more games to load.');
      }
    }
  }
}
