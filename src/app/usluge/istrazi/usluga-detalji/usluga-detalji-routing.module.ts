import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UslugaDetaljiPage } from './usluga-detalji.page';

const routes: Routes = [
  {
    path: '',
    component: UslugaDetaljiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UslugaDetaljiPageRoutingModule {}
