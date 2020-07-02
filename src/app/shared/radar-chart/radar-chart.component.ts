import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Chart, ChartElementsOptions} from 'chart.js';
import {Game} from '../../../models/Game';
import { NavigationService } from 'src/app/services/navigate.service';
import { Router } from '@angular/router';

export enum RadarUseCase {
  crit_user_score_highest,
  crit_user_score_lowest,
  crit_user_score_details
}

enum SortOrder {
  highest,
  lowest
}

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css']
})
export class RadarChartComponent implements OnInit, AfterViewInit {
  @Input() rawData: Game[];
  @Input() useCase: RadarUseCase;

  radarChart: Chart;
  randomId: string;

  constructor(private navigationService: NavigationService, private router: Router) {}

  ngOnInit(): void {
    this.randomId = Math.abs(Math.random()).toString();
  }

  ngAfterViewInit(): void {
    switch (this.useCase) {
      case RadarUseCase.crit_user_score_highest:
        console.log('crit_user_Score use case selected for radar chart');
        this.createUserCriticScoreRadar(SortOrder.highest, 10);
        break;
      case RadarUseCase.crit_user_score_lowest:
        console.log('crit_user_Score use case selected for radar chart');
        this.createUserCriticScoreRadar(SortOrder.lowest, 10);
        break;
      case RadarUseCase.crit_user_score_details:
        this.initDetailRadarChart();
        break;
      default:
        console.error('No use case selected for radar score. Radar is not displayed');
    }
  }

  public onClick(evt){
    let point = [<any>{}];
    point = this.radarChart.getElementAtEvent(evt);
    if(this.useCase === RadarUseCase.crit_user_score_details) {
      if(point.length > 0){
        let idx = point[0]._index;
        let game = this.rawData[idx];
        this.navigationService.updateGame(game);
        this.router.navigate([`/home/details`]);
      }
    }
  }

  public initDetailRadarChart(){
    let labelArr = this.rawData.map(x => x.name);
    let userScoreArr = this.rawData.map(x => x.userScore);
    let criticScoreArr = this.rawData.map(x => x.criticScore);

    let radarData = {
      labels: labelArr,
      datasets: [
        {
          label: 'Critic Score',
          data: criticScoreArr,
          borderColor: "rgba(17,255,0,0.5)"
        },
        {
          label: 'User Score',
          data: userScoreArr,
          borderColor: "rgba(0,164,255,0.5)"
        }
      ]
    }

    this.radarChart = new Chart(this.randomId, {
      type: 'radar',
      data: radarData,
      options: { spanGaps: true }
    });
  }

  public createUserCriticScoreRadar(sortOrder: SortOrder, amount: number) {
    let userScorePerGame = {};
    let criticScorePerGame = {};

    for (let game of this.rawData) {
      if (!userScorePerGame[game.name]) {
        userScorePerGame[game.name] = [];
      }
      if (game.userScore) {
        userScorePerGame[game.name].push(game.userScore);
      }
      if (!criticScorePerGame[game.name]) {
        criticScorePerGame[game.name] = [];
      }
      if (game.criticScore) {
        criticScorePerGame[game.name].push(game.criticScore);
      }
    }

    let scoreKeys = Object.keys(userScorePerGame);
    let avgAvailableScores = {};

    for (let key of scoreKeys) {
      if (userScorePerGame[key].length > 0 && criticScorePerGame[key].length) {
        const userScores = userScorePerGame[key].map(Number);
        const criticScores = criticScorePerGame[key].map(Number);

        const sumUserScores = userScores.reduce((a, b) => a + b, 0);
        const avgUserScores = (sumUserScores / userScores.length) || 0;

        const sumCriticScores = criticScores.reduce((a, b) => a + b, 0);
        const avgCriticScores = (sumCriticScores / criticScores.length) || 0;

        avgAvailableScores[key] = {
          userScore: avgUserScores,
          criticScore: avgCriticScores,
          avgTotalScore: (avgUserScores + avgCriticScores) / 2
        };
      }
    }

    let sortableAvgAvailableScores = [];
    for (let game of Object.keys(avgAvailableScores)) {
      sortableAvgAvailableScores.push([game, avgAvailableScores[game].avgTotalScore, avgAvailableScores[game].userScore, avgAvailableScores[game].criticScore]);
    }

    const sortedByLowestAvailScores = [...sortableAvgAvailableScores.sort(function(a, b) {
      return a[1] - b[1];
    })];

    let sortedSlicedScores = [];
    if (sortOrder === SortOrder.highest) {
      sortedSlicedScores = sortedByLowestAvailScores.reverse().slice(0, amount);
    } else {
      sortedSlicedScores = sortedByLowestAvailScores.slice(0, amount);
    }

    let labels = sortedSlicedScores.map(scoreArr => scoreArr[0]);
    let userScoreData = sortedSlicedScores.map(scoreArr => scoreArr[2]);
    let criticScore = sortedSlicedScores.map(scoreArr => scoreArr[3]);

    // configure radar data
    let radarData = {
      labels: labels,
      datasets: [
        {
          label: 'User Scores',
          data: userScoreData,
          backgroundColor: "rgba(0,164,255,0.1)",
          borderColor: "rgba(0,164,255,0.5)"
        },
        {
          label: 'Cirtic Scores',
          data: criticScore,
          backgroundColor: "rgba(17,255,0,0.1)",
          borderColor: "rgba(17,255,0,0.5)"
        },

      ]
    };

    // configure radar options
    let radarOptions = {
      scale: {
        angleLines: {
          display: false
        }
      }
    };

    console.log("random id", this.randomId);
    this.radarChart = new Chart(this.randomId, {
      type: 'radar',
      data: radarData,
      options: radarOptions,
    });
  }
}
