import { Schema, model, Types } from "mongoose";
import { ICheckOutModel } from "../types/CheckOutModel";
import Item from "./itemModel";

const checkOutModel = new Schema<ICheckOutModel>({
    items: [Item.schema],
    totalAmountToPay: { type: Number, required: true },
    cart_id: { type: Types.ObjectId, ref: "Cart" },
});

const CheckOut = model<ICheckOutModel>("CheckOut", checkOutModel);
export default CheckOut;
