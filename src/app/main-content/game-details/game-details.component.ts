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
      this.game = undefined;
      this.loadDetailGame();
      this.loadGamesOfThisPublisher();
      this.loadGamesOfThisYear();
      this.loadMostGenreGamesInThisYear();
    });
  }

  loadMostGenreGamesInThisYear(){
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

  loadGamesOfThisPublisher() {
    let mostArr = this.dataService.gameDataSet.filter(item => item.genre === this.game.genre && item.name !== this.game.name);
    mostArr.sort((a, b) => {
      return b.globalSales - a.globalSales;
    });
    mostArr = mostArr.slice(0, 9);
    mostArr.push(this.game);
    mostArr.sort((a, b) => {
      return b.globalSales - a.globalSales;
    });
    this.mostGamesOfThisPublisher = mostArr;

    let leastArr = this.dataService.gameDataSet.filter(item => item.genre === this.game.genre && item.name !== this.game.name && (item.userScore || item.criticScore));
    leastArr.sort((a, b) => {
      return a.globalSales - b.globalSales;
    });
    leastArr = leastArr.slice(0, 9);
    leastArr.push(this.game);
    leastArr.sort((a, b) => {
      return a.globalSales - b.globalSales;
    });
    this.leastGamesOfThisPublisher = leastArr;

  }

  loadGamesOfThisYear(){
    let arr = this.dataService.gameDataSet.filter(item => item.year === this.game.year);
    arr.sort((a,b) => { return (b.globalSales - a.globalSales) });
    arr = arr.slice(0,10);
    if(!arr.includes(this.game))
      arr[9] = this.game;
    arr.sort((a,b) => { return (b.globalSales - a.globalSales) });
    this.gamesInThisYear = arr;
  }

  loadDetailGame(){
    let gameId = this.route.snapshot.params["gameId"];
    this.game = this.dataService.gameDataSet.filter(item => item.index === Number(gameId))[0];
  }
}
  

