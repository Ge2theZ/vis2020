import {Component, OnInit} from '@angular/core';
import { DataService } from '../../services/DataService'

@Component({
  selector: 'app-main-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css']
})
export class GraphViewComponent implements OnInit {
  ready: Boolean = false;
  
  constructor(public dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.onReady$.subscribe(ready => {
      this.ready = ready; 
    })
  }
}
