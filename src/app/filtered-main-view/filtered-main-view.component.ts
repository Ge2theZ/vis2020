import { Component, OnInit } from '@angular/core';
import {CoverCarousel} from '../../models/CoverCarousel';

@Component({
  selector: 'app-filtered-main-view',
  templateUrl: './filtered-main-view.component.html',
  styleUrls: ['./filtered-main-view.component.css']
})
export class FilteredMainViewComponent implements OnInit {
  data: CoverCarousel[];
  constructor() { }

  ngOnInit(): void {
    console.log('test');
  }

}
