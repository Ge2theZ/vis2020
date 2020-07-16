import {Component, OnInit, OnChanges, Input, SimpleChanges} from '@angular/core';
import { Game } from 'src/models/Game';
import { Router } from '@angular/router';

@Component({
    selector: 'bar-graph',
    templateUrl: 'bargraph.component.html',
    styleUrls: ['./bargraph.component.css']
})
export class BarGraphComponent implements OnInit, OnChanges {
  constructor(private router:Router) { }

  @Input() public data: Game[];
  @Input() private game: Game;
  @Input() private prop: string;

  public barChartOptions = {
    tooltips:{
      custom: (tooltip) => {
        if (!tooltip) return;
        // disable displaying the color box;
        tooltip.displayColors = false;
      },
      callbacks: {
        label: (item) => {
          let multiLineArray = []
          multiLineArray.push("Platform: " + this.data[item.index].plattform)
          multiLineArray.push("Publisher: " + this.data[item.index].publisher)
          multiLineArray.push("Release Year: " + this.data[item.index].year)
          multiLineArray.push("Genre: " + this.data[item.index].genre)
          multiLineArray.push("Sales: " + this.data[item.index].globalSales + " Mio")
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
      }]
    }
  };
  public barChartType = 'bar';
  public barChartLegend = false;
  public barChartData;
  public barChartLabels;

  ngOnInit() {
   this.initBarGraph();
  }

  ngOnChanges(changes: SimpleChanges){
    this.initBarGraph();
  }

  initBarGraph(){
    this.barChartData = [];
    let colorArr = [];

    switch(this.prop){
      case 'thisYear':
        this.data.forEach(game => {
          if(game.equals(this.game)){
            colorArr.push("rgba(247,70,74,0.5)")
          }else{
            colorArr.push("rgba(0,164,255,0.5)")
          }
        });
        this.barChartLabels = this.data.map(x => x.name.length > 40 ? x.name.slice(0, 40)+'...': x.name);

        this.barChartData.push({
          data: this.data.map(x => x.globalSales),
          backgroundColor: colorArr,
          maxBarThickness: 40
        })
      break;
      case 'sales':
        this.barChartLabels = this.data.map(x => x.name.length > 40 ? x.name.slice(0, 40)+'...': x.name);
        let globalSalesArr = this.data.map(x => x.globalSales)

        this.data.forEach(game => {
          if(game.equals(this.game)){
            colorArr.push("rgba(247,70,74,0.5)")
          }else{
            colorArr.push("rgba(0,164,255,0.5)")
          }
        });

        this.barChartData.push({
          label: "Global",
          data: globalSalesArr,
          maxBarThickness: 40,
          backgroundColor: colorArr
        })
      break;
      case 'PublisherGenre-Sales':
        this.barChartLabels = this.data.map(x => x.name.length > 30 ? x.name.slice(0, 30)+'...': x.name).slice(0,50);
        var arr = this.data.map(x => x.globalSales);
        arr = arr.slice(0,50)
        this.barChartData.push({
          data: arr
        })
      break;
    }
  }

  onBarClick(event){
    if(event.active.length > 0){
      let idx = event.active[0]._index;
      let game = this.data[idx];
      this.router.navigate([`/home/details`, game.index]);

    }
  }
}
