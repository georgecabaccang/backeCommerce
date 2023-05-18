import { Schema, Types, model } from "mongoose";

const purchaseSchema = new Schema(
    {
        purchases: [],
        purchasesOwner: { type: Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

const Purchase = model("Purchase", purchaseSchema);
export default Purchase;
