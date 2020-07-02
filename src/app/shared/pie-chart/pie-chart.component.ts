import { Component, OnInit, OnChanges,  Input, ViewChild, ElementRef } from '@angular/core';
import { Game } from 'src/models/Game';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/services/navigate.service';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @Input() public game: Game;

  public pieChartData;
  public pieChartLabels;
  public pieChartType = "pie";
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    }
  }

  constructor() { }

  ngOnInit(): void {
    this.pieChartData = [
      this.game.euSales,
      this.game.jpSales,
      this.game.naSales,
      this.game.otherSales
    ]
    this.pieChartLabels = ["EU Sales","JP Sales","NA Sales", "Other Sales"]
  }

}
