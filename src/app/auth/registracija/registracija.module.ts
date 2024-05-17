import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistracijaPageRoutingModule } from './registracija-routing.module';

import { RegistracijaPage } from './registracija.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistracijaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegistracijaPage]
})
export class RegistracijaPageModule {}
