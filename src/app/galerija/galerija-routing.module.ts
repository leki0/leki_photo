import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GalerijaPage } from './galerija.page';

const routes: Routes = [
  {
    path: '',
    component: GalerijaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GalerijaPageRoutingModule {}
