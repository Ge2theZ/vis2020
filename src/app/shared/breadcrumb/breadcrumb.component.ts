import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, PRIMARY_OUTLET, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {NavigationService} from '../../services/navigate.service';

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
  game: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.router.events.subscribe((navigationStart) => {
      if(navigationStart instanceof NavigationStart ) {
        let route = navigationStart.url;
        let slicedRoute = route.slice(1).split("/");
        console.log(slicedRoute);

        this.breadcrumbs = [];
        if(slicedRoute[0] === "home") {
          this.breadcrumbs[0] = this.homeBreadCrumb;
        }

        if(slicedRoute[1] == "details") {
          this.navigationService.game$.subscribe(value => {
            this.breadcrumbs[1] = {name: value.name, url: route};
          });
        }

        if(slicedRoute[1] == "faq") {
          this.breadcrumbs[1] = {name: "FAQ", url: route};
        }

        if (slicedRoute[1] === "genre") {
          this.breadcrumbs[1] = {name: slicedRoute[2], url: this.genreBreadCrumb.url + slicedRoute[2]};
        }

        if (slicedRoute[3] === "publisher") {
          this.publisherBreadCrumb.url = route; // since it is the last url
          this.publisherBreadCrumb.name = slicedRoute[4];
          this.breadcrumbs[2] = {name: slicedRoute[4], url: route};
        }
      }
    });

  }
}