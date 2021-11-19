import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Product } from '../../../../shared/models/product';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class SellerAddProductService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }

  addProduct(productToAdd: Product): Observable<Product> {
    const url = environment.sellerProductAPIUrl + '/sellers/products';
    return this.http.post<Product>(url, productToAdd)
      .pipe(catchError(this.handleError));
  }

  getProductCategories(): Observable<string[]> {
    const url = environment.sellerProductAPIUrl + "/productCategories";
    return this.http.get<string[]>(url)
      .pipe(catchError(this.handleError));

  }
  private handleError(err: HttpErrorResponse) {
    console.log(err)
    let errMsg: string = '';
    if (err.error instanceof Error) {
      errMsg = err.error.message;
      console.log(errMsg)
    }
    else if (typeof err.error === 'string') {
      errMsg = JSON.parse(err.error).errorMessage
    }
    else {
      if (err.status == 0) {
        errMsg = "A connection to back end can not be established.";
      } else {
        errMsg = err.error.message;
      }
    }
    return throwError(errMsg);
  }
}
