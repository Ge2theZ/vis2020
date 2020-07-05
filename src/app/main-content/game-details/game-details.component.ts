import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from 'src/models/Game';
import { DataService } from 'src/app/services/DataService';
import {NavigationService} from '../../services/navigate.service';
import {RadarUseCase} from 'src/app/shared/radar-chart/radar-chart.component';
import {PieUseCase} from '../../shared/pie-chart/pie-chart.component';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
  public PieUseCase = PieUseCase;
  public game: Game;
  public mostGamesOfThisPublisher: Game[];
  public leastGamesOfThisPublisher: Game[];
  public mostGenreGamesInThisYear: Game[];
  public radarUseCase: RadarUseCase;
  public gamesInThisYear: Game[];

  constructor(private dataService:DataService, 
              private route: ActivatedRoute, 
              private navigationService: NavigationService,
              private router: Router) { 
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }
  }

  ngOnInit(): void {
    this.radarUseCase = RadarUseCase.crit_user_score_details;

    this.dataService.onReady$.subscribe((state)=>{
      if(!state) return;
      this.loadDetailGame();
      this.loadGamesOfThisPublisher();
      this.loadGamesOfThisYear();
      this.loadMostGenreGamesInThisYear();
    });

    this.router.events.subscribe((value) => {
      this.loadDetailGame();
      this.loadGamesOfThisPublisher();
      this.loadGamesOfThisYear();
      this.loadMostGenreGamesInThisYear();
    });
  }

  loadMostGenreGamesInThisYear(){
    if(!this.mostGenreGamesInThisYear){
      let arr = this.dataService.gameDataSet.filter(item => item.genre === this.game.genre && 
        item.name !== this.game.name && 
        this.game.year === item.year);
      arr.sort((a,b) => {
        return b.globalSales - a.globalSales
      });
      arr = arr.slice(0,9);
      arr.push(this.game);
      arr.sort((a,b) => {
        return b.globalSales - a.globalSales
      });
      this.mostGenreGamesInThisYear = arr;
    }
  }

  loadGamesOfThisPublisher(){
      if(!this.mostGamesOfThisPublisher){
        let arr = this.dataService.gameDataSet.filter(item => item.genre === this.game.genre && item.name !== this.game.name);
        arr.sort((a,b) => {
          return b.globalSales - a.globalSales
        });
        arr = arr.slice(0,9);
        arr.push(this.game);
        arr.sort((a,b) => {
          return b.globalSales - a.globalSales
        });
        this.mostGamesOfThisPublisher = arr;
      }
      if(!this.leastGamesOfThisPublisher){
        let arr = this.dataService.gameDataSet.filter(item => item.genre === this.game.genre && item.name !== this.game.name && (item.userScore || item.criticScore));
        arr.sort((a,b) => {
          return a.globalSales - b.globalSales
        });
        arr = arr.slice(0,9);
        arr.push(this.game);
        arr.sort((a,b) => {
          return a.globalSales - b.globalSales
        });
        this.leastGamesOfThisPublisher = arr;
      }
  }

  loadGamesOfThisYear(){
    if(!this.gamesInThisYear){
      let arr = this.dataService.gameDataSet.filter(item => item.year === this.game.year);
      arr.sort((a,b) => { return (b.globalSales - a.globalSales) });
      arr = arr.slice(0,10);
      if(!arr.includes(this.game))
        arr[9] = this.game;
      arr.sort((a,b) => { return (b.globalSales - a.globalSales) });
      this.gamesInThisYear = arr;
    }   
  }

  loadDetailGame(){
    let gameId = this.route.snapshot.params["gameId"];
    this.game = this.dataService.gameDataSet.filter(item => item.index === Number(gameId))[0];
  }
}
  

