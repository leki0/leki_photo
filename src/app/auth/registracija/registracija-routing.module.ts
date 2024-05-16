import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistracijaPage } from './registracija.page';

const routes: Routes = [
  {
    path: '',
    component: RegistracijaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistracijaPageRoutingModule {}
