import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainViewComponent } from './main-view/main-view.component';
import { FooterComponent } from './footer/footer.component';
import { StackedLineGraphComponent } from './main-view/stacked-line-graph/stacked-line-graph.component';
import { CoverCarouselComponent } from './main-view/cover-carousel/cover-carousel.component';
import { CoverCardComponent } from './main-view/cover-carousel/cover-card/cover-card.component';
import { HttpClientModule } from '@angular/common/http';
import { FilteredMainViewComponent } from './filtered-main-view/filtered-main-view.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainViewComponent,
    FooterComponent,
    StackedLineGraphComponent,
    CoverCarouselComponent,
    CoverCardComponent,
    FilteredMainViewComponent,
    GameDetailsComponent,
    BreadcrumbComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
