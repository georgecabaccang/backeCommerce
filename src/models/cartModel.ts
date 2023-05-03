import { Schema, model } from "mongoose";
import { ICartModel } from "../types/CartModel";
import Item from "./itemModel";

const cartSchema = new Schema<ICartModel>(
    {
        items: [Item.schema],
        cartOwner: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const Cart = model<ICartModel>("Cart", cartSchema);
export default Cart;
