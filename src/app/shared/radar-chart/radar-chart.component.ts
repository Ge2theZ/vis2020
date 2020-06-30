import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css']
})
export class RadarChartComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') radarChartCanvas: ElementRef;
  @Input() labels: string[];
  @Input() data: number[];

  radarChart: Chart;
  radarData: {};
  radarOptions: {};
  ready: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // configure radar data
    this.radarData = {
      labels: this.labels,
      datasets: [{data: this.data}]
    };

    // configure radar options
    this.radarOptions = {
      scale: {
        angleLines: {
          display: false
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 10
        }
      }
    };

    this.radarChart = new Chart('canvas', {
      type: 'radar',
      data: this.radarData,
      options: this.radarOptions,
    })
    this.ready = true;
  }

  covertToDatasets(data) {
    let datasets = [];
    for(let dataset of data) {
      datasets.push({data: dataset});
    }
    return datasets;
  }
}
