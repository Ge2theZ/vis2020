import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GameDetailsComponent} from './main-content/game-details/game-details.component';
import {MainContentComponent} from './main-content/main-content.component';
import {GraphViewComponent} from './main-content/graph-view/graph-view.component';
import {GenreCarouselComponent} from './main-content/graph-view/genre-carousel/genre-carousel.component';
import {PublisherCarouselComponent} from './main-content/graph-view/publisher-carousel/publisher-carousel.component';
import {GenrePublisherViewComponent} from './main-content/graph-view/genre-publisher-view/genre-publisher-view.component';
import {FaqViewComponent} from './main-content/faq-view/faq-view.component';


const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {
      path: 'home', component: MainContentComponent, children: [
        {
          path: '', component: GraphViewComponent, children: [
            {path: '', component: GenreCarouselComponent},
            {path: 'genre/:genreId', component: PublisherCarouselComponent},
            {path: 'genre/:genreId/publisher/:publisherId', component: GenrePublisherViewComponent}
          ]
        },
        {
          path: 'details/:gameTitle', component: GameDetailsComponent
        },
        {
          path: 'faq', component: FaqViewComponent
        }

      ]
    }
  ]
;

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
