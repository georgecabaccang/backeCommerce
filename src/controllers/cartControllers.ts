import { Request, Response } from "express";
import Cart from "../models/cartModel";
import { IItemModel } from "../types/ItemModel";
import Product from "../models/productModel";

export const getUserCart = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        if (user_id) {
            const cartOfUser = await Cart.findOne({ cartOwner: user_id });
            return res.send(cartOfUser);
        }
        return res.sendStatus(404);
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

export const addToCart = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const itemToCart: IItemModel = req.body;
        // Find product in database
        const product = await Product.findOne<IItemModel>({ _id: itemToCart.prod_id });

        // Get user's cart
        const userCart = await Cart.findOne({ cartOwner: user_id });

        if (userCart) {
            if (product) {
                // Check if product is already in userCart
                const productIndexInCart = userCart?.items.findIndex((item) => {
                    return item.prod_id === itemToCart.prod_id;
                });

                // If product is already in cart
                if (productIndexInCart != -1) {
                    userCart.items[productIndexInCart].quantity += itemToCart.quantity;
                }

                // If product is not in cart
                if (productIndexInCart == -1) {
                    // create object with product's properties
                    const addItemToCart: IItemModel = {
                        productName: product.productName,
                        description: product.description,
                        price: product.price,
                        discount: product.discount,
                        discountedPrice: product.discountedPrice,
                        image: product.image,
                        stock: product.stock,
                        prod_id: itemToCart.prod_id,
                        quantity: itemToCart.quantity,
                    };

                    // push item to user's cart items array
                    userCart.items.push(addItemToCart);
                }

                // save updated cart
                await userCart.save();
                return res.sendStatus(200);
            }
        }
        return res.sendStatus(404);
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const prod_id = req.body.prod_id;
        const userCart = await Cart.findOne({ cartOwner: user_id });

        if (userCart) {
            const indexOfItemInCart = userCart.items.findIndex((item) => {
                return item.prod_id === prod_id;
            });

            if (indexOfItemInCart != 1) {
                if (userCart.items[indexOfItemInCart].quantity != 1) {
                    userCart.items[indexOfItemInCart].quantity--;
                }
                if (userCart.items[indexOfItemInCart].quantity == 1) {
                    userCart.items.splice(indexOfItemInCart, 1);
                }

                await userCart.save();
                return res.sendStatus(200);
            }
            return res.sendStatus(404);
        }
        return res.sendStatus(404);
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

export const changeQuantity = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const quantity = req.body.quantity;
        const prod_id = req.body.prod_id;
        const userCart = await Cart.findOne({ cartOwner: user_id });

        if (userCart) {
            const productIndexInCart = userCart?.items.findIndex((item) => {
                return item.prod_id === prod_id;
            });

            if (productIndexInCart != -1) {
                userCart.items[productIndexInCart].quantity = quantity;

                // save updated quantity of item in cart
                await userCart.save();
                return res.sendStatus(200);
            }
            return res.sendStatus(404);
        }
        return res.sendStatus(404);
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};
