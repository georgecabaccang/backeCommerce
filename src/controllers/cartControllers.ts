import { Request, Response } from "express";
import Cart from "../models/cartModel";
import { ICartModel } from "../types/CartModel";
import Item from "../models/itemModel";
import { IItemModel } from "../types/ItemModel";
import { JwtPayload } from "jsonwebtoken";
import { IUserModelForTokensAndPayload } from "../types/UserModel";

export const getUserCart = async (req: Request, res: Response) => {
    try {
        const user: IUserModelForTokensAndPayload = req.authenticatedUser as JwtPayload;
        if (user._id) {
            const cartOfUser = await Cart.findOne({ cartOwner: user._id });
            return res.send(cartOfUser);
        }
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

export const addToCart = async (req: Request, res: Response) => {
    try {
        const itemToCart: IItemModel = req.body;
        const addItemToCart = new Item({});
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};
