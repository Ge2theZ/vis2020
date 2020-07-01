import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Chart} from 'chart.js';
import {Game} from '../../../models/Game';

export enum RadarUseCase {
  crit_user_score,
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
  @ViewChild('canvas') radarChartCanvas: ElementRef;

  @Input() rawData: Game[];
  @Input() useCase: RadarUseCase;

  radarChart: Chart;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    switch (this.useCase) {
      case RadarUseCase.crit_user_score:
        console.log('crit_user_Score use case selected for radar chart');
        this.createUserCriticScoreRadar(SortOrder.highest, 10);
      default:
        console.error('No use case selected for radar score. Radar is not displayed');
    }
  }

  createUserCriticScoreRadar(sortOrder: SortOrder, amount: number) {
    let userScorePerGame = {};
    let criticScorePerGame = {};

    for (let game of this.rawData) {
      if (!userScorePerGame[game.name]) {
        userScorePerGame[game.name] = [];
      } else {
        if (game.userScore) {
          userScorePerGame[game.name].push(game.userScore);
        }
      }

      if (!criticScorePerGame[game.name]) {
        criticScorePerGame[game.name] = [];
      } else {
        if (game.criticScore) {
          criticScorePerGame[game.name].push(game.criticScore);
        }
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

    console.log(avgAvailableScores);

    let sortableAvgAvailableScores = [];

    for (let game of Object.keys(avgAvailableScores)) {
      sortableAvgAvailableScores.push([game, avgAvailableScores[game].avgTotalScore, avgAvailableScores[game].userScore, avgAvailableScores[game].criticScore]);
    }


    const sortedByLowestAvailScores = [...sortableAvgAvailableScores.sort(function(a, b) {
      return a[1] - b[1];
    })];

    console.log('Sorted avgAvailableScores', sortedByLowestAvailScores);

    let sortedSlicedScores = [];
    if (sortOrder === SortOrder.highest) {
      sortedSlicedScores = sortedByLowestAvailScores.reverse().slice(0, amount);
    } else {
      sortedSlicedScores = sortedByLowestAvailScores.slice(0, amount);
    }
    console.log('Sorted highest sliced scores', sortedSlicedScores);

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
          backgroundColor: "rgba(0,164,255,0.5)"
        },
        {
          label: 'Cirtic Scores',
          data: criticScore,
          backgroundColor: "rgba(17,255,0,0.5)"
        },

      ]
    };

    // configure radar options
    let radarOptions = {
      scale: {
        angleLines: {
          display: false
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 10
        }
      }
    };

    this.radarChart = new Chart('canvas', {
      type: 'radar',
      data: radarData,
      options: radarOptions,
    });
  }

  covertToDatasets(data) {
    let datasets = [];
    for (let dataset of data) {
      datasets.push({data: dataset});
    }
    return datasets;
  }
}
