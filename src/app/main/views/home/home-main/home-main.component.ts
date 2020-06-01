import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {RootStoreState} from '@root-store/index';
import {MyDice} from './my-dice';
import {AngularLogo} from '@views/home/home-main/angular-logo';

@Component({
  selector: 'app-home-main',
  templateUrl: 'home-main.component.html',
  styles: [`
    .container {
      z-index: auto;
    }
  `]
})
export class HomeMainComponent implements OnInit {

  constructor(private readonly store$: Store<RootStoreState.State>) {
  }

  ngOnInit() {
    console.log('HomeMainComponent.ngOnInit()');
    // const test = new MyDice(document.getElementById('container'));
    // new AngularLogo();
    // const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    // new MyDice(canvas);
  }

}
