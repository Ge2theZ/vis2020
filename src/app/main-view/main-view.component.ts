import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CoverCarousel} from '../../models/CoverCarousel';
import {DataService} from '../services/DataService';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainViewComponent implements OnInit {
  data: CoverCarousel[];
  genres: string[];

  constructor( public dataService : DataService, private cdr: ChangeDetectorRef) {
  }

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
        this.genres = this.dataService.getGenres();
        console.log("Genres", this.genres);
        this.cdr.detectChanges();
      }
    });
  }
}
