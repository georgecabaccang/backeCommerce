import { Request, Response } from "express";
import Cart from "../models/cartModel";
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
        const product_id = req.body.prod_id;
        const intialQuantity = req.body.quantity;
        // Find product in database
        const product = await Product.findOne({ _id: product_id });

        // Get user's cart
        const userCart = await Cart.findOne({ cartOwner: user_id });

        if (userCart) {
            if (product) {
                // Check if product is already in userCart
                const productIndexInCart = userCart.items.findIndex((item) => {
                    return item.prod_id === product_id.prod_id;
                });

                // If product is already in cart
                if (productIndexInCart != -1) {
                    userCart.items[productIndexInCart].quantity += product_id.quantity;
                }

                // If product is not in cart
                if (productIndexInCart == -1) {
                    // create object with product's properties
                    const addItemToCart = {
                        prod_id: product._id,
                        image: product.image,
                        productName: product.productName,
                        description: product.description,
                        price: product.price,
                        discount: product.discount,
                        discountedPrice: product.discountedPrice,
                        quantity: intialQuantity,
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
        const prod_id = req.body.prod_id;
        const user_id = req.authenticatedUser._id;
        const cart = await Cart.findOne({ cartOwner: user_id });
        if (cart) {
            const indexOfItemInCart = cart.items.findIndex((item) => {
                return item.prod_id == prod_id;
            });
            if (indexOfItemInCart != 1) {
                if (cart.items[indexOfItemInCart].quantity == 1) {
                    cart.items.splice(indexOfItemInCart, 1);
                }
                await cart.save();
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
        const quantity = req.body.quantity;
        const prod_id = req.body.prod_id;
        const user_id = req.authenticatedUser._id;
        const cart = await Cart.findOne({ cartOwner: user_id });

        if (cart) {
            const indexOfItemInCart = cart.items.findIndex((item) => {
                return item.prod_id == prod_id;
            });

            if (indexOfItemInCart != -1) {
                cart.items[indexOfItemInCart].quantity = quantity;
                // save updated quantity of item in cart
                await cart.save();
                return res.send("OK");
            }
            return res.sendStatus(404);
        }
        return res.sendStatus(404);
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

export const getItemDetails = async (req: Request, res: Response) => {
    try {
        const prod_id = req.body.prod_id;
        const user_id = req.authenticatedUser._id;
        const cart = await Cart.findOne({ cartOwner: user_id });

        if (cart) {
            const indexOfItemInCart = cart.items.findIndex((item) => {
                return item.prod_id == prod_id;
            });

            if (indexOfItemInCart != -1) {
                return res.send(cart.items[indexOfItemInCart]);
            }
        }
        return res.send("item not in cart");
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};
