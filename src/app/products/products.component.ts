import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject, map, catchError, EMPTY } from 'rxjs';
import { ProductService } from './product.service';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent {
  pageTitle = 'Product List'
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private categorySelectedSubject = new BehaviorSubject<number>(0)
  categorySelectedAction$ = this.categorySelectedSubject.asObservable()

  private productService = inject(ProductService)
  private categoryService = inject(ProductCategoryService)

  products$ = combineLatest([
    this.productService.productsWithAdd$,
    this.categorySelectedAction$
  ]).pipe(
    map(([products, selecetedCategoryId]) =>
      products.filter(product =>
        selecetedCategoryId ? product.categoryId === selecetedCategoryId : true
      )
    ),
    catchError(err => {
      this.errorMessageSubject.next(err)
      return EMPTY
    })
  )

  categories$ = this.categoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err)
        return EMPTY
      })
    )

  vm$ = combineLatest([
    this.products$,
    this.categories$,
  ]).pipe(
    map(([products, categories]) => ({products, categories}))
  )

  onAdd() {
    this.productService.addProduct()
  }

  onSelected(categoryId: string) {
    this.categorySelectedSubject.next(+categoryId)
  }
}
