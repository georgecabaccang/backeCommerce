import { Schema, Types, model } from "mongoose";

const ordersSchema = new Schema(
    {
        orders: [],
        ordersOwner: { type: Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

const Orders = model("Order", ordersSchema);
export default Orders;
