import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SacuvanoPage } from './sacuvano.page';

const routes: Routes = [
  {
    path: '',
    component: SacuvanoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SacuvanoPageRoutingModule {}
