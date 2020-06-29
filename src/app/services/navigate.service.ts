import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public mainViewDepth$ = new BehaviorSubject<number>(1);
  public genre$ = new BehaviorSubject<string>(null);
  public publisher$ = new BehaviorSubject<string>(null);

  constructor() {
  }


  public updateGenre(genre: string) {
    this.genre$.next(genre);
  }

  public updatePublisher(publisher: string) {
    this.publisher$.next(publisher);
  }

  public updateMainViewDepth(depth: number) {
    this.mainViewDepth$.next(depth);
  }

}
