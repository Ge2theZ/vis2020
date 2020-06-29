import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {GraphViewComponent} from './main-content/graph-view/graph-view.component';
import {FooterComponent} from './footer/footer.component';
import {StackedLineGraphComponent} from './main-content/graph-view/stacked-line-graph/stacked-line-graph.component';
import {CoverCarouselComponent} from './shared/cover-carousel/cover-carousel.component';
import {CoverCardComponent} from './shared/cover-carousel/cover-card/cover-card.component';
import {HttpClientModule} from '@angular/common/http';
import {GameDetailsComponent} from './main-content/game-details/game-details.component';
import {BreadcrumbComponent} from './shared/breadcrumb/breadcrumb.component';
import {DataService} from './services/DataService';
import {MainContentComponent} from './main-content/main-content.component';
import {GenreCarouselComponent} from './main-content/graph-view/genre-carousel/genre-carousel.component';
import { PublisherCarouselComponent } from './main-content/graph-view/publisher-carousel/publisher-carousel.component';
import { GenrePublisherViewComponent } from './main-content/graph-view/genre-publisher-view/genre-publisher-view.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    MainContentComponent,
    GraphViewComponent,
    StackedLineGraphComponent,
    CoverCarouselComponent,
    CoverCardComponent,
    BreadcrumbComponent,
    GameDetailsComponent,
    GenreCarouselComponent,
    GenreCarouselComponent,
    PublisherCarouselComponent,
    GenrePublisherViewComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
