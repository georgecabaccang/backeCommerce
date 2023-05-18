import { Types } from "mongoose";
import { IOrderList } from "./OrderListModel";

export interface IPurchasesList {
    purchases: Array<IOrderList>;
    purchasesOwner: Types.ObjectId | null;
}
