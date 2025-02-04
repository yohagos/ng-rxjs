import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.routes').then(mod => mod.routes)
  },
  {
    path: '', redirectTo: 'welcome', pathMatch: 'full'
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];
