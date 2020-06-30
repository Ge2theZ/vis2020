import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../services/DataService';
import { Router, NavigationExtras } from '@angular/router';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { Game } from 'src/models/Game'
import {NavigationService} from '../services/navigate.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public searchquery: string;
  public gameNameList: string[];

  constructor(private dataService: DataService,
              private router: Router,
              private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.dataService.onReady$.subscribe(() => {
      this.gameNameList = this.dataService.gameDataSet.map(i => i.name + " | " + i.plattform);
    })
  }

  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 2 ? []
      : this.gameNameList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

  execSearch() {
    let searchParams = this.searchquery.split(" | ");
    let game: Game = this.dataService.gameDataSet.filter(item => item.name === searchParams[0] && item.plattform === searchParams[1])[0];
    this.navigationService.updateGame(game);
    this.router.navigate([`/home/details/${game.name}`]);
  }
}
