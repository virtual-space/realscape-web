import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RealscapeAppComponent } from './realscape-app/realscape-app.component';
import {ItemComponent} from "./item/item.component";
import {HomeViewComponent} from "./home-view/home-view.component";
import {MainViewComponent} from "./main-view/main-view.component";
import {AppsViewComponent} from "./apps-view/apps-view.component";
import {SearchViewComponent} from "./search-view/search-view.component";
import {AroundViewComponent} from "./around-view/around-view.component";
import {RealScapeComponent} from "./real-scape/real-scape.component";
import { LayoutComponent } from './layout/layout.component';
import {CallbackComponent} from "./callback/callback.component";
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '',  redirectTo: 'apps', pathMatch: 'full' },
  { path: 'login',  component: LoginComponent },
  { path: 'callback',  component: CallbackComponent },
  { path: 'apps/:name',  component: RealscapeAppComponent },
  { path: 'apps',  component: AppsViewComponent },
  { path: 'real-scape',  component: RealScapeComponent },
  { path: '', component: LayoutComponent, children: [
    { path: 'items', component: MainViewComponent, children: [
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
