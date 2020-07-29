import {Component, OnInit} from '@angular/core';
import {DiceManager} from '@views/home/dice/dice-manager';

@Component({
  selector: 'app-dice',
  template: `
    <canvas id="main-canvas"></canvas>`,
  styles: [`
    #main-canvas {
      position: static;
      top: 0;
      left: 0;
    }
  `]
})
export class DiceComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    // console.log('DiceComponent.ngOnInit()');
    const aa = new DiceManager();
  }

}
