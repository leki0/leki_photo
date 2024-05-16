import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistracijaPageRoutingModule } from './registracija-routing.module';

import { RegistracijaPage } from './registracija.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistracijaPageRoutingModule
  ],
  declarations: [RegistracijaPage]
})
export class RegistracijaPageModule {}
