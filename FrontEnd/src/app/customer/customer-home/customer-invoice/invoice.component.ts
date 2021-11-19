import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/shared/models/customer';
import { Address } from 'src/app/shared/models/address';
import { Product } from 'src/app/shared/models/product';
import { Orders } from 'src/app/shared/models/order';
import { OrderServiceService } from '../customer-orders/order-service.service';
import * as jspdf from 'jspdf'
import html2canvas from 'html2canvas'
import { OrderStatus } from 'src/app/shared/models/order-status';
import { PaymentThrough } from 'src/app/shared/models/payment-through';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  loggedInCustomer:Customer;
  orderaddress:Address;
  prodList:Product[]=[];
  orderList:Orders[];
  ordNumber = null;
  grandTotal = null;
  errorMessage = null


  constructor(private os:OrderServiceService) { }

  ngOnInit(): void {
    this.loggedInCustomer = JSON.parse(sessionStorage.getItem("customer"));
    this.orderaddress = JSON.parse(sessionStorage.getItem("selectedAddress"));
    //this.ordNumber = 71000
    this.ordNumber = JSON.parse(sessionStorage.getItem("onumber"));
    this.os.getCustomerOrdersByOrderNumber(this.loggedInCustomer.emailId,this.ordNumber).subscribe(
      response => {this.orderList=response;
        // this.orderList=this.orderList.filter((order)=> (order.orderStatus==OrderStatus.DELIVERED)||((order.paymentThrough==PaymentThrough.CREDIT_CARD||order.paymentThrough==PaymentThrough.DEBIT_CARD)&&order.orderStatus!=OrderStatus.CANCELLED))
      for(let order of this.orderList){
        this.prodList.push(order.product);
      }
      this.totalFunc();
      },
      error => {this.errorMessage=error}
    )
  }

  totalFunc(){
    this.grandTotal = 0;
    for(let order of this.orderList){
      this.grandTotal+=order.totalPrice;
    }
  }

  downloadAsPDF(){
    let element = document.getElementById('pdfInvoice');
    window.scroll(0,0)
    html2canvas(element,{allowTaint:true,scale:2}).then(canvas=>
      {
        let HTML_WIDTH = canvas.width
        let HTML_HEIGHT = canvas.height
        let top_left_margin = 15
        let PDF_WIDTH = HTML_WIDTH + top_left_margin*2
        let PDF_HEIGHT = (PDF_WIDTH*1.5)+top_left_margin*2
        let canvas_image_width = HTML_WIDTH
        let canvas_image_height = HTML_HEIGHT
        let totalPDFPages = Math.ceil(HTML_WIDTH/PDF_WIDTH) 
        canvas.getContext('2d')
        let imgData = canvas.toDataURL("image/jpeg",1.0)
        let pdf = new jspdf.jsPDF('p','pt',[PDF_WIDTH,PDF_HEIGHT])
        pdf.addImage(imgData,'JPG',top_left_margin,top_left_margin,canvas_image_width,canvas_image_height)
        for(let i=1;i<=totalPDFPages;i++){
          pdf.addPage([PDF_WIDTH,PDF_HEIGHT],'p');
          pdf.addImage(imgData,'JPG',top_left_margin,-(PDF_HEIGHT*i)+top_left_margin*4,canvas_image_width,canvas_image_height)
        }
        pdf.save("Invoice-"+this.ordNumber+"-.pdf")
      })
  }
  

  }


