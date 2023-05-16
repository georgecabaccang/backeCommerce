import { Request, Response } from "express";
import Cart from "../models/cartModel";
import { IItemModel } from "../types/ItemModel";
import Product from "../models/productModel";
import CheckOut from "../models/checkOutModel";

export const getUserCart = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        if (user_id) {
            const cartOfUser = await Cart.findOne({ cartOwner: user_id });
            return res.send(cartOfUser?.items);
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
                        price: product.price,
                        image: product.image,
                        stock: product.stock,
                        discount: product.discount,
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

export const addToCheckOut = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const itemToCheckOut = req.body.itemToCheckOut;

        const userCart = await Cart.findOne({ cartOwner: user_id });
        const checkOutInstance = await CheckOut.findOne({
            cart_id: userCart?._id,
        });

        if (!checkOutInstance) {
            const newCheckOut = new CheckOut({
                items: [itemToCheckOut],
                totalAmountToPay: itemToCheckOut.price * itemToCheckOut.quantity,
                cart_id: userCart?._id,
            });
            await newCheckOut.save();
            return res.sendStatus(200);
        }

        if (checkOutInstance) {
            const indexOfItemInCheckOutInstance = checkOutInstance.items.findIndex((item) => {
                return item.prod_id === itemToCheckOut.prod_id;
            });

            if (indexOfItemInCheckOutInstance != -1) {
                checkOutInstance.items[indexOfItemInCheckOutInstance].quantity =
                    itemToCheckOut.quantity;

                // !!!!!!!!!!!!!!!!!! CHECK IF STILL NEED SECOND INSTANCE
                await checkOutInstance.save();

                const checkOutInstanceTwo = await CheckOut.findOne({
                    cart_id: userCart?._id,
                });

                if (checkOutInstanceTwo) {
                    let newTotalAmountToPay: number = 0;
                    checkOutInstanceTwo.items.forEach((item) => {
                        if (item.price && item.quantity)
                            newTotalAmountToPay += item.price * item.quantity;
                    });
                    checkOutInstance.totalAmountToPay = newTotalAmountToPay;
                }
            }

            if (indexOfItemInCheckOutInstance == -1) {
                checkOutInstance.items.push(itemToCheckOut);
                checkOutInstance.totalAmountToPay += itemToCheckOut.price * itemToCheckOut.quantity;
            }

            await checkOutInstance.save();
            return res.sendStatus(200);
        }
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

export const getToCheckOutItems = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const userCart = await Cart.findOne({ cartOwner: user_id });

        const toCheckOutItems = await CheckOut.findOne({ cart_id: userCart?._id });
        if (toCheckOutItems) {
            return res.send(toCheckOutItems);
        }
        return res.send("no items to check out found");
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};
