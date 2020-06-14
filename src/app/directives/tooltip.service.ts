import {ElementRef, Injectable} from '@angular/core';


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  components: any[] = [];
 private _param: { ref: ElementRef<any>; id: number; title: string };
  private _param1: (t) => boolean;
  private _idx: void;

  constructor() { }

  push(param: { ref: ElementRef<any>; id: number; title: string }) {
    this._param = param;

  }

  findIndex(param: (t) => boolean) {
    this._param1 = param;

  }

  splice(idx: void, number: number) {
    this._idx = idx;

  }
}
