import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {MainViewComponent} from './main-view/main-view.component';
import {FilteredMainViewComponent} from './filtered-main-view/filtered-main-view.component';
import {GameDetailsComponent} from './game-details/game-details.component';


const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', children: [
        {path: '', component: MainViewComponent},
        {path: 'genre/:genre', component: FilteredMainViewComponent},
        {path: 'details/:gameTitle', component: GameDetailsComponent}
      ]}

  ]
;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
