import {AfterViewInit, Component, HostListener, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  template: `
  <div class = "detail" [innerHTML]="title"></div>`,
  // templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent implements AfterViewInit {
  @Input() title: string;
  @Input() ref: any;

  ngAfterViewInit(): void {
    // position based on `ref`
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    // update position based on `ref`
  }
}
