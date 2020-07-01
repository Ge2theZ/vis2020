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
      display: true
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Sales in Million'
        },
        stacked: true
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

  ngOnChanges(){
    this.initBarGraph();
  }
  
  initBarGraph(){
    this.barChartData = [];
    let colorArr = [];

    switch(this.prop){
      case 'sales':
        //this.data.forEach(game => {
        //  if(game.name === this.game.name)
        //    colorArr.push("red");
        //  else
        //    colorArr.push("rgba(21, 140, 186, 1)");
        //});
        this.barChartLabels = this.data.map(x => x.name)
        let euSalesArr = this.data.map(x => x.euSales);
        let naSalesArr = this.data.map(x => x.naSales);
        let jpSalesArr = this.data.map(x => x.jpSales);
        let otherSalesArr = this.data.map(x => x.otherSales);
        let globalSalesArr = this.data.map(x => x.globalSales)
        this.barChartData.push({
          label: "Global",
          data: globalSalesArr,
          maxBarThickness: 40,
          stack: 1,
          borderWidth: "2px"
        })
        this.barChartData.push({
          label: "EU",
          data: euSalesArr, 
          maxBarThickness: 40,
          stack: 2
        })
        this.barChartData.push({
          label: "NA",
          data: naSalesArr, 
          maxBarThickness: 40,
          stack: 2
        })
        this.barChartData.push({
          label: "JP",
          data: jpSalesArr, 
          maxBarThickness: 40, 
          stack: 2
        })
        this.barChartData.push({
          label: "Other",
          data: otherSalesArr, 
          maxBarThickness: 40, 
          stack: 2
        })
      break;
      case 'PublisherGenre-Sales':
        this.barChartOptions.legend.display = false;
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
