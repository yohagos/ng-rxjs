import { Routes } from "@angular/router";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductShellComponent } from "./product-shell/product-shell.component";


export const routes: Routes = [
  {
    path: '',
    component: ProductListComponent
  },
  {
    path: 'alternate',
    component: ProductShellComponent
  }
]
