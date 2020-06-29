import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/DataService';
import {NavigationService} from '../../../services/navigate.service';
import {CoverCarousel} from '../../../../models/CoverCarousel';

@Component({
  selector: 'app-genre-carousel',
  templateUrl: './genre-carousel.component.html',
  styleUrls: ['./genre-carousel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenreCarouselComponent implements OnInit {
  data: CoverCarousel[];
  cards: string[];

  constructor(public dataService : DataService,
              public navigationService: NavigationService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.dataService.liveCarousel$.subscribe(data => {
      this.data = data;
      console.log(data)
      this.cdr.detectChanges();
    });
    //gets called if dataservice is ready
    this.dataService.onReady$.subscribe(ready => {
      if(ready){
        this.dataService.updateCoverCarousel("Racing", 1970, 2019);


        this.navigationService.mainViewDepth$.subscribe(depth => {
          switch (depth) {
            case 1:
              this.cards = this.dataService.getGenres();
              console.log("Genres", this.cards);
              break;
            case 2:
              this.cards = this.dataService.getPublisher();
              console.log("Publisher", this.cards);
              break;
          }
        });


        this.cdr.detectChanges();
      }
    });
  }
}
