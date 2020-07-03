import { Component, OnInit, OnChanges,  Input, ViewChild, ElementRef } from '@angular/core';
import { Game } from 'src/models/Game';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/services/navigate.service';

@Component({
    selector: 'bar-graph',
    templateUrl: 'bargraph.component.html',
    styleUrls: ['./bargraph.component.css']
})
export class BarGraphComponent implements OnInit, OnChanges {
  constructor(private router:Router, private navigationService: NavigationService) { }
  
  @Input() public data: Game[];
  @Input() private game: Game;
  @Input() private prop: string; 

  public barChartOptions = {
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

  ngOnChanges(){
    this.initBarGraph();
  }

  initBarGraph(){
    this.barChartData = [];
    let colorArr = [];

    switch(this.prop){
      case 'sales':
        this.barChartLabels = this.data.map(x => x.name)
        let globalSalesArr = this.data.map(x => x.globalSales)
        let colorArr = [];

        this.data.forEach(game => {
          if(game === this.game){
            colorArr.push("rgba(247,70,74,0.2)")
          }else{
            colorArr.push("rgba(51, 102, 255, 0.3)")
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
        this.barChartLabels = this.data.map(x => x.name).slice(0,50)
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
      this.navigationService.updateGame(game);
      this.router.navigate([`/home/details`]);
    }
  }
}