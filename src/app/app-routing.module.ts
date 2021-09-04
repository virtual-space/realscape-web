import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ItemComponent} from "./item/item.component";
import {HomeViewComponent} from "./home-view/home-view.component";
import {MainViewComponent} from "./main-view/main-view.component";
import {SearchViewComponent} from "./search-view/search-view.component";
import {AroundViewComponent} from "./around-view/around-view.component";
import {RealScapeComponent} from "./real-scape/real-scape.component";
import { LayoutComponent } from './layout/layout.component';
import {CallbackComponent} from "./callback/callback.component";

const routes: Routes = [
  { path: '',  redirectTo: 'items/search', pathMatch: 'full' },
  { path: 'callback',  component: CallbackComponent },
  { path: 'real-scape',  component: RealScapeComponent },
  { path: '', component: LayoutComponent, children: [
    { path: 'items', component: MainViewComponent, children: [
      { path: 'search',  component: SearchViewComponent },
      { path: 'around', component: AroundViewComponent },
      { path: 'home',  component: HomeViewComponent },
      {
        path: ':id',
        component: ItemComponent,
        data: {public : false}
      }
    ]},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
