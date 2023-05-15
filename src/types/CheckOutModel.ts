import { ICartModel } from "./CartModel";

export interface ICheckOutModel extends ICartModel {
    totalAmountToPay: number;
}
