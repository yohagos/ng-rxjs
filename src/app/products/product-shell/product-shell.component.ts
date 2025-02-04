import { Component } from '@angular/core';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
  selector: 'app-product-shell',
  standalone: true,
  imports: [
    ProductDetailComponent,
    ProductListComponent
  ],
  templateUrl: './product-shell.component.html',
  styleUrl: './product-shell.component.scss'
})
export class ProductShellComponent {

}
