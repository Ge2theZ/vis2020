import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../services/DataService';
import { Router, NavigationExtras } from '@angular/router';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { Game } from 'src/models/Game'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public searchquery: string;
  public gameNameList: string[];

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.dataService.onReady$.subscribe(() => {
      this.gameNameList = this.dataService.gameDataSet.map(i => i.name);
    })
  }

  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 2 ? []
      : this.gameNameList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

  execSearch(){
    let game: Game = this.dataService.gameDataSet.filter(item => item.name === this.searchquery)[0];
    let navigationExtras: NavigationExtras = {
      queryParams: {
          game: JSON.stringify(game)
      }
    } 
    this.router.navigate([`/home/details/${game.name}`], navigationExtras);
  }

}
