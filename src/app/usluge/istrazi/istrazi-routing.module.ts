import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IstraziPage } from './istrazi.page';

const routes: Routes = [
  {
    path: '',
    component: IstraziPage
  },
  {
    path: ':uslugaId',
    loadChildren: () => import('./usluga-detalji/usluga-detalji.module').then( m => m.UslugaDetaljiPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IstraziPageRoutingModule {}
