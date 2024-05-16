import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IstraziPageRoutingModule } from './istrazi-routing.module';

import { IstraziPage } from './istrazi.page';
import { UslugaElementComponent } from '../usluga-element/usluga-element.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IstraziPageRoutingModule
  ],
  declarations: [IstraziPage,UslugaElementComponent]
})
export class IstraziPageModule {}
