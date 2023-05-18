import { Types } from "mongoose";
import { IItemModel } from "./ItemModel";

export interface IOrderList {
    orders: Array<IItemModel>;
    ordersOwner: Types.ObjectId | null;
}
