import { Schema, model } from "mongoose";
import { IOrder } from "../types/OrderListModel";

const orderSchema = new Schema<IOrder>(
    {
        items: [{ prod_id: String, productName: String, quantity: Number, price: Number }],
        totalAmount: { type: Number, required: true },
    },
    { timestamps: true }
);

const Order = model<IOrder>("Order", orderSchema);
export default Order;
