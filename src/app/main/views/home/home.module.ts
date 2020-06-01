import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomeMainComponent} from './home-main/home-main.component';
import {HomeRoutingModule} from './home-routing.module';
import {PanelModule} from 'primeng/panel';
import {ChartModule} from 'primeng/chart';
import {CardModule} from 'primeng/card';
import {MyFabricModule} from '@core/my-fabric/my-fabric.module';

@NgModule({
  declarations: [HomeMainComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HomeRoutingModule,
        PanelModule,
        ChartModule,
        CardModule,
        MyFabricModule
    ],
  providers: [],
  entryComponents: []
})
export class HomeModule {
}
