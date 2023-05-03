import { Types } from "mongoose";
import { IItemModel } from "./ItemModel";

export interface ICartModel {
    items: Array<IItemModel>;
    cartOwner: Types.ObjectId | null;
}
