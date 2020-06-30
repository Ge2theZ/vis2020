import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Game} from '../../models/Game';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  public gameCardHoverSubject$ = new BehaviorSubject<Game>(null); // Subscribe to this Subject to be notified on game card hovers

  constructor() { }

  onGameCardHover(game: Game) {
    this.gameCardHoverSubject$.next(game);
  }
}
