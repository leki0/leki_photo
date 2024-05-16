import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UslugePage } from './usluge.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: UslugePage,
    children: [
      {
        path: 'istrazi',
        loadChildren: () => import('./istrazi/istrazi.module').then(m => m.IstraziPageModule)
      },
      {
        path: 'sacuvano',
        loadChildren: () => import('./sacuvano/sacuvano.module').then(m => m.SacuvanoPageModule)
      },
      {
        path: '',
        redirectTo: '/usluge/tabs/istrazi',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: '',
    redirectTo: '/usluge/tabs/istrazi',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UslugePageRoutingModule { }
