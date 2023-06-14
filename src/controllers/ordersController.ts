import { NextFunction, Request, Response } from "express";
import Cart from "../models/cartModel";
import OrderList from "../models/orderListModel";
import Product from "../models/productModel";
import { ObjectId } from "mongodb";

interface IItemDetails {
    prod_id: string;
    image: string;
    productName: string;
    price: number;
    discount: number;
    discountedPrice: number;
    quantity: number;
}

export const placeOrder = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const userCart = await Cart.findOne({ cartOwner: user_id });
        const userOrders = await OrderList.findOne({ ordersOwner: user_id });

        const items: Array<IItemDetails> = req.body.toPurchase.items;
        const totalAmountToPay = req.body.toPurchase.totalAmountToPay;

        if (userOrders && userCart) {
            // Check if client side and database side prices match
            let samePrices = true;
            let outOfStockProduct = "";
            for (let i = 0; i < items.length; i++) {
                const productInDB = await Product.findById(items[i].prod_id);
                const itemInOrder = items[0];

                if (productInDB) {
                    const priceMatch = itemInOrder.price === productInDB.price;
                    const discountMatch = itemInOrder.discount === productInDB.discount;
                    const discountedPriceMatch =
                        itemInOrder.discountedPrice === productInDB.discountedPrice;
                    const inStock = productInDB.stock != 0;

                    if (!inStock) {
                        outOfStockProduct = itemInOrder.productName;
                        break;
                    }
                    if (!priceMatch || !discountMatch || !discountedPriceMatch) {
                        samePrices = false;
                        break;
                    }
                } else {
                    return res.send(`product with ID: ${items[i].prod_id} not found`);
                }
            }

            if (outOfStockProduct) {
                return res.send(`${outOfStockProduct} is out of stock`);
            }
            if (!samePrices) {
                return res.send("some items' prices don't match");
            }

            const toBePushed = {
                items: items,
                totalAmount: totalAmountToPay,
            };
            userOrders.orders.push(toBePushed);
            await userOrders.save();

            for (const itemPurchased of items) {
                const indexOfItemInCart = userCart.items.findIndex((item) => {
                    return item.prod_id?.toString() == itemPurchased.prod_id;
                });
                if (indexOfItemInCart != -1) {
                    userCart.items.splice(indexOfItemInCart, 1);
                } else {
                    break;
                }
            }
            await userCart.save();
            res.send("OK");
        }
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const orders = await OrderList.findOne({ ordersOwner: user_id });
        return res.send(orders);
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const orderList = await OrderList.findOne({ ordersOwner: user_id });

        if (orderList) {
            const indexOfOrderInOrders = orderList.orders.findIndex((order) => {
                return order._id == req.body.order_id;
            });

            if (indexOfOrderInOrders != -1) {
                orderList.orders[indexOfOrderInOrders].status = "cancelled";
                await orderList.save();
                return res.sendStatus(200);
            }
            return res.sendStatus(404);
        }
        return res.sendStatus(404);
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

export const updateOrderStatusToReceived = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const orderList = await OrderList.findOne({ ordersOwner: user_id });

        if (orderList) {
            const indexOfOrderInOrders = orderList.orders.findIndex((order) => {
                return order._id == req.body.order_id;
            });
            if (indexOfOrderInOrders != -1) {
                const orderItems = orderList.orders[indexOfOrderInOrders].items;
                for (let i = 0; i < orderItems.length; i++) {
                    const product = await Product.findById(orderItems[i].prod_id);
                    if (product) {
                        product.salesCount! += orderItems[i].quantity;
                        product.stock! -= orderItems[i].quantity;
                        await product.save();
                    }
                }
                orderList.orders[indexOfOrderInOrders].status = "received";
                await orderList.save();
                return res.sendStatus(200);
            }
            return res.sendStatus(404);
        }
        return res.sendStatus(404);
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

export const getOrderDetails = async (req: Request, res: Response) => {
    try {
        const order_id = req.params.order_id;
        const user_id = req.authenticatedUser._id;
        const orderList = await OrderList.findOne({ ordersOwner: user_id });

        if (orderList) {
            const orderIndex = orderList.orders.findIndex((order) => {
                return order._id == order_id;
            });
            if (orderIndex != -1) {
                const orderDetails = orderList.orders[orderIndex];
                return res.send(orderDetails);
            }
            return res.send("order not found");
        }
        return res.sendStatus(404);
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};
