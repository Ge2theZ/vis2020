import { Component, OnInit } from '@angular/core';
import {TooltipService} from "../tooltip.service";

@Component({
  selector: 'app-tooltip-container',
  template: `
  <div class="app-tooltip-container">
    <app-tooltip
      *ngFor = "let tooltip of tooltipService.components"
      [title]="tooltip.title"
      [ref]="tooltip.ref">
    </app-tooltip>
  </div>`,
  // templateUrl: './tooltip-container.component.html',
  styleUrls: ['./tooltip-container.component.css']
})
export class TooltipContainerComponent implements OnInit {

  constructor(public tooltipService: TooltipService) { }

  ngOnInit(): void {
  }
}
