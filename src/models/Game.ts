export class Game {
  constructor(obj?:any){
    if(!obj) return
    this.name = obj.Name;
    this.plattform = obj.Platform;
    this.publisher = obj.Publisher;
    this.year = obj.Year;
    this.userScore = obj.User_Score;
    this.criticScore = obj.Critic_Score; 
    this.esrbRating = obj.ESRB_Rating;
    this.genre = obj.Genre;
    this.globalSales = obj.Global_Sales;
    this.marketShare = obj.Market_Share;
    this.imgUrl = obj.img_url;
    this.jpSales = obj.JP_Sales;
    this.naSales = obj.NA_Sales;
    this.otherSales = obj.Other_Sales;
    this.euSales = obj.EU_Sales;
  }

  name?: string;
  genre?: string;
  esrbRating?: string;
  plattform?: string;
  publisher?: string;
  criticScore?: any;
  userScore?: any;
  globalSales?: any;
  jpSales?: any;
  euSales?: any;
  naSales?: any;
  otherSales?: any;
  year?: number;
  imgUrl?: string;
  marketShare?: number;

  equals(game:Game){
    return (game.name == this.name && game.plattform == this.plattform)
  }
}

// Name,Genre,ESRB_Rating,Platform,Publisher,Developer,VGChartz_Score,Critic_Score,User_Score,Global_Sales,Year,img_url,Market_Share
