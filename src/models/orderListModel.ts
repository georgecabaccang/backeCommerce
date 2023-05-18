import { Schema, Types, model } from "mongoose";
import Item from "./itemModel";
import { IOrderList } from "../types/OrderListModel";

const orderListSchema = new Schema<IOrderList>(
    {
        orders: [Item.schema],
        ordersOwner: { type: Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const OrderList = model<IOrderList>("OrderList", orderListSchema);
export default OrderList;
