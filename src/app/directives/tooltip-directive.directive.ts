import {Directive, ElementRef, HostListener, Input, OnDestroy} from '@angular/core';
import {TooltipService} from "./tooltip.service";

/* The attribute directive invoking the tooltip to be shown */

@Directive({
  selector: '[appTooltipDirective]'
})
export class TooltipDirectiveDirective implements OnDestroy {
  @Input() tooltipTitle: string = '';
  private id: number;

  constructor(private tooltipService: TooltipService, private element: ElementRef) { }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.id = Math.random();
    this.tooltipService.push({
      id: this.id,
      ref: this.element,
      title: this.tooltipTitle
    });
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    const idx = this.tooltipService.findIndex((t) => {
      return t.id === this.id;
    });

    this.tooltipService.splice(idx, 1);
  }
}
