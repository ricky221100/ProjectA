import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Store} from '@ngrx/store';
import {RootStoreState, RouterStoreActions, SlideMenuStoreActions} from '../../../root-store/';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-slide-menu',
  template: `
    <div class="slide-header"><i class="fas fa-heart"></i> Menù</div>
    <p-panelMenu [model]="items" [style.width.%]="100"></p-panelMenu>
  `,
  styles: [`
    .slide-header {
      height: 70px;
      top: 0;
      left: 0;
      right: 0;
      background-color: #0067b7;
      color: #FFF;
      font-size: x-large;
      padding: 18px;
    }

    .slide-header i {
      font-size: xx-large;
    }

    a.ui-menuitem-link.ui-corner-all.ng-tns-c10-4.ng-star-inserted {
      background-color: #ebf6ff;
      border-bottom: solid 1px #b8d7ef;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SlideMenuComponent implements OnInit, OnDestroy {

  constructor(private readonly store$: Store<RootStoreState.State>) {
  }

  items: MenuItem[];

  ngOnDestroy(): void {
  }

  // todo: completare profilazione dei pulsanti.
  ngOnInit() {

    const items = [
      {
        label: 'Home',
        icon: 'pi pi-pw pi-file',
        command: (event$) => {
          // invoco il router per cambiare pagina
          this.store$.dispatch(RouterStoreActions.RouterGo({path: ['home']}));

          // salvo nello store del menù l'elemento selezionato.
          this.store$.dispatch(SlideMenuStoreActions.Select({
            item: {
              data: {},
              breadcrumb: ['Home']
            }
          }));
        }
      }
    ];
    this.items = items;
    this.store$.dispatch(SlideMenuStoreActions.Select({
      item: {
        data: {},
        breadcrumb: ['Home']
      }
    }));
  }
}
