import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Supplier } from './supplier';
import { catchError, Observable, shareReplay, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  suppliersUrl = 'api/suppliers'

  private http = inject(HttpClient)

  suppliers$ = this.http.get<Supplier[]>(this.suppliersUrl)
    .pipe(
      tap(data => console.log('suppliers : ', data)),
      shareReplay(1),
      catchError(this.handleError)
    )


  private handleError(err : HttpErrorResponse): Observable<never> {
    let errorMessage: string
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`
    } else {
      errorMessage = `Backend returned Code ${err.status}: ${err.message} `
    }
    console.error(errorMessage)
    return throwError(() => errorMessage)
  }
}
