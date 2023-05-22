import { Schema, Types, model } from "mongoose";
import { IOrderList } from "../types/OrderListModel";
import Order from "./orderModel";

const orderListSchema = new Schema<IOrderList>(
    {
        orders: [Order.schema],
        ordersOwner: { type: Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const OrderList = model<IOrderList>("OrderList", orderListSchema);
export default OrderList;
