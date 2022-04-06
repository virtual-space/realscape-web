import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { HomeComponent } from './home/home.component';
import { RnItemViewComponent } from './rn-item-view/rn-item-view.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'items/:id', component: RnItemViewComponent },
  { path: 'callback',  component: CallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
