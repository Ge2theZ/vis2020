import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-info-badge',
  templateUrl: './info-badge.component.html',
  styleUrls: ['./info-badge.component.css']
})
export class InfoBadgeComponent implements OnInit {
  @Input() tooltipText: string;
  @Input() badgeLabel: string;
  tooltipOptions = {
    'placement': 'top',
    'contentType' : 'template',
    'theme': 'light',
    'hide-delay': 50
  };

  constructor() { }

  ngOnInit(): void {
  }

}
