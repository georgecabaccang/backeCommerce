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
        return res.sendStatus(404);
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

export const addToCart = async (req: Request, res: Response) => {
    try {
        const itemToCart: IItemModel = req.body;
        // Find product in database
        const product = await Product.findOne<IItemModel>({ _id: itemToCart.productID });
        // Get user's cart
        const userCart = await Cart.findOne({ cartOwner: req.authenticatedUser._id });

        if (userCart) {
            if (product) {
                // Check if product is already in userCart
                const productIndexInCart = userCart?.items.findIndex(
                    (item) => item.productID === itemToCart.productID
                );

                // If product is already in cart
                if (productIndexInCart != -1) {
                    userCart.items[productIndexInCart].quantity += itemToCart.quantity;
                }

                // If product is not in cart
                if (productIndexInCart == -1) {
                    // create object with product's properties
                    const addItemToCart: IItemModel = {
                        productName: product.productName,
                        price: product.price,
                        image: product.image,
                        stock: product.stock,
                        discount: product.discount,
                        productID: itemToCart.productID,
                        quantity: itemToCart.quantity,
                    };

                    // push item to user's cart items array
                    userCart?.items.push(addItemToCart);
                }

                // save updated cart
                await userCart.save();
                return res.sendStatus(200);
            }
        }
        return res.sendStatus(404);
    } catch (error) {}
};

export const changeQuantity = async (req: Request, res: Response) => {
    try {
        const quantity = req.body.quantity;
        const productID = req.body.productID;
        const userCart = await Cart.findOne({ cartOwner: req.authenticatedUser._id });

        if (userCart) {
            const productIndexInCart = userCart?.items.findIndex(
                (item) => item.productID === productID
            );

            const qweqe = { fromReq: productID, inCart: userCart.items };
            // return res.send(req.body);

            if (productIndexInCart != -1) {
                userCart.items[productIndexInCart].quantity = quantity;

                // save updated quantity of item in cart
                await userCart.save();
                return res.sendStatus(200);
            }
            return res.sendStatus(404);
        }
        if (!userCart) return res.sendStatus(404);
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};
