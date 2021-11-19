import { Address } from "./address";
import { Cart } from './cart';
import { Card } from './card';
import {Orders} from './order';

export class Customer {
    // private String emailId;
    // private String name;
    // private String password;
    // private String phoneNumber;
    // private List<Address> addresses;
    emailId: string;
    name: string;
    password: string;
    newPassword: string;
    phoneNumber: string;
    addresses: Address[];
    cards:Card[];
    customerCarts: Cart[];
    orders :Orders[];
    //check for customer carts
}