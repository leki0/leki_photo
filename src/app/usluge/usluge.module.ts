import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UslugePageRoutingModule } from './usluge-routing.module';

import { UslugePage } from './usluge.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UslugePageRoutingModule
  ],
  declarations: [UslugePage]
})
export class UslugePageModule {}
