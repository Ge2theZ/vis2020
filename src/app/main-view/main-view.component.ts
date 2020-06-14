import {Component, OnInit} from '@angular/core';
import {CoverCarousel} from '../../models/CoverCarousel';
import {DataService} from '../services/DataService';

export const mockedCoverCarouselData: CoverCarousel[] =
  [
    {
      timespanString: '1980-1986',
      fromYear: 2000,
      toYear: 2000,
      game: {
        name: 'Wii Sports',
        plattform: 'Wii',
        publisher: 'Nintendo',
        imgUrl: '/games/boxart/full_2258645AmericaFrontccc.jpg'
      }
    },
    {
      timespanString: '1980-1986',
      fromYear: 2000,
      toYear: 2000,
      game: {
        name: 'Super Mario Bros.',
        plattform: 'NES',
        publisher: 'Nintendo',
        imgUrl: '/games/boxart/8972270ccc.jpg'
      }
    },
    {
      timespanString: '1980-1986',
      fromYear: 2000,
      toYear: 2000,
      game: {
        name: 'Mario Kart Wii',
        plattform: 'Wii\n',
        publisher: 'Nintendo\n',
        imgUrl: '/games/boxart/full_8932480AmericaFrontccc.jpg\n'
      }
    },
    {
      timespanString: '1980-1986',
      fromYear: 2000,
      toYear: 2000,
      game: {
        name: 'PlayerUnknown\'s Battlegrounds\n',
        plattform: 'PC\n',
        publisher: 'PUBG Corporation\n',
        imgUrl: '/games/boxart/full_8052843AmericaFrontccc.jpg\n'
      }
    },
    {
      timespanString: '1980-1986',
      fromYear: 2000,
      toYear: 2000,
      game: {
        name: 'Wii Sports Resort\n',
        plattform: 'Wii',
        publisher: 'Nintendo',
        imgUrl: '/games/boxart/full_7295041AmericaFrontccc.jpg\n'
      }
    },
    {
      timespanString: '1980-1986',
      fromYear: 2000,
      toYear: 2000,
      game: {
        name: 'Pokemon Red / Green / Blue Version\n',
        plattform: 'GB\n',
        publisher: 'Nintendo',
        imgUrl: '/games/boxart/full_6442337AmericaFrontccc.png\n'
      }
    }
  ];

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css'],
  providers: [DataService]
})
export class MainViewComponent implements OnInit {
  data: CoverCarousel[] = mockedCoverCarouselData;

  constructor( private dataService : DataService) {
    dataService.liveCarousel$.subscribe(data => {
      this.data = data;
      console.log(data)
    });
    //gets called if dataservice is ready
    dataService.onReady$.subscribe(ready => {
      if(ready){
        dataService.updateCoverCarousel("Racing", 1970, 2019);
      }
    })
  }

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
