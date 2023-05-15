import { IProductModel } from "./ProductModel";

export interface IItemModel extends IProductModel {
    prod_id: string;
    quantity: number;
}
