import { Request, Response } from "express";
import Cart from "../models/cartModel";
import { ICartModel } from "../types/CartModel";
import Item from "../models/itemModel";
import { IItemModel } from "../types/ItemModel";
import { JwtPayload } from "jsonwebtoken";
import { IUserModelForTokensAndPayload } from "../types/UserModel";
import Product from "../models/productModel";

export const getUserCart = async (req: Request, res: Response) => {
    try {
        const user: IUserModelForTokensAndPayload = req.authenticatedUser as JwtPayload;
        if (user._id) {
            const cartOfUser = await Cart.findOne({ cartOwner: user._id });
            return res.send(cartOfUser?.items);
        }
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

export const addToCart = async (req: Request, res: Response) => {
    try {
        const itemToCart: IItemModel = req.body;
        const product = await Product.findOne<IItemModel>({ _id: itemToCart.productID });
        const userCart = await Cart.findOne({ cartOwner: req.authenticatedUser._id });

        if (userCart) {
            if (product) {
                const addItemToCart: IItemModel = {
                    productName: product.productName,
                    price: product.price,
                    image: product.image,
                    stock: product.stock,
                    discount: product.discount,
                    productID: itemToCart.productID,
                    quantity: itemToCart.quantity,
                };

                userCart?.items.push(addItemToCart);
                await userCart.save();

                res.send(userCart);
            }
        }
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};
