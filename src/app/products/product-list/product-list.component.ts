import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, Subject } from 'rxjs';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Products'
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private productService = inject(ProductService)

  products$ = this.productService.productsWithCategory$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  selectedProduct$ = this.productService.selectedProduct$

  vm$ = combineLatest([
    this.products$,
    this.selectedProduct$
  ]).pipe(
    map(([products, product]) => {
      return ({products, productId: product ? product.id : 0})
    })
  )

  onSelected(productId: number) {
    this.productService.selectedProductChanged(productId)
  }
}
