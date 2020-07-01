import {Injectable} from '@angular/core';
import {Game} from '../../models/Game';
import {GenreSalesPerYear} from '../../models/GenreSalesPerYear';
import {HttpClient} from '@angular/common/http';
import * as Rx from 'rxjs';
import {CoverCarousel} from 'src/models/CoverCarousel';
import {SharePerYearPerPublisher} from 'src/models/SharePerYearPerPublisher';


interface MarketShareForGenrePerYearStore {
  genre: string;
  data: SharePerYearPerPublisher[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public gameDataSet: Game[] = [];
  public genreSalesPerYears: GenreSalesPerYear[];
  public marketShareForGenrePerYearStore: MarketShareForGenrePerYearStore[] = [];
  public liveCarousel$: Rx.BehaviorSubject<CoverCarousel[]>;
  public onReady$: Rx.BehaviorSubject<Boolean>;

  constructor(private http: HttpClient) {
    this.liveCarousel$ = new Rx.BehaviorSubject<CoverCarousel[]>([]);
    this.onReady$ = new Rx.BehaviorSubject<Boolean>(false);
    this.readInGameDataSet().subscribe(data => {
      for (const game of data) {
        this.gameDataSet.push(new Game(game));
      }
      this.readInGenreSalesPerYears().subscribe(data => {
        this.genreSalesPerYears = data;
        //console.log("GenreSales per Year: ", this.genreSalesPerYears)
        this.onReady$.next(true);
      });
    });
  }

  readInGameDataSet(): Rx.Observable<any> {
    return this.http.get('../../assets/preprocessed_dataset.json');
  }

  readInGenreSalesPerYears(): Rx.Observable<any> {
    return this.http.get('../../assets/SalesPerYearGenre.json');
  }

  updateCoverCarousel(genre: string, publisher: string, fromYear: number, toYear: number, cardAmount: number) {
    console.time('updateCoverCarousel');
    let timeInterval = toYear - fromYear;
    let timeBin = timeInterval / cardAmount;
    let carouselList = [];

    for (let i = 0; i < cardAmount; i++) {
      let from = fromYear + (timeBin * i) + (i == 0 ? 0 : 1);
      let to = fromYear + (timeBin * (i + 1));

      var game;

      if (genre && publisher) {
        game = this.getCoverCarouselDataWithPublisher(from, to, genre, publisher,);
      } else {
        game = this.getCoverCarouselData(from, to, genre);
      }

      carouselList.push(new CoverCarousel(from, to, game));
    }
    this.liveCarousel$.next(carouselList);
    console.timeEnd('updateCoverCarousel');
  }

  getStaticCarouselData(genre: String, fromYear: number, toYear: number, cardAmount: number) {
    console.time('getStaticCarouselData');
    let timeInterval = toYear - fromYear;
    let timeBin = timeInterval / cardAmount;
    let carouselList = [];

    for (let i = 0; i < cardAmount; i++) {
      let from = fromYear + (timeBin * i) + (i == 0 ? 0 : 1);
      let to = fromYear + (timeBin * (i + 1));
      var game = this.getCoverCarouselData(from, to, genre);
      carouselList.push(new CoverCarousel(from, to, game));
    }
    console.timeEnd('getStaticCarouselData');
    return carouselList;
  }

  getStaticCarouselDataForPublisher(genre: string, publisher: string, fromYear: number, toYear: number, cardAmount: number) {
    let timeInterval = toYear - fromYear;
    let timeBin = timeInterval / cardAmount;
    let carouselList = [];

    for (let i = 0; i < cardAmount; i++) {
      let from = fromYear + (timeBin * i) + (i == 0 ? 0 : 1);
      let to = fromYear + (timeBin * (i + 1));
      var game = this.getCoverCarouselDataWithPublisher(from, to, genre, publisher);

      if (game !== undefined) {
        carouselList.push(new CoverCarousel(from, to, game));
      }
    }
    return carouselList;
  }

  getGenres(): string[] {
    let genres: string[] = [];
    this.gameDataSet.forEach(value => {
      if (!genres.includes(value.genre)) {
        genres.push(value.genre);
      }
    });
    return genres;
  }

  getPublisher(): string[] {
    let publisher: string[] = [];
    this.gameDataSet.forEach(value => {
      if (!publisher.includes(value.publisher)) {
        publisher.push(value.publisher);
      }
    });
    return publisher;
  }

  getCoverCarouselData(fromTime: number, toTime: number, genre: String): Game {
    var filteredGameData;
    //filter for given Genre
    if (genre !== 'all') {
      filteredGameData = this.gameDataSet.filter(game => game.genre === genre);
    } else {
      filteredGameData = this.gameDataSet;
    }
    // sort gameDataSet by globalSales
    filteredGameData.sort((a, b) => {
      //a is less than b by some ordering criterion
      if (a.globalSales < b.globalSales) {
        return 1;
      }
      //a is greater than b by the ordering criterion
      if (a.globalSales > b.globalSales) {
        return -1;
      }
      return 0;
    });
    for (const game of filteredGameData) {
      //if game is between time range
      if (game.year >= fromTime && game.year <= toTime) {
        return game;
      }
    }
  }

  getCoverCarouselDataWithPublisher(fromTime: number, toTime: number, genre: String, publisher: String): Game {
    //filter for given Genre
    var filteredGameData = this.gameDataSet.filter(game => game.genre === genre && genre !== 'all');
    filteredGameData = filteredGameData.filter(game => game.publisher === publisher && publisher !== 'all');
    // sort gameDataSet by globalSales
    filteredGameData.sort((a, b) => {
      //a is less than b by some ordering criterion
      if (a.globalSales < b.globalSales) {
        return 1;
      }
      //a is greater than b by the ordering criterion
      if (a.globalSales > b.globalSales) {
        return -1;
      }
      return 0;
    });
    for (const game of filteredGameData) {
      //if game is between time range
      if (game.year >= fromTime && game.year <= toTime) {
        return game;
      }
    }
  }

  getMarketShareForGenrePerYear(genre: string): SharePerYearPerPublisher[] {
    console.time('getMarketShareForGenrePerYear');
    let filtered = this.gameDataSet.filter((game) => game.genre === genre);
    var res = [];
    var totalSalesPerYear = {};

    let uniqueYears = [...new Set(filtered.map(game => game.year))];
    let uniquePublisher = [...new Set(filtered.map(game => game.publisher))];

    for (const year of uniqueYears) {
      let filteredByYear = filtered.filter((game) => game.year === year);
      totalSalesPerYear[year] = filteredByYear.reduce((a, b) => {
        return a + b.globalSales;
      }, 0);
    }

    for (const year of uniqueYears) {
      for (const publisher of uniquePublisher) {
        let filteredByYearAndPublisher = filtered.filter((game) => game.year === year && game.publisher === publisher);
        let sumSalesPublisherYear = filteredByYearAndPublisher.reduce((a, b) => {
          return a + b.globalSales;
        }, 0);
        res.push(new SharePerYearPerPublisher(year, (sumSalesPublisherYear / totalSalesPerYear[year]) * 100, publisher));
      }
    }

    // Store calculated data into store
    if (this.marketShareForGenrePerYearStore.filter(data => data.genre === genre).length === 0) {
      this.marketShareForGenrePerYearStore.push({genre: genre, data: res});
    }

    console.timeEnd('getMarketShareForGenrePerYear');
    return res;
  }

  getGamesOfPublisherInGenre(publisher: string, genre: string) {
    let filteredByGenre = this.gameDataSet.filter((game) => game.genre === genre);
    let filteredByGenreAndPublisher = filteredByGenre.filter((game) => game.publisher === publisher);

    return filteredByGenreAndPublisher;
  }

  isMarketShareForGenrePerYearCached(genre: string): boolean {
    return this.marketShareForGenrePerYearStore.filter(data => data.genre === genre).length > 0;
  }

  getCachedMarketShareForGenrePerYear(genre: string) {
    return this.marketShareForGenrePerYearStore.filter(data => data.genre === genre);
  }
}
