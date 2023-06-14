import { Schema, model } from "mongoose";
import { IOrder } from "../types/OrderListModel";

const orderSchema = new Schema<IOrder>(
    {
        items: [
            {
                prod_id: String,
                image: String,
                productName: String,
                price: Number,
                discount: Number,
                discountedPrice: Number,
                quantity: Number,
            },
        ],
        totalAmount: { type: Number, required: true },
        status: { type: String, default: "pending" },
    },
    { timestamps: true }
);

const Order = model<IOrder>("Order", orderSchema);
export default Order;
