export class Game {
  constructor(obj?:any){
    if(!obj) return
    this.name = obj.Name;
    this.plattform = obj.Platform;
    this.publisher = obj.Publisher;
    this.userScore = obj.User_Score;
    this.year = obj.Year;
    this.criticScore = obj.Critics_Score;
    this.esrbRating = obj.ESRB_Rating;
    this.genre = obj.Genre;
    this.globalSales = obj.Global_Sales;
    this.marketShare = obj.Market_Share;
    this.imgUrl = obj.img_url;
  }

  name?: string;
  genre?: string;
  esrbRating?: string;
  plattform?: string;
  publisher?: string;
  criticScore?: number;
  userScore?: number;
  globalSales?: number;
  year?: number;
  imgUrl?: string;
  marketShare?: number;
}

// Name,Genre,ESRB_Rating,Platform,Publisher,Developer,VGChartz_Score,Critic_Score,User_Score,Global_Sales,Year,img_url,Market_Share
