import {Game} from './Game';

export class CoverCarousel {
  constructor(from:number, to:number, game:Game){
    this.game = game;
    this.toYear = to;
    this.fromYear = from;
    
    // construct timespanString
    this.timespanString = Math.floor(from) + "-" + Math.floor(to);
  }

  timespanString: string;
  fromYear: number;
  toYear: number;
  game: Game;
}
