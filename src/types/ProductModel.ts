import { Types } from "mongoose";

export interface IProductModel {
    productName: string;
    description: string;
    price: number;
    discount: number;
    discountedPrice: number;
    stock: number;
    image: string;
    postedBy?: Types.ObjectId;
    salesCount?: number;
}
