import { Schema, Types, model } from "mongoose";
import OrderList from "./orderListModel";
import { IPurchasesList } from "../types/PurchaseListModel";

const purchaseListSchema = new Schema<IPurchasesList>(
    {
        purchases: [OrderList.schema],
        purchasesOwner: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const PurchaseList = model<IPurchasesList>("Purchase", purchaseListSchema);
export default PurchaseList;
