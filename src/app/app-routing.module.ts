import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FilteredMainViewComponent} from './main-content/components/filtered-main-view/filtered-main-view.component';
import {GameDetailsComponent} from './main-content/components/game-details/game-details.component';
import {PublisherMainViewComponent} from './main-content/components/publisher-main-view/publisher-main-view.component';
import {MainContentComponent} from './main-content/main-content.component';
import {StackedLineGraphComponent} from './main-content/components/stacked-line-graph/stacked-line-graph.component';
import {AppComponent} from './app.component';
import {GraphViewComponent} from './main-content/components/graph-view/graph-view.component';
import {CarouselViewComponent} from './main-content/components/carousel-view/carousel-view.component';


const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {
      path: 'home', children: [
        {path: '', component: MainContentComponent},
        {
          path: '', outlet: 'main-content', children: [
            {
              path: '', component: GraphViewComponent, children: [
                {path: '', outlet: 'graph', component: StackedLineGraphComponent},
                {path: '', outlet: 'below-graph-content', component: CarouselViewComponent},
              ]
            },
            {
              path: 'details/:gameTitle', component: GameDetailsComponent
            }
          ]
        }
      ]
    }

  ]
;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
