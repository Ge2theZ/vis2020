import {Injectable} from '@angular/core';
import {Game} from '../../models/Game';
import {GenreSalesPerYear} from '../../models/GenreSalesPerYear';
import {HttpClient} from '@angular/common/http';
import * as Rx from 'rxjs';
import {CoverCarousel} from 'src/models/CoverCarousel';
import {SharePerYearPerPublisher} from 'src/models/SharePerYearPerPublisher';
import {observable, Observable} from 'rxjs';
import {element} from 'protractor';


interface MarketShareForGenrePerYearStore {
  genre: string;
  data: SharePerYearPerPublisher[];
}

interface CoverCarouselStore {
  genre: string,
  publisher: string,
  fromYear: number,
  toYear: number,
  cardAmmout: number,
  data: CoverCarousel[]
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public gameDataSet: Game[] = [];
  public genreSalesPerYears: GenreSalesPerYear[];
  public marketShareForGenrePerYearStore: MarketShareForGenrePerYearStore[] = [];
  public coverCarouselStore: CoverCarouselStore[] = [];
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
    return this.http.get('./assets/preprocessed_dataset.json');
  }

  readInGenreSalesPerYears(): Rx.Observable<any> {
    return this.http.get('./assets/SalesPerYearGenre.json');
  }

  updateCoverCarousel(genre: string, publisher: string, fromYear: number, toYear: number, cardAmount: number) {
    console.time('updateCoverCarousel');
    this.getCoverCarousel(genre, publisher, fromYear, toYear, cardAmount).then(carouselList => {
      this.liveCarousel$.next(carouselList);
      console.timeEnd('updateCoverCarousel');
    });
  }

  getCoverCarousel(genre: string, publisher: string, fromYear: number, toYear: number, cardAmount: number): Promise<CoverCarousel[]> {
    return new Promise<CoverCarousel[]>((resolve, reject) => {
      try {
        // Check if result was already cached
        const cachedResult: CoverCarouselStore = this.coverCarouselStore.filter((cachedResult: CoverCarouselStore) =>
          cachedResult.genre === genre &&
          cachedResult.publisher === publisher &&
          cachedResult.fromYear === fromYear &&
          cachedResult.toYear === toYear &&
          cachedResult.cardAmmout === cardAmount)[0];

        if(cachedResult) {
          resolve(cachedResult.data);
        } else {
          let timeInterval = toYear - fromYear;
          let timeBin = timeInterval / cardAmount;
          let carouselList = [];

          let carouselNonEmptyCardAmount = 0;
          for (let i = 0; i < cardAmount; i++) {
            let from = fromYear + (timeBin * i) + (i == 0 ? 0 : 1);
            let to = fromYear + (timeBin * (i + 1));

            var game;

            if (genre && publisher) {
              game = this.getCoverCarouselDataWithPublisher(from, to, genre, publisher,);
            } else {
              game = this.getCoverCarouselData(from, to, genre);
            }

            if (game !== undefined) {
              carouselNonEmptyCardAmount++;
              carouselList.push(new CoverCarousel(from, to, game));
            } else {
              const placeholderGameCarousel = new CoverCarousel(from, to, new Game({
                  Name: "No Game",
                  Publisher:"-",
              }))
              carouselList.push(placeholderGameCarousel);
            }
          }

          if(carouselNonEmptyCardAmount === 0) {
            carouselList = [];
          } else {
            // Save data to store
            this.coverCarouselStore.push(
              {
                genre: genre,
                publisher: publisher,
                fromYear: fromYear,
                toYear: toYear,
                cardAmmout: cardAmount,
                data: carouselList

              }
            );
          }
          resolve(carouselList);
        }
      } catch (e) {
        reject(e);
      }
    })

  }

  getGenres(): string[] {
    let uniqueGenres = [...new Set(this.gameDataSet.map(game => game.genre))]
    return uniqueGenres;
  }

  getPublishersForGenre(genre: string): string[] {
    const filteredList = this.gameDataSet.filter(game => game.genre === genre);
    const uniquePublishers =  [...new Set(filteredList.map(game => game.publisher))];
    return uniquePublishers;
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

  getClusteredMarketShareForGenrePerYear(genre, chunkSize = 20){
    let arr = this.getMarketShareForGenrePerYear(genre)
    let uniquePublisher = [...new Set(arr.map(elem => elem.publisher))];
    
    let publisherClusteredData = [];
    for (const publisher of uniquePublisher) {
      publisherClusteredData.push({
        publisher: publisher, 
        data: arr.filter((element) => element.publisher === publisher)
      });
    }

    let totalPublisherShare = [];
    for (const cluster of publisherClusteredData) {
      let sum = cluster.data.reduce((a,b) => a + b.share ,0)
      totalPublisherShare.push({publisher:cluster.publisher, totalShare:sum});
    }

    //NOTE: This could also be interesting to visualize?
    totalPublisherShare.sort((a, b) => {
      return (b.totalShare - a.totalShare);
    })

    console.log(totalPublisherShare.length)
        
    let res = []
    let dynChunkSize = chunkSize;
    for (let i = 0; i < totalPublisherShare.length; i+=chunkSize) {
      if(i+chunkSize > totalPublisherShare.length){
        dynChunkSize = totalPublisherShare.length % chunkSize;
      }
      let data = [];
      for (let j = i; j < (i+dynChunkSize); j++) {
        let publisher = totalPublisherShare[j].publisher;
        data.push(arr.filter(x => x.publisher === publisher))
      }
      res.push({from: i, to: i+dynChunkSize, data: data})
    }

    return res;   
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
