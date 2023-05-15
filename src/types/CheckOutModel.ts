import { Types } from "mongoose";
import { ICartModel } from "./CartModel";

export interface ICheckOutModel extends ICartModel {
    totalAmountToPay: number;
    cart_id: Types.ObjectId | null;
}
