import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from 'src/models/Game';
import { DataService } from 'src/app/services/DataService';
import {NavigationService} from '../../services/navigate.service';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
  public game: Game;
  public gamesOfThisPublisher: Game[];

  constructor(private dataService:DataService, 
              private route: ActivatedRoute, 
              private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.navigationService.game$.subscribe(value => {
      this.game = value;
      this.dataService.onReady$.subscribe((state)=>{
        if(!state) return;
        let arr = this.dataService.gameDataSet.filter(item => item.genre === this.game.genre && item.name !== this.game.name);
        arr.sort((a,b) => {
          if(a.globalSales > b.globalSales) return -1
          if(a.globalSales < b.globalSales) return 1
          else return 0
        });
        arr = arr.slice(0,9);
        arr.push(this.game);
        arr.sort((a,b) => {
          if(a.globalSales > b.globalSales) return -1
          if(a.globalSales < b.globalSales) return 1
          else return 0
        });
        this.gamesOfThisPublisher = arr;
    });
    })
  }
}
