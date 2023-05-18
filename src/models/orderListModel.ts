import { Schema, Types, model } from "mongoose";
import Item from "./itemModel";
import { IOrderList } from "../types/OrderListModel";

const orderListSchema = new Schema<IOrderList>(
    {
        orders: [
            {
                items: [{ prod_id: String, productName: String, quantity: Number, price: Number }],
                totalAmount: Number,
            },
        ],
        ordersOwner: { type: Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const OrderList = model<IOrderList>("OrderList", orderListSchema);
export default OrderList;
