import { Injectable, OnInit } from '@angular/core';
import { Game } from '../../models/Game'
import { GenreSalesPerYear } from '../../models/GenreSalesPerYear'
import { HttpClient } from '@angular/common/http'; 
import * as Rx from 'rxjs';
import { CoverCarousel } from 'src/models/CoverCarousel';
import { CoverCarouselComponent } from '../main-view/cover-carousel/cover-carousel.component';
import { SharePerYearPerPublisher } from 'src/models/SharePerYearPerPublisher';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    public gameDataSet: Game[] = [];
    public genreSalesPerYears: GenreSalesPerYear[];
    public liveCarousel$: Rx.BehaviorSubject<CoverCarousel[]>;
    public onReady$: Rx.BehaviorSubject<Boolean>;

    constructor(private http: HttpClient){
        this.liveCarousel$ = new Rx.BehaviorSubject<CoverCarousel[]>([]);
        this.onReady$ = new Rx.BehaviorSubject<Boolean>(false);
        this.readInGameDataSet().subscribe(data => {
            for (const game of data) {
                this.gameDataSet.push(new Game(game));
            }
            console.log("GameDataset: ", this.gameDataSet)
            this.readInGenreSalesPerYears().subscribe(data => {
                this.genreSalesPerYears = data;
                //console.log("GenreSales per Year: ", this.genreSalesPerYears)
                this.onReady$.next(true);
            })
        });
    }

    readInGameDataSet(): Rx.Observable<any> { 
        return this.http.get('../../assets/preprocessed_dataset.json');
    }

    readInGenreSalesPerYears(): Rx.Observable<any> {
        return this.http.get('../../assets/SalesPerYearGenre.json');
    }

    updateCoverCarousel(genre: String, fromYear: number, toYear: number) {
        let timeInterval = toYear - fromYear;
        let timeBin = timeInterval / 6;
        let carouselList = [];

        for (let i = 0; i < 6; i++) {
            let from = fromYear + (timeBin * i) + (i==0 ? 0 : 1);
            let to = fromYear + (timeBin * (i + 1));
            var game = this.getCoverCarouselData(from, to , genre);
            if(!game){ 
                game = new Game();
                game.name = "No Game found";
                game.publisher = ""; 
            }
            carouselList.push(new CoverCarousel(from, to, game));
        }
        this.liveCarousel$.next(carouselList);
    }

    getStaticCarouselData(genre: String, fromYear: number, toYear: number) {
      let timeInterval = toYear - fromYear;
      let timeBin = timeInterval / 6;
      let carouselList = [];

      for (let i = 0; i < 6; i++) {
        let from = fromYear + (timeBin * i) + (i==0 ? 0 : 1);
        let to = fromYear + (timeBin * (i+1));
        var game = this.getCoverCarouselData(from, to , genre);
        /*
        if(!game){
          game = new Game();
          game.name = "No Game found";
          game.publisher = "";
        }

         */
        carouselList.push(new CoverCarousel(from, to, game));
      }
       return carouselList;
    }

    getGenres(): string[] {
      let genres: string[] = [];
      this.gameDataSet.forEach(value =>{
          if(!genres.includes(value.genre)){
            genres.push(value.genre);
          }
      });
      return genres;
    }

    getCoverCarouselData(fromTime:number, toTime:number, genre:String):Game{
        //filter for given Genre
        if(genre !== "all"){
            var filteredGameData = this.gameDataSet.filter(game => game.genre === genre);
        }
        // sort gameDataSet by globalSales
        filteredGameData.sort((a,b)=>{
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
            if(game.year >= fromTime && game.year <= toTime){
                return game;
            }
        }
    }

    getCoverCarouselDataWithPublisher(fromTime:number, toTime:number, genre:String, publisher:String):Game{
        //filter for given Genre
        var filteredGameData = this.gameDataSet.filter(game => game.genre === genre && genre !== "all");
        filteredGameData = filteredGameData.filter(game => game.publisher === publisher && publisher !== "all")
        // sort gameDataSet by globalSales
        filteredGameData.sort((a,b)=>{
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
            if(game.year >= fromTime && game.year <= toTime){
                return game;
            }
        }
    }

    getMarketShareForGenrePerYear(genre:String) : SharePerYearPerPublisher[]{
        let filtered = this.gameDataSet.filter((game) => game.genre === genre);
        var res = [];
        var totalSalesPerYear = {}

        let uniqueYears = [...new Set(filtered.map(game => game.year))];
        let uniquePublisher = [...new Set(filtered.map(game => game.publisher))];

        for (const year of uniqueYears) {
            let filteredByYear = filtered.filter((game) => game.year === year);
            totalSalesPerYear[year] = filteredByYear.reduce((a,b) => { return a + b.globalSales; }, 0);
        }

        for (const year of uniqueYears) {
            for (const publisher of uniquePublisher) {
                let filteredByYearAndPublisher = filtered.filter((game) => game.year === year && game.publisher === publisher);
                let sumSalesPublisherYear = filteredByYearAndPublisher.reduce((a,b) => { return a + b.globalSales; }, 0);
                res.push(new SharePerYearPerPublisher(year, (sumSalesPublisherYear / totalSalesPerYear[year]) * 100 ,publisher));
            }
        }
        return res;
    }
}
