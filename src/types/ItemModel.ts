import { IProductModel } from "./ProductModel";

export interface IItemModel extends IProductModel {
    productID: string;
    quantity: number;
}
