import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GalerijaPageRoutingModule } from './galerija-routing.module';

import { GalerijaPage } from './galerija.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GalerijaPageRoutingModule
  ],
  declarations: [GalerijaPage]
})
export class GalerijaPageModule {}
