import { Types } from "mongoose";

export interface IOrder {
    items: Array<{
        prod_id: string;
        image: string;
        productName: string;
        price: number;
        discount: number;
        discountedPrice: number;
        quantity: number;
    }>;
    totalAmount: number;
    status?: string;
    _id?: string;
}

export interface IOrderList {
    orders: Array<IOrder>;
    ordersOwner: Types.ObjectId | null;
}
