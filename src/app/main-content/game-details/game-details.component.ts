import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from 'src/models/Game';
import {NavigationService} from '../../services/navigate.service';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
  public game: Game;

  constructor(private route: ActivatedRoute,
              private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.navigationService.game$.subscribe(value => {
      this.game = value;
    });
    /*
    this.route.queryParams.subscribe(params => {
      this.game = JSON.parse(params["game"]);
    });

     */
  }
}
