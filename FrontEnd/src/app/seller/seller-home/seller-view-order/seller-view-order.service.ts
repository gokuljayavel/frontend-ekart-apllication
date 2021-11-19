import { Injectable } from '@angular/core';
import { Orders } from '../../../shared/models/order';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Address } from 'src/app/shared/models/address';

@Injectable({
  providedIn: 'root'
})
export class SellerViewOrderService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }

  getAllOrders(sellerEmailId): Observable<Orders[]> {
    const url = environment.sellerOrderAPI + "/sellers" + "/" + sellerEmailId;
    return this.http.get<Orders[]>(url, { headers: this.headers })
      .pipe(catchError(this.handleError));

  }

  getAddress(addressId): Observable<Address> {
    const url = environment.customerAPIUrl + "/addresses/" + addressId;
    return this.http.get<Address>(url)
      .pipe(catchError(this.handleError));

  }

  updateOrder(orderId, orderStatus): Observable<string> {
    const url = environment.sellerOrderAPI + "/orders" + "/" + orderId + "/orderStatus/" + orderStatus;
    return this.http.put<string>(url, orderStatus, { headers: this.headers, responseType: 'text' as 'json' })
      .pipe(catchError(this.handleError));

  }


  getAllOrderStatus(): Observable<string[]> {
    const url = environment.sellerOrderAPI + "/orderStatus";
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

