import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrijavaPage } from './prijava.page';

const routes: Routes = [
  {
    path: '',
    component: PrijavaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrijavaPageRoutingModule {}
