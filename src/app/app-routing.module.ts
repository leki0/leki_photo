import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'usluge',
    pathMatch: 'full'
  },
  {
    path: 'usluge',
    loadChildren: () => import('./usluge/usluge.module').then(m => m.UslugePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'galerija',
    loadChildren: () => import('./galerija/galerija.module').then(m => m.GalerijaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'usluge/tabs/istrazi',
    children: [
      {
        path: '',
        loadChildren: () => import('./usluge/istrazi/istrazi.module').then(m => m.IstraziPageModule)
      },
      {
        path: ':uslugaId',
        loadChildren: () => import('./usluge/istrazi/usluga-detalji/usluga-detalji.module').then(m => m.UslugaDetaljiPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'usluge',
    pathMatch: 'full'
  },
  {
    path: 'prijava',
    loadChildren: () => import('./auth/prijava/prijava.module').then(m => m.PrijavaPageModule)
  },

  {
    path: 'registracija',
    loadChildren: () => import('./auth/registracija/registracija.module').then(m => m.RegistracijaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
