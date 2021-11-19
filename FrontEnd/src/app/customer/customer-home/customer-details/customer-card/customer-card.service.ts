import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Card } from 'src/app/shared/models/card';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Cart } from 'src/app/shared/models/cart';
import { OrderStatus } from 'src/app/shared/models/order-status';
import { PaymentThrough } from 'src/app/shared/models/payment-through';
import { Orders } from 'src/app/shared/models/order';
import { OrderServiceService } from '../../customer-orders/order-service.service';

@Injectable()
export class CustomerCardService {
  private headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
  constructor(private http: HttpClient, private os: OrderServiceService) { }

  addNewCard(cardToadd: Card, customerEmailId: string): Observable<string> {
    let url: string = environment.customerAPIUrl + "/customers/" + customerEmailId + "/cards";
    return this.http.post<string>(url, cardToadd, { responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError)
      );
  }

  showCard(customerEmailId: string): Observable<Card[]> {
    let url: string = environment.customerAPIUrl + "/customers/" + customerEmailId + "/savedcards";
    return this.http.get<Card[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  verifyCard(cardId: number, cvv: number): Observable<Boolean> {
    let url: string = environment.customerAPIUrl + "/customer/card/" + cardId + "/" + cvv;
    return this.http.get<Boolean>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getOrderNumber(): Observable<number> {
    let url: string = environment.customerAPIUrl + "/customers/onumber";
    return this.http.get<number>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  placeOrder(emailId: string, cartList: Cart[], addressId: number, paymentThrough: PaymentThrough, orderNumber: number): string[] {

    let orderId: string[] = [];
    let now = new Date();
    let delDate = new Date();
    delDate.setDate(now.getDate() + 7);

    for (let cartItem of cartList) {
      let order = {
        orderId: 1,
        addressId: addressId,
        customerEmailId: emailId,
        dataOfDelivery: delDate,
        dateOfOrder: now,
        orderNumber: orderNumber,
        orderStatus: OrderStatus.PLACED,
        paymentThrough: paymentThrough,
        product: cartItem.product,
        quantity: cartItem.quantity,
        totalPrice: cartItem.product.price
      };
      this.os.addOrder(order, emailId).subscribe(
        response => {
          orderId.push(response);
        }
      );
    }
    return orderId;
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
