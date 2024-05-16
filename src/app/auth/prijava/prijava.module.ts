import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrijavaPageRoutingModule } from './prijava-routing.module';

import { PrijavaPage } from './prijava.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrijavaPageRoutingModule
  ],
  declarations: [PrijavaPage]
})
export class PrijavaPageModule {}
