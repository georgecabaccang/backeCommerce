import { Schema, model } from "mongoose";

import { IProductModel } from "../types/ProductModel";

const productSchema = new Schema<IProductModel>({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    discountedPrice: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    postedBy: { type: Schema.Types.ObjectId, required: true },
    salesCount: { type: Number, default: 0 },
});

const Product = model<IProductModel>("Product", productSchema);
export default Product;
