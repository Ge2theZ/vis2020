import {Component, OnInit} from '@angular/core';
import {CoverCarousel} from '../../models/CoverCarousel';


const mockedCoverCarouselData: CoverCarousel[] =
  [
    {
      timespanYear: '1980-1986',
      game: {
        name: 'Wii Sports',
        plattform: 'Wii',
        publisher: 'Nintendo',
        imgUrl: '/games/boxart/full_2258645AmericaFrontccc.jpg'
      }
    },
    {
      timespanYear: '1980-1986',
      game: {
        name: 'Super Mario Bros.',
        plattform: 'NES',
        publisher: 'Nintendo',
        imgUrl: '/games/boxart/8972270ccc.jpg'
      }
    },
    {
      timespanYear: '1980-1986',
      game: {
        name: 'Mario Kart Wii',
        plattform: 'Wii\n',
        publisher: 'Nintendo\n',
        imgUrl: '/games/boxart/full_8932480AmericaFrontccc.jpg\n'
      }
    },
    {
      timespanYear: '1980-1986',
      game: {
        name: 'PlayerUnknown\'s Battlegrounds\n',
        plattform: 'PC\n',
        publisher: 'PUBG Corporation\n',
        imgUrl: '/games/boxart/full_8052843AmericaFrontccc.jpg\n'
      }
    },
    {
      timespanYear: '1980-1986',
      game: {
        name: 'Wii Sports Resort\n',
        plattform: 'Wii',
        publisher: 'Nintendo',
        imgUrl: '/games/boxart/full_7295041AmericaFrontccc.jpg\n'
      }
    },
    {
      timespanYear: '1980-1986',
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
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {
  data: CoverCarousel[] = mockedCoverCarouselData;

  constructor() {
  }

  ngOnInit(): void {
  }

}
