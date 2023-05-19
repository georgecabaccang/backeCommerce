import { Types } from "mongoose";

interface IOrder {
    items: Array<{ prod_id: string; productName: string; quantity: number; price: number }>;
    totalAmount: number;
}

export interface IOrderList {
    orders: Array<IOrder>;
    ordersOwner: Types.ObjectId | null;
}
