import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFabricMainComponent } from './my-fabric-main/my-fabric-main.component';
import {NgLetModule} from '@core/directive/ng-let.directive';

@NgModule({
  declarations: [MyFabricMainComponent],
  exports: [
    MyFabricMainComponent
  ],
  imports: [
    CommonModule,
    NgLetModule
  ]
})
export class MyFabricModule { }
