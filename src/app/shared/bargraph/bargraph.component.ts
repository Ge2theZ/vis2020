import { Component, OnInit, OnChanges,  Input, ViewChild, ElementRef } from '@angular/core';
import { Game } from 'src/models/Game';
import { Router, NavigationExtras } from '@angular/router';
declare var Chart: any;



@Component({
    selector: 'bar-graph',
    templateUrl: 'bargraph.component.html',
    styleUrls: ['./bargraph.component.css']
})
export class BarGraphComponent implements OnInit {
  constructor(private router:Router) { }
  
  @Input() public data: Game[];
  @Input() private game: Game;
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      display: false,
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Sales in Million'
        }
      }]
    }
  };
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData;
  public barChartLabels;

  ngOnInit() {
   this.initBarGraph();
  }

  initBarGraph(){
    let salesArr = []; 
    let colorArr = [];
    this.barChartLabels = [];
    this.data.forEach(game => {
      this.barChartLabels.push(game.name)
      salesArr.push(game.globalSales)
      if(game.name === this.game.name){
        colorArr.push("#FF851B")
      }else{
        colorArr.push("#158CBA")
      }
    });
    this.barChartData = [];
    this.barChartData.push({
      data: salesArr, 
      maxBarThickness: 30, 
      backgroundColor: colorArr, 
      hoverBackgroundColor: colorArr,
      borderColor: "#000000"
    })
  }

  onBarClick(event){
    if(event.active.length > 0){
      let idx = event.active[0]._index;
      let navigationExtras: NavigationExtras = {
        queryParams: {
            game: JSON.stringify(this.data[idx])
        }
      } 
      this.router.navigate(["/home/details"], navigationExtras);
    }
  }
}
