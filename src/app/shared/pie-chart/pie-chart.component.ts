import { Component, OnInit, OnChanges,  Input, ViewChild, ElementRef } from '@angular/core';
import { Game } from 'src/models/Game';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/services/navigate.service';
import { ChartOptions } from 'chart.js';
import {DataService} from '../../services/DataService';


export enum PieUseCase {
  details_view_sale_distribution,
  top100_genre_publisher
}

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @Input() public game: Game;
  @Input() games: Game[];
  @Input() useCase: PieUseCase;

  public pieChartData;
  public pieChartLabels;
  public pieChartType = "pie";
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    }
  };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    switch(this.useCase) {
      case PieUseCase.details_view_sale_distribution:
        this.pieChartData = [
          this.game.euSales,
          this.game.jpSales,
          this.game.naSales,
          this.game.otherSales
        ];
        this.pieChartLabels = ["EU Sales","JP Sales","NA Sales", "Other Sales"];
        break;
      case PieUseCase.top100_genre_publisher:
        this.dataService.onReady$.subscribe(ready => { //Fetch data since we need all the data from the dataset
          if (ready) {
            const gameDataForGenre = this.dataService.gameDataSet.filter(game => game.genre === this.games[0].genre);
            const sortedDataForGenreBySales = gameDataForGenre.sort((a, b) => b.globalSales - a.globalSales);
            const top100GamesByGenre = sortedDataForGenreBySales.slice(0,100);
            const top10GamesByGenrePublisherList =  [...new Set(top100GamesByGenre.map(game => game.publisher))];

            // add current publisher to list if not already in list
            if(!top10GamesByGenrePublisherList.includes(this.games[0].publisher)){
              top10GamesByGenrePublisherList.push(this.games[0].publisher);
            }

            let publisherOccurenceArray = new Array<number>(top10GamesByGenrePublisherList.length).fill(0);
            // now count occurrences of publishers
            for(let index = 0; index < top100GamesByGenre.length; index ++) {
              publisherOccurenceArray[top10GamesByGenrePublisherList.indexOf(top100GamesByGenre[index].publisher)] += 1;
            }

            // create an object so we can sort it correctly
            let top100PublisherOccurrenceArr = [];
            for(let i = 0; i < top10GamesByGenrePublisherList.length; i++) {
              top100PublisherOccurrenceArr.push([top10GamesByGenrePublisherList[i], publisherOccurenceArray[i]])
            }

            const sortedTop100PublisherOccurrenceArr = top100PublisherOccurrenceArr.sort(((a, b) => b[1] - a[1]));

            // add all occurrences below 3% together
            let otherCount = 0;
            let labels: string[] = [];
            let data: number[] = [];
            for(let i = 0; i < sortedTop100PublisherOccurrenceArr.length; i++){
              if(sortedTop100PublisherOccurrenceArr[i][1] < 3 && sortedTop100PublisherOccurrenceArr[i][0] !== this.games[0].publisher) {
                otherCount+= sortedTop100PublisherOccurrenceArr[i][1];
              } else {
                labels.push(sortedTop100PublisherOccurrenceArr[i][0]);
                data.push(sortedTop100PublisherOccurrenceArr[i][1]);
              }
            }
            labels.push('Other');
            data.push(otherCount);

            this.pieChartLabels = labels;
            this.pieChartData = data;
          }
        });


        break;
      default:
        break;
    }


  }

}
