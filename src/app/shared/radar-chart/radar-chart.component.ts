import {AfterViewInit, Component, Input, OnInit, OnChanges} from '@angular/core';
import {Chart} from 'chart.js';
import {Game} from '../../../models/Game';
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
export class RadarChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() rawData: Game[];
  @Input() highlight: Game;
  @Input() useCase: RadarUseCase;

  radarChart: Chart;
  randomId: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.randomId = Math.abs(Math.random()).toString();
  }

  ngOnChanges(){
    if(this.randomId) {
      this.ngAfterViewInit();
    }
  }

  ngAfterViewInit(): void {
    switch (this.useCase) {
      case RadarUseCase.crit_user_score_highest:
        this.createUserCriticScoreRadar(SortOrder.highest, 10);
        break;
      case RadarUseCase.crit_user_score_lowest:
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
    var point: any = this.radarChart.getElementAtEvent(evt);
    if(point.length > 0 && this.useCase === RadarUseCase.crit_user_score_details){
      let idx = point[0]._index;
      let game = this.rawData[idx];
      this.router.navigate([`/home/details`, game.index]);
    }
  }

  public initDetailRadarChart(){
    let labelArr = this.rawData.map(x => x.name);
    let userScoreArr = this.rawData.map(x => x.userScore);
    let criticScoreArr = this.rawData.map(x => x.criticScore);

    let labelColorArr = [];
    this.rawData.forEach(game => {
      if(game === this.highlight){
        labelColorArr.push("black")
      }else{
        labelColorArr.push("gray")
      }
    });

    let criticColorArr = [];
    this.rawData.forEach(game => {
      if(game === this.highlight){
        criticColorArr.push("red")
      }else{
        criticColorArr.push("rgba(17,255,0,1)")
      }
    });

    let userColorArr = [];
    this.rawData.forEach(game => {
      if(game === this.highlight){
        userColorArr.push("red")
      }else{
        userColorArr.push("rgba(0,164,255,1)")
      }
    });


    let radarData = {
      labels: labelArr,
      datasets: [
        {
          label: 'Critic Score',
          data: criticScoreArr,
          backgroundColor: "rgba(17,255,0,0.1)",
          borderColor: "rgba(17,255,0,0.5)",
          pointBackgroundColor: criticColorArr
        },
        {
          label: 'User Score',
          data: userScoreArr,
          backgroundColor: "rgba(0,164,255,0.1)",
          borderColor: "rgba(0,164,255,0.5)",
          pointBackgroundColor: userColorArr,
        }
      ]
    }
    if(this.radarChart) this.radarChart.destroy();
    this.radarChart = new Chart(this.randomId, {
      type: 'radar',
      data: radarData,
      options: {
        tooltips:{
          custom: (tooltip) => {
            if (!tooltip) return;
            // disable displaying the color box;
            tooltip.displayColors = false;
          },
          callbacks: {
            title: (item) => { 
              if(item[0].datasetIndex == 0){
                return "Critic Score: " + this.rawData[item[0].index].criticScore;
              }else{
                return "User Score: " + this.rawData[item[0].index].userScore;
              }
            },
            label: (item) => {
              let multiLineArray = []
              multiLineArray.push("Platform: " + this.rawData[item.index].plattform)
              multiLineArray.push("Publisher: " + this.rawData[item.index].publisher)
              multiLineArray.push("Release Year: " + this.rawData[item.index].year)
              multiLineArray.push("Genre: " + this.rawData[item.index].genre)
              multiLineArray.push("Sales: " + this.rawData[item.index].globalSales + " Mio")
              return multiLineArray;
            }
          }
        },
        spanGaps: true,
        scale: {
          pointLabels:{
            fontColor: labelColorArr
          },
        }
      }
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

    this.radarChart = new Chart(this.randomId, {
      type: 'radar',
      data: radarData,
      options: radarOptions
    });
  }
}
