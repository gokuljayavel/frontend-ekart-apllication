import { Component, Input, OnInit } from '@angular/core';
import { Address } from 'src/app/shared/models/address';
import { Customer } from 'src/app/shared/models/customer';
import { Product } from 'src/app/shared/models/product';
import { Orders } from "../../../shared/models/order";
import { OrderServiceService } from './order-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders : Orders[] = [];
  loggedInCustomer: Customer;
  successMessage: string = null;
  errorMessage: string = null;
  expErrorMessage = null;
  displayProduct: Product = null;
  addressToDisplay: Address;
   productListMap : Map<number, Product[]> = new Map<number, Product[]>();
   addressList : Map<number,Address> = new Map<number,Address> ();
   orderMap : Map<number,number> = new Map<number,number>();
  //deliverystatus = null;
 // isdelivery : boolean =null;
  productlist : Product[]=[];
  groups : Orders[]=[];
  curr= 1

  constructor(private os:OrderServiceService,private router: Router) { }

  ngOnInit(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.loggedInCustomer = JSON.parse(sessionStorage.getItem("customer"));
    this.os.getCustomerOrders(this.loggedInCustomer.emailId).subscribe(
      res =>{
        this.orders = res;
        console.log(this.orders.length);
        console.log(this.orders);
        this.groupOrder();
        console.log(this.groups.length);
        this.loggedInCustomer.orders = this.orders;
       // this.setaddress();
        //this.displayAddressDetails(this.orders[0].addressId);
        for(let order of this.orders){
          this.os.getAddress(order.addressId).subscribe((address)=>{
            this.addressToDisplay = address;
            this.addressList.set(order.addressId,this.addressToDisplay);
           // console.log(this.addressToDisplay);
            return this.addressToDisplay;
        }, (error)=>{
            this.errorMessage = error;
        });
          //console.log(order.addressId);
         // this.addressList.set(order.orderNumber,this.addressToDisplay);
        }
        //console.log(this.addressList);
      },
      err =>{
        this.errorMessage = err;
      }
    );
     //console.log(this.orders);
  }

  // displayProductDetails(ordernumber : number){
  //   this.productlist=this.productListMap.get(ordernumber);

  // }
//   displayAddressDetails(addressId: number) : Address{
//     this.displayProduct=null;
//     this.addressToDisplay = null;
//     this.os.getAddress(addressId).subscribe((address)=>{
//         this.addressToDisplay = address;
//         console.log(this.addressToDisplay);
//         return this.addressToDisplay;
//     }, (error)=>{
//         this.errorMessage = error;
//     });
//     console.log("1");
//     return this.addressToDisplay;
// }
//  setaddress(){
//    for(let order of this.orders){
//     this.addressToDisplay=this.displayAddressDetails(order.addressId);
//      console.log(order.addressId);
//      console.log(this.addressToDisplay);
//      this.addressList.set(order.orderNumber,this.addressToDisplay);
//    }
//    console.log(this.addressList);
//  }

downloadInvoice(ornum : number,oradd : Address){
  sessionStorage.setItem("onumber",JSON.stringify(ornum));
  sessionStorage.setItem("selectedAddress",JSON.stringify(oradd));
  this.router.navigate(['/home/invoice']);

}

  groupOrder(){
    this.groups =[];
    this.productlist=[];
    console.log(this.orders.length);
      for(let i=0; i<this.orders.length-1; i++){
          if(this.orders[i].orderNumber==this.orders[i+1].orderNumber){
            this.productlist.push(this.orders[i].product);
            this.orderMap.set(i,this.orders[i].quantity);
            console.log(i+"-"+this.orders[i].orderNumber);
      }
      else{
        console.log(i+"-"+this.orders[i].orderNumber);
        this.orderMap.set(i,this.orders[i].quantity);
        this.productlist.push(this.orders[i].product);
        console.log(this.productlist);
        this.productListMap.set(this.orders[i].orderNumber,this.productlist);
        this.productlist=[];
        this.groups.push(this.orders[i]);
      }
  }
    if(this.orders[this.orders.length-1].orderNumber==this.orders[this.orders.length-2].orderNumber){
      this.productlist.push(this.orders[this.orders.length-1].product);
      this.orderMap.set(this.orders.length-1,this.orders[this.orders.length-1].quantity);
      console.log("i9-"+this.orders[this.orders.length-1].orderNumber);
      console.log(this.productlist);
      this.productListMap.set(this.orders[this.orders.length-1].orderNumber,this.productlist);
      this.groups.push(this.orders[this.orders.length-1]);
    }
    else{
      this.productListMap.set(this.orders[this.orders.length-2].orderNumber,this.productlist);
      console.log("e9-"+this.orders[this.orders.length-1].orderNumber);
      this.orderMap.set(this.orders.length-1,this.orders[this.orders.length-1].quantity);
      this.groups.push(this.orders[this.orders.length-2]);
      this.productlist=[];
      this.productlist.push(this.orders[this.orders.length-1].product);
      this.productListMap.set(this.orders[this.orders.length-1].orderNumber,this.productlist);
      this.groups.push(this.orders[this.orders.length-1]);
    }
    console.log(this.orderMap);
    console.log(this.productListMap.get(this.groups[0].orderNumber));
    console.log(this.productListMap.get(this.groups[1].orderNumber));
    console.log(this.groups.length);
}
}
