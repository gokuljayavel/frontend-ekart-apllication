import { Component, OnInit } from "@angular/core";
import { Cart } from "../../../shared/models/cart";
import { CustomerCartService } from "./customer-cart.service";
import { CustomerSharedService } from "../customer-shared-service";
import { Customer } from "../../../shared/models/customer";
import { CustomerAddressService } from '../customer-details/customer-address/customer-address.service';



@Component({
    selector: 'customer-cart',
    templateUrl: './customer-cart.component.html'
})
export class CustomerCartComponent implements OnInit {
    cartList: Cart[] = [];
    selectedCartProduct: Cart;
    viewCartProductDetails: boolean = false;
    placeOrder : boolean = false;
    successMessage: string;
    errorMessage: string;
    loggedInCustomer: any;
    viewCardDetails: boolean = false;

    ngOnInit(): void {
        this.loggedInCustomer = JSON.parse(sessionStorage.getItem("customer"));
        this.customerCartService.getCustomerCart(this.loggedInCustomer.emailId).subscribe(
            cart => {
                this.cartList = cart;
                console.log(this.cartList)
                sessionStorage.setItem("cart", JSON.stringify(this.cartList));
                // this.customerSharedService.updatedCartList.subscribe(cartList => this.cartList = cartList)
                this.customerSharedService.updateCartList(this.cartList)
            }, err => {
                // this.customerSharedService.updatedCartList.subscribe(cartList => this.cartList = cartList)
            }
        )
        this.viewCartProductDetails = false;
        this.placeOrder = false;
        this.viewCardDetails = JSON.parse(sessionStorage.getItem("displayCardDetails"));
    }

    constructor(private customerCartService: CustomerCartService, private customerSharedService: CustomerSharedService) { }
    setSelectedCart(cart: Cart) {
        this.successMessage = "";
        this.errorMessage = "";
        this.viewCartProductDetails = true;
        this.selectedCartProduct = cart;

    }

    deleteProductFromCart(cart: Cart) {
        this.successMessage=null;
        this.errorMessage=null;
        let loggedInCustomer: Customer = JSON.parse(sessionStorage.getItem("customer"));
        this.customerCartService.deleteProductFromCart(cart, loggedInCustomer.emailId).subscribe(
            message => {
                this.cartList = this.cartList.filter(item => item.cartId !== cart.cartId);
                console.log(this.cartList)
                this.customerSharedService.updateCartList(this.cartList);
                sessionStorage.setItem("cart", JSON.stringify(this.cartList));
                this.successMessage = message;
            }, error => this.errorMessage = <any>error
        )

    }

}
