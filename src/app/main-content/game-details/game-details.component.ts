import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from 'src/models/Game';
import { DataService } from 'src/app/services/DataService';
import * as d3 from 'd3';
import { Console } from 'console';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
  public game: Game;
  public gamesOfThisPublisher: Game[];
  public chartData = [];

  constructor(private dataService:DataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.game = JSON.parse(params["game"]);
      this.dataService.onReady$.subscribe(()=>{
        this.gamesOfThisPublisher = this.dataService.gameDataSet.filter(item => item.publisher == this.game.publisher && item.plattform == this.game.plattform);
        this.gamesOfThisPublisher.sort((a,b) => {
          if(a.globalSales < b.globalSales) return -1
          if(a.globalSales > b.globalSales) return 1
          else return 0
        })
        console.log(this.gamesOfThisPublisher);
      })
    });
  }

  generateData() {
    this.chartData = [];
    for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
      this.chartData.push([
    `Index ${i}`,
    Math.floor(Math.random() * 100)
    ]);
   }
 }

}
