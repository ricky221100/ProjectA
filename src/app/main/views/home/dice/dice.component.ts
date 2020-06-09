import {Component, OnInit} from '@angular/core';
import {AngularLogo} from '@views/home/dice/angular-logo';

@Component({
  selector: 'app-dice',
  template: `
    <canvas id="main-canvas"></canvas>`,
  styles: [``]
})
export class DiceComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    new AngularLogo();
  }

}
