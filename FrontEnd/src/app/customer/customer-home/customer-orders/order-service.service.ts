import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { Orders } from 'src/app/shared/models/order';
import { catchError } from 'rxjs/operators';
import { Address } from 'src/app/shared/models/address';

@Injectable()
export class OrderServiceService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }

  getCustomerOrders(customerEmailId: string): Observable<Orders[]> {
    const url = environment.customerAPIUrl + "/customers/" + customerEmailId + "/showorders";
    return this.http.get<Orders[]>(url, { headers: this.headers })
      .pipe(catchError(this.handleError));

  }

  getCustomerOrdersByOrderNumber(customerEmailId: string,onumber:number): Observable<Orders[]> {
    const url = environment.customerAPIUrl + "/customers/" + customerEmailId + "/"+onumber;
    return this.http.get<Orders[]>(url, { headers: this.headers })
      .pipe(catchError(this.handleError));

  }

  addOrder(orderToAdd:Orders,customerEmailId: string): Observable<string> {
    let url: string = environment.customerAPIUrl + "/customers/" + customerEmailId + "/orders";
    return this.http.post<string>(url, orderToAdd, { responseType: 'text' as 'json' })
        .pipe(
            catchError(this.handleError)
        );
}
getAddress(addressId): Observable<Address> {
    const url = environment.customerAPIUrl + "/addresses/" + addressId;
    return this.http.get<Address>(url)
      .pipe(catchError(this.handleError));

  }

  private handleError(err: HttpErrorResponse) {
    console.log(err)
    let errMsg: string = '';

    if (err.status == 400) {
        errMsg = "The request can not be processed at the moment. Please try again later or connect with admin!!";
    } else if (err.status == 404) {
        errMsg = "The resources you are looking for is not available. Please try again later or connect with admin!!";
    } else {
        if (err.error instanceof Error) {

            errMsg = err.error.message;

            console.log(errMsg)
        }
        else if (typeof err.error === 'string') {
            alert("I am in error")
            errMsg = JSON.parse(err.error).errorMessage
        }
        else {
            if (err.status == 0) {
                errMsg = "A connection to back end can not be established.";
            } else {
                errMsg = err.error.message;
            }
        }
    }
    return throwError(errMsg);
}

}
