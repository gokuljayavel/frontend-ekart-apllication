import { Pipe, PipeTransform } from "@angular/core";
import { Card } from '../models/Card';



@Pipe({ name: "cardPipe" })
export class CardPipe implements PipeTransform {
    transform(value: Card) {
        if (!value) {
            return [];
        }
        let cardArr: string[] = [];
        cardArr.push(value.cardType);
        let x=value.cardNumber.slice(0,4)+' '+
        value.cardNumber.slice(4,8).replace(/./g,'X')+' '+
        value.cardNumber.slice(8,12).replace(/./g,'X')+' '
        +value.cardNumber.slice(12.16);
        cardArr.push(x);
        let y=value.expiryDate.slice(5,7)+'/'+value.expiryDate.slice(0,4);
        cardArr.push(y);
        cardArr.push(value.nameOnCard);
        

        return cardArr;
    }

}