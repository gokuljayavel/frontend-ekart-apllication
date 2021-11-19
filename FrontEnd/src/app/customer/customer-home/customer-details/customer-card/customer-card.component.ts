import { Component, OnInit } from '@angular/core';
import { Card } from "../../../../shared/models/card";
import { Customer } from "../../../../shared/models/customer";
import { CustomerCardService } from './customer-card.service';
import { CustomerSharedService } from '../../customer-shared-service';
import { Cart } from 'src/app/shared/models/cart';
import { Address } from 'src/app/shared/models/address';
import { PaymentThrough } from 'src/app/shared/models/payment-through';

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.component.html',
  styleUrls: ['./customer-card.component.css']
})
export class CustomerCardComponent implements OnInit {

  loggedInCustomer: Customer;
  Cards: Card[];
  successMessage: string = null;
  errorMessage: string = null;
  expErrorMessage = null;
  cvvErrorMessage: string = null;
  cvvSuccessMessage: string = null;

  selectedCard: Card = null;
  copyOfCard: Card;
  cardToAdd: Card = null;

  expm: number = null;
  expy: number = null;
  cvv: number = null;

  displayPlaceOrder: boolean = false;
  orderSuccess: boolean = false;
  orderNumber: number = null;
  orderIds: string[] = [];
  paymentThrough: PaymentThrough = null;
  isCashOnDelivery: boolean = false;


  constructor(private cs: CustomerCardService, private sharedService: CustomerSharedService) { }

  ngOnInit(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.loggedInCustomer = JSON.parse(sessionStorage.getItem("customer"));
    this.cs.showCard(this.loggedInCustomer.emailId)
      .subscribe(
        response => {
          this.Cards = response;
        },
        error => {
          this.errorMessage = error;
        }

      );
  }

  addNewCard() {
    this.successMessage = null;
    this.errorMessage = null;
    this.cardToAdd = new Card();
  }

  verifyExpiryDate() {
    let expmd = new Date().getMonth();
    let expyd = new Date().getFullYear();
    if (expmd < this.expm && expyd < this.expy) {
      this.cardToAdd.expiryDate = this.expy + "-" + this.expm + "-01 00:00:00"
      this.addCard();
      this.expErrorMessage = null;
    }
    else {
      this.expErrorMessage = "Incorrect Expiry date"
    }
  }

  addCard() {
    this.successMessage = null;
    this.errorMessage = null;
    this.cs.addNewCard(this.cardToAdd, this.loggedInCustomer.emailId).subscribe(response => {
      this.successMessage = response;
      let id = this.successMessage.substring(this.successMessage.indexOf(":") + 1).trim();
      this.cardToAdd.cardId = parseInt(id);
      this.Cards.push(this.cardToAdd);
      this.loggedInCustomer.cards = this.Cards;
      this.cardToAdd = null;
      sessionStorage.setItem("customer", JSON.stringify(this.loggedInCustomer));
    }, error => {
      this.errorMessage = error;
    })
  }

  cancelAdd() {
    this.successMessage = null;
    this.errorMessage = null;
    this.cardToAdd = null;
  }

  verifyCvv() {
    this.cs.verifyCard(this.selectedCard.cardId, this.cvv).subscribe(
      response => {
        if (response) {
          this.displayPlaceOrder = true;
          this.cvvSuccessMessage = "Card Verified";
          this.cvvErrorMessage = null;
          sessionStorage.setItem('selectedCardType', JSON.stringify(this.selectedCard.cardType));
        }
        else {
          this.displayPlaceOrder = false;
          this.cvvErrorMessage = "You've entered wrong CVV";
          this.cvvSuccessMessage = null;
        }
      },
      error => {
        this.errorMessage = error;
      }
    );
  }

  cashOnDelivery(){
    this.isCashOnDelivery = true;
    this.displayPlaceOrder = true;
  }

  placeOrder() {
    this.cs.getOrderNumber().subscribe(
      response => {
        this.orderNumber = response;
        sessionStorage.setItem('onumber', JSON.stringify(this.orderNumber));
        let cartList: Cart[] = JSON.parse(sessionStorage.getItem('cart'));
        let address: Address = JSON.parse(sessionStorage.getItem('selectedAddress'));
        if(!this.isCashOnDelivery)
        {
          let cardType: string = this.selectedCard.cardType
          this.paymentThrough = cardType == 'DEBIT_CARD' ? PaymentThrough.DEBIT_CARD: PaymentThrough.CREDIT_CARD;
        }
        else{
          this.paymentThrough = PaymentThrough.CASH_ON_DELIVERY;
        }
        this.orderIds = this.cs.placeOrder(this.loggedInCustomer.emailId, cartList, address.addressId, this.paymentThrough, this.orderNumber)
        setTimeout(() => {
          this.orderSuccess = true;
        }, 300);
        
      },
      error => {
        this.errorMessage = error;
      }
    );
  }
}
