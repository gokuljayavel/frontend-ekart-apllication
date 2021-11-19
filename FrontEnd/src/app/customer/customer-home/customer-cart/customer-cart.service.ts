
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Cart } from "../../../shared/models/cart";
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomerAddressComponent } from '../customer-details/customer-address/customer-address.component';


@Injectable({
    providedIn: 'root'
})
export class CustomerCartService {

    private headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
    constructor(private http: HttpClient) { }

    deleteProductFromCart(cart: Cart, customerEmailId: string): Observable<string> {
        let url: string = environment.customerCartUrl + "/customers/" + customerEmailId + "/customerCarts/" + cart.cartId + "/products";
        return this.http.delete<string>(url, { headers: this.headers, responseType: 'text' as 'json' })
            .pipe(
                catchError(this.handleError)
            );

    }

    updateCart(cart: Cart): Observable<string> {
        let url: string = environment.customerCartUrl + "/customerCarts";
        return this.http.put(url, cart, {responseType: 'text' })
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

    getCustomerCart(emailId: any) {
        let url: string = environment.customerCartUrl + "/customers/" + emailId + '/customerCarts/';
        return this.http.get<Cart[]>(url)
            .pipe(catchError(this.handleError));
    }

}
