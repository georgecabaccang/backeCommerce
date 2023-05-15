import { Model, Schema, model } from "mongoose";
import { IItemModel } from "../types/ItemModel";

const itemSchema = new Schema<IItemModel, Model<IItemModel>>({
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String },
    quantity: { type: Number, required: true },
    prod_id: { type: String, required: true },
});

const Item = model<IItemModel>("Item", itemSchema);
export default Item;
