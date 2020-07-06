import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {DataService} from '../../services/DataService';

interface Breadcrumb {
  name: string;
  url : string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  homeBreadCrumb: Breadcrumb = {name: "Home", url: "home"};
  genreBreadCrumb: Breadcrumb = {name: "Genre", url: "home/genre/"};
  publisherBreadCrumb: Breadcrumb = {name: "Publisher", url: "home/genre/"};
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.router.events.subscribe((navigationStart) => {
      if(navigationStart instanceof NavigationStart ) {
        let navigationRoute = navigationStart.url.split('%20').join(' ');
        let slicedRoute = navigationRoute.slice(1).split("/");
        console.log(slicedRoute);

        this.breadcrumbs = [];
        if(slicedRoute[0] === "home") {
          this.breadcrumbs[0] = this.homeBreadCrumb;
        }

        if(slicedRoute[1] == "details") {
          let gameIndex = slicedRoute[2];
          let gameName = this.dataService.gameDataSet.filter(item => item.index === Number(gameIndex))[0].name;
          this.breadcrumbs[1] = {name: gameName, url: navigationRoute};
        }

        if(slicedRoute[1] == "faq") {
          this.breadcrumbs[1] = {name: "FAQ", url: navigationRoute};
        }

        if (slicedRoute[1] === "genre") {
          this.breadcrumbs[1] = {name: slicedRoute[2], url: this.genreBreadCrumb.url + slicedRoute[2]};
        }

        if (slicedRoute[3] === "publisher") {
          this.publisherBreadCrumb.name = '';
          this.publisherBreadCrumb.url = navigationRoute;
          slicedRoute[4].split('%20').forEach(word => {
            this.publisherBreadCrumb.name += word + ' ';
          });
          this.breadcrumbs[2] = {name: this.publisherBreadCrumb.name, url: navigationRoute};
        }
      }
    });

  }
}
