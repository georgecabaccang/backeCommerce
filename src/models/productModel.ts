import { Schema, model } from "mongoose";

import { IProductModel } from "../types/ProductModel";

const productSchema = new Schema<IProductModel>({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
});

const Product = model<IProductModel>("Product", productSchema);
export default Product;
