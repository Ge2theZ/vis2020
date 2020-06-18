import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {GraphViewComponent} from './main-content/components/graph-view/graph-view.component';
import {FooterComponent} from './footer/footer.component';
import {StackedLineGraphComponent} from './main-content/components/stacked-line-graph/stacked-line-graph.component';
import {CoverCarouselComponent} from './shared/cover-carousel/cover-carousel.component';
import {CoverCardComponent} from './shared/cover-carousel/cover-card/cover-card.component';
import {HttpClientModule} from '@angular/common/http';
import {FilteredMainViewComponent} from './main-content/components/filtered-main-view/filtered-main-view.component';
import {GameDetailsComponent} from './main-content/components/game-details/game-details.component';
import {BreadcrumbComponent} from './shared/breadcrumb/breadcrumb.component';
import {DataService} from './services/DataService';
import {PublisherMainViewComponent} from './main-content/components/publisher-main-view/publisher-main-view.component';
import {MainContentComponent} from './main-content/main-content.component';
import {CarouselViewComponent} from './main-content/components/carousel-view/carousel-view.component';

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
    FilteredMainViewComponent,
    GameDetailsComponent,
    PublisherMainViewComponent,
    CarouselViewComponent,

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
