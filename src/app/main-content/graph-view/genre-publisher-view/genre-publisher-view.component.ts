import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/DataService';
import {ActivatedRoute, Router} from '@angular/router';
import {Game} from '../../../../models/Game';
import {RadarUseCase} from '../../../shared/radar-chart/radar-chart.component';
import {PieUseCase} from '../../../shared/pie-chart/pie-chart.component';

@Component({
  selector: 'app-genre-publisher-view',
  templateUrl: './genre-publisher-view.component.html',
  styleUrls: ['./genre-publisher-view.component.css']
})
export class GenrePublisherViewComponent implements OnInit {
  PieUseCase = PieUseCase;
  RadarUseCase = RadarUseCase;
  publisher: string;
  genre: string;
  games: Game[];

  constructor(public dataService: DataService,
              public router: Router,
              public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.publisher = this.route.snapshot.params.publisherId;
    this.genre = this.route.snapshot.params.genreId;

    this.dataService.onReady$.subscribe(ready => {
      if (ready) {
        this.games = this.dataService.getGamesOfPublisherInGenre(this.publisher, this.genre);
      }
    });
  }
}
