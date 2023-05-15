import { Schema, model } from "mongoose";
import { ICheckOutModel } from "../types/CheckOutModel";
import Item from "./itemModel";

const checkOutModel = new Schema<ICheckOutModel>({
    items: [Item.schema],
    totalAmountToPay: { type: Number, required: true },
});

const CheckOut = model<ICheckOutModel>("CheckOut", checkOutModel);
export default CheckOut;
