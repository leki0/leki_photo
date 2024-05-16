import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SacuvanoPageRoutingModule } from './sacuvano-routing.module';

import { SacuvanoPage } from './sacuvano.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SacuvanoPageRoutingModule
  ],
  declarations: [SacuvanoPage]
})
export class SacuvanoPageModule {}
