import {inject, Injectable} from '@angular/core';
import {Product} from './product';
import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {BehaviorSubject, catchError, combineLatest, filter, forkJoin, map, merge, Observable, of, scan, shareReplay, Subject, switchMap, tap, throwError} from 'rxjs';
import {ProductCategoryService} from '../product-categories/product-category.service';
import { Supplier } from '../suppliers/supplier';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl = 'api/products';
  private supplierUrl = 'api/suppliers';

  private http = inject(HttpClient)
  private productCategoryService = inject(ProductCategoryService)

  private productSelectedSubject = new BehaviorSubject<number>(0)
  productSelectedAction$ = this.productSelectedSubject.asObservable()

  products$ = this.http.get<Product[]>(this.productUrl )
    .pipe(
      tap(data => console.log('Products: ', data)),
      catchError(this.handleError)
    );

  productsWithCategory$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategories$
  ]).pipe(
    map(([products, categories]) => {
        if (!Array.isArray(products)) return []

        return products.map(product => ({
          ...product,
          price: product.price ? product.price * 1.5 : 0,
          category: categories.find(c => product.categoryId === c.id)?.name,
          searchKey: [product.productName]
        } as Product))
      }
    ),
    shareReplay(1)
  )

  private handleError(err: HttpErrorResponse): Observable<HttpErrorResponse> {
    let errorMessage: string
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned error : ${err.status}: ${err.message}`;
    }
    console.error(err)
    return throwError(() => errorMessage)
  }

  selectedProduct$ = combineLatest([
    this.productsWithCategory$,
    this.productSelectedAction$
  ]).pipe(
    map(([products, selectedProductId]) => {
        if (!products) return undefined
        return products.find(product => product.id === selectedProductId)
      }
    ),
    tap(product => console.log('Selected Product : ', product)),
    shareReplay(1)
  )

  selectedProductSuppliers$ = this.selectedProduct$
    .pipe(
      filter(product => Boolean(product)),
      switchMap(selectedProduct => {
        if (!selectedProduct?.supplierIds) {
          return of([])
        }
        return forkJoin(selectedProduct.supplierIds.map(supplierId =>
          this.http.get<Supplier>(`${this.supplierUrl}/${supplierId}`)
        ))
      }),
      tap(suppliers => console.log('Product Suppliers: ', JSON.stringify(suppliers)))
    )

  private productInsertedSubject = new Subject<Product>()
  productInsertedAction$ = this.productInsertedSubject.asObservable()

  productsWithAdd$ = merge(
    this.productsWithCategory$,
    this.productInsertedAction$
  ).pipe(
    scan((acc, value) =>
      (value instanceof Array) ? [...value] : [...acc, value], [] as Product[]
    )
  )

  addProduct(newProduct?: Product) {
    newProduct = newProduct || this.fakeProduct()
    this.productInsertedSubject.next(newProduct)
  }

  selectedProductChanged(selectedProductId: number) {
    this.productSelectedSubject.next(selectedProductId)
  }

  private fakeProduct(): Product {
    return {
      id: 55,
      productName: 'Table',
      productCode: 'TBX-0055',
      description: 'Table',
      price: 130,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 5
    }
  }
}
