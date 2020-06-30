import {Injectable} from '@angular/core';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import {Game} from '../../models/Game';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public genre$ = new BehaviorSubject<string>(null);
  public publisher$ = new BehaviorSubject<string>(null);
  public game$ = new ReplaySubject<Game>(null);

  constructor() {
  }


  public updateGenre(genre: string) {
    this.genre$.next(genre);
  }

  public updatePublisher(publisher: string) {
    this.publisher$.next(publisher);
  }

  public updateGame(game: Game) {
    this.game$.next(game);
  }
}
