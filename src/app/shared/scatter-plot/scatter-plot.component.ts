import {Component, OnInit, OnChanges, Input, SimpleChanges} from '@angular/core';
import { Game } from 'src/models/Game';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent implements OnInit, OnChanges {
  constructor(private router:Router) { }

  @Input() public rawData: Game[];
  @Input() private game: Game;
  @Input() private useCase: string;

  public scatterOptions = {
    tooltips:{
      custom: (tooltip) => {
        if (!tooltip) return;
        // disable displaying the color box;
        tooltip.displayColors = false;
      },
      callbacks: {
        label: (item) => {
          let multiLineArray = []
          multiLineArray.push("Game: " + this.rawData[item.index].name)
          multiLineArray.push("Platform: " + this.rawData[item.index].plattform)
          multiLineArray.push("Publisher: " + this.rawData[item.index].publisher)
          multiLineArray.push("Release Year: " + this.rawData[item.index].year)
          multiLineArray.push("Genre: " + this.rawData[item.index].genre)
          multiLineArray.push("Sales: " + this.rawData[item.index].globalSales + " Mio")
          return multiLineArray;
        }
      }
    },
    maintainAspectRatio: true,
    scaleShowVerticalLines: true,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Sales in Million'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Score'
        }
      }]
    }

  };
  public scatterType = 'scatter';
  public scatterLegend = false;
  public scatterData;
  public scatterLabels;

  ngOnInit() {
    this.initScatterPlot();
   }
 
   ngOnChanges(changes: SimpleChanges){
     this.initScatterPlot();
   }
 
  initScatterPlot(){
    console.log("SCATTER");
    console.log(this.game);
    console.log(this.rawData);

    let colorArr = [];
    let radiusArr = [];

    this.rawData.forEach(game => {
      if(game.name == this.game.name){
        colorArr.push("rgba(247,70,74,0.5)")
        radiusArr.push(8);
        console.log("EQUAL")
      }else{
        colorArr.push("rgba(0,164,255,0.5)")
        radiusArr.push(3);
      }
    });
    console.log(colorArr)
    let data = [];

    if (this.useCase == "critics") {
      data = this.rawData.map((i) => {
        return {x: i.criticScore, y: i.globalSales};
      });
    } else if (this.useCase == "users") {
      data = this.rawData.map((i) => {
        return {x: i.userScore, y: i.globalSales};
      });
    }

    this.scatterData = [{
      label: 'Scatter Dataset',
      data: data,
      pointBackgroundColor: colorArr,
      pointBorderColor: colorArr,
      pointHoverBorderColor: colorArr,
      pointHoverBackgroundColor: colorArr,
      pointRadius: radiusArr,
      pointHoverRadius: 12
      }]
   }

   onScatteredClick(event) {

   }

}
