import { Schema, model } from "mongoose";

const purchaseSchema = new Schema({
    itemsPurchased: [],
    totalAmountPaid: { type: Number, required: true },
    expireAt: {
        type: Date,
        expires: "5y",
        default: Date.now,
    },
});

const Purchase = model("Purchase", purchaseSchema);
export default Purchase;
