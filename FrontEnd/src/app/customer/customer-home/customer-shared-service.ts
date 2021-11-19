import { Injectable } from "@angular/core";
import { Product } from "../../shared/models/product";
import { BehaviorSubject, throwError, Observable } from "rxjs";
import { Cart } from "../../shared/models/cart";
import { Address } from '../../shared/models/address';
import { Card } from '../../shared/models/card';
import { Customer } from '../../shared/models/customer';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { CustomerAddressComponent } from './customer-details/customer-address/customer-address.component';


@Injectable({
    providedIn: 'root'
})
export class CustomerSharedService {

    constructor(private http: HttpClient) { }

    private cartList = new BehaviorSubject<Cart[]>(sessionStorage.getItem("cart") == null ? [] : JSON.parse(sessionStorage.getItem("cart")));
    updatedCartList = this.cartList.asObservable();

    private addressList = new BehaviorSubject<Address[]>(JSON.parse(sessionStorage.getItem("customer")).addresses);
    updatedAddressList = this.addressList.asObservable();

    private cardList = new BehaviorSubject<Card[]>(JSON.parse(sessionStorage.getItem("customer")).cards);
    updatedCardList = this.cardList.asObservable();

    private loggedInCustomer = new BehaviorSubject<Customer>(JSON.parse(sessionStorage.getItem("customer")));
    updatedCustomer = this.loggedInCustomer.asObservable();



    updatedCustomerDetails(customer: Customer) {
        this.loggedInCustomer.next(customer);
    }
    updateCartList(cartList: Cart[]) {
        this.cartList.next(cartList);
    }
    updateCustomerAddressList(addressList: Address[]) {
        this.addressList.next(addressList);

    }
    updateCustomerCardList(cardList: Card[]) {
        this.cardList.next(cardList);

    }

    addProductToCart(cart: Cart): Observable<string> {
        return this.http.post(environment.customerCartUrl + "/customerCarts/" + cart.customerEmailId + "/products", cart, { responseType: "text" })
            .pipe(catchError(this.handleError))

    }


    displayCardDetails()  {
      sessionStorage.setItem('displayCardDetails', 'true');
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
