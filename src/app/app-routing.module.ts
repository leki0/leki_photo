import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'usluge',
    loadChildren: () => import('./usluge/usluge.module').then(m => m.UslugePageModule)
  },
  {
    path: 'galerija',
    loadChildren: () => import('./galerija/galerija.module').then(m => m.GalerijaPageModule)
  },
  {
    path: '',
    redirectTo: 'usluge',
    pathMatch: 'full'
  },
  {
    path: 'prijava',
    loadChildren: () => import('./auth/prijava/prijava.module').then( m => m.PrijavaPageModule)
  },
  {
    path: 'registrovanje',
    loadChildren: () => import('./auth/registrovanje/registrovanje.module').then( m => m.RegistrovanjePageModule)
  },
  {
    path: 'registracija',
    loadChildren: () => import('./auth/registracija/registracija.module').then( m => m.RegistracijaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
