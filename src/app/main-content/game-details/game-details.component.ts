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
  public gamesOfThisPublisher: Game[];
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
    });

    this.router.events.subscribe((value) => {
      console.log("test ", value)
      this.loadDetailGame();
      this.loadGamesOfThisPublisher();
      this.loadGamesOfThisYear();
    });
  }

  loadGamesOfThisPublisher(){
      if(!this.gamesOfThisPublisher){
        let arr = this.dataService.gameDataSet.filter(item => item.genre === this.game.genre && item.name !== this.game.name);
        arr.sort((a,b) => {
          return b.globalSales - a.globalSales
        });
        arr = arr.slice(0,9);
        arr.push(this.game);
        arr.sort((a,b) => {
          return b.globalSales - a.globalSales
        });
        this.gamesOfThisPublisher = arr;
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
      const gameName = this.navigationService.decodeEncodedUrl(this.route.snapshot.params['gameName']);
      this.game = this.dataService.gameDataSet.filter(item => item.name === gameName)[0];
  }
}
  

