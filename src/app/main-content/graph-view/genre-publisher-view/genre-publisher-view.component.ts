import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../../services/DataService';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../services/navigate.service';
import {Game} from '../../../../models/Game';

@Component({
  selector: 'app-genre-publisher-view',
  templateUrl: './genre-publisher-view.component.html',
  styleUrls: ['./genre-publisher-view.component.css']
})
export class GenrePublisherViewComponent implements OnInit {
  publisher: string;
  genre: string;
  games: Game[];
  radarData = {labels: [], data: []};

  constructor(public dataService: DataService,
              public router: Router,
              public route: ActivatedRoute,
              public navigationService: NavigationService) {
  }

  ngOnInit(): void {
    this.publisher = this.route.snapshot.params.publisherId;
    this.genre = this.navigationService.genre$.getValue();
    this.genre = 'Action';
    this.navigationService.updatePublisher(this.publisher);

    this.dataService.onReady$.subscribe(ready => {
      if (ready) {
        this.games = this.dataService.getGamesOfPublisherInGenre(this.publisher, this.genre);
        this.calculateRadar();

      }
    });
  }

  calculateRadar() {
    let labels = [...new Set(this.games.map(game => game.name))];

    for(let label in labels) {
      this.radarData.labels.push(label.substr(0, 8) + '...');
    }

    let userScorePerGame = {};

    for (let game of this.games) {
      if(!userScorePerGame[game.name]) {
        userScorePerGame[game.name] = []
      } else {
        if(game.userScore) {
          userScorePerGame[game.name].push(game.userScore)
        }
      }
    }

    for(let key of Object.keys(userScorePerGame)){
      let userScoresLength = userScorePerGame[key].length;
      let userScoreSum = userScorePerGame[key].reduce((a, b) => a + (+b), 0);
      this.radarData.data.push(Math.round(userScoreSum/userScoresLength));
    }

  }
}
