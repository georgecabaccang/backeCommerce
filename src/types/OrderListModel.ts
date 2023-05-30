import { Types } from "mongoose";

export interface IOrder {
    items: Array<{
        prod_id: string;
        productName: string;
        quantity: number;
        price: number;
        discount: number;
        image: string;
    }>;
    dateReceived?: Date;
    totalAmount: number;
    status?: string;
    _id?: string;
}

export interface IOrderList {
    orders: Array<IOrder>;
    ordersOwner: Types.ObjectId | null;
}
