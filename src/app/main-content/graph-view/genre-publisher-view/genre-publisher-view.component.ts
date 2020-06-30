import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/DataService';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../services/navigate.service';

@Component({
  selector: 'app-genre-publisher-view',
  templateUrl: './genre-publisher-view.component.html',
  styleUrls: ['./genre-publisher-view.component.css']
})
export class GenrePublisherViewComponent implements OnInit {
  publisher: string;

  constructor(public dataService: DataService,
              public router: Router,
              public route: ActivatedRoute,
              public navigationService: NavigationService) {
  }

  ngOnInit(): void {
    this.publisher = this.route.snapshot.params.publisherId;
    this.navigationService.updatePublisher(this.publisher);
  }

}
