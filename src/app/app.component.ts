import {Component, HostListener, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {RootStoreState, SlideMenuStoreActions, SlideMenuStoreSelectors} from '@root-store/index';
import {Observable} from 'rxjs';
import {timeInterval} from 'rxjs/operators';
import {Title} from '@angular/platform-browser';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private readonly store$: Store<RootStoreState.State>, private title:Title) {
  }

  open$: Observable<boolean>;
  test = environment.envName;

  @HostListener('document:keydown.escape', ['$event'])
  onMouseup(event: KeyboardEvent) {
    // Metodo invocato alla pressione di ESC, utilizzato per la chiusura di tutte le popUp o i toast.
  }

  onClickOutside($event, open, elements) {
    if (open && elements.offsetLeft === 0) {
      this.store$.dispatch(SlideMenuStoreActions.Open({open: !open}));
    }
  }

  ngOnInit() {
    this.open$ = this.store$.select(SlideMenuStoreSelectors.selectOpen);
    setInterval(() => {
      console.log('AppComponent.()');
      this.title.setTitle(Math.random() * 100 + '');
    }, 500);
  }

}
