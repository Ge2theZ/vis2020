import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CoverCarousel} from '../../../../models/CoverCarousel';
import {DataService} from '../../../services/DataService';

@Component({
  selector: 'app-publisher-carousel',
  templateUrl: './publisher-carousel.component.html',
  styleUrls: ['./publisher-carousel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublisherCarouselComponent implements OnInit {
  data: CoverCarousel[];
  publisher: string[];
  carouselCache: CoverCarousel[];

  constructor(public dataService: DataService,  private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.dataService.liveCarousel$.subscribe(data => {
      this.data = data;
      this.cdr.detectChanges();
    });

    //gets called if dataservice is ready
    this.dataService.onReady$.subscribe(ready => {
      if(ready){
        this.dataService.updateCoverCarousel("Racing", 1970, 2019);
        this.publisher = this.dataService.getPublisher();
        this.cdr.detectChanges();
      }
    });
  }


  public calculateCarouselData(publisher) {
    this.carouselCache = this.dataService.getStaticCarouselDataForPublisher('Puzzle', publisher, 1970, 2019)
    return this.carouselCache;
  }
}
