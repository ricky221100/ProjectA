import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeMainComponent} from './home-main/home-main.component';
import {DiceComponent} from '@views/home/dice/dice.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dice',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeMainComponent,
    pathMatch: 'full'
  },
  {
    path: 'dice',
    component: DiceComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
