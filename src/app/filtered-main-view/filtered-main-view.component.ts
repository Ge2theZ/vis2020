import { Component, OnInit } from '@angular/core';
import {CoverCarousel} from '../../models/CoverCarousel';
import {mockedCoverCarouselData} from '../main-view/main-view.component';

@Component({
  selector: 'app-filtered-main-view',
  templateUrl: './filtered-main-view.component.html',
  styleUrls: ['./filtered-main-view.component.css']
})
export class FilteredMainViewComponent implements OnInit {
  data: CoverCarousel[] = mockedCoverCarouselData;
  constructor() { }

  ngOnInit(): void {
  }

  shuffleArray(array) {
    const shuffledArr = [...array];
    for (let i = shuffledArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
    }
    return shuffledArr;
  }

}
