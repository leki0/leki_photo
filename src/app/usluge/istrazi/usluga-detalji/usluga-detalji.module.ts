import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UslugaDetaljiPageRoutingModule } from './usluga-detalji-routing.module';

import { UslugaDetaljiPage } from './usluga-detalji.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UslugaDetaljiPageRoutingModule
  ],
  declarations: [UslugaDetaljiPage]
})
export class UslugaDetaljiPageModule {}
