import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
    {
        itemsOrdered: [],
        totalAmountToPay: { type: Number, required: true },
        orderedBy: { type: Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

const Order = model("Order", orderSchema);
export default Order;
