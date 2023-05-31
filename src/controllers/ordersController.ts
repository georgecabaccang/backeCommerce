import { NextFunction, Request, Response } from "express";
import Cart from "../models/cartModel";
import OrderList from "../models/orderListModel";

export const placeOrder = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const userCart = await Cart.findOne({ cartOwner: user_id });
        const userOrders = await OrderList.findOne({ ordersOwner: user_id });

        const items = req.body.toPurchase.items;
        const totalAmountToPay = req.body.toPurchase.totalAmountToPay;

        if (userOrders && userCart) {
            const toBePushed = {
                items: items,
                totalAmount: totalAmountToPay,
            };
            userOrders.orders.push(toBePushed);
            await userOrders.save();

            for (const itemPurchased of items) {
                const indexOfItemInCart = userCart.items.findIndex((item) => {
                    return item.prod_id == itemPurchased.prod_id;
                });
                if (indexOfItemInCart != -1) {
                    userCart.items.splice(indexOfItemInCart, 1);
                } else {
                    break;
                }
            }
            await userCart.save();
            res.sendStatus(200);
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
            const indexOfOrder = orderList.orders.findIndex((order) => {
                return order._id == req.body.order_id;
            });

            if (indexOfOrder != -1) {
                orderList.orders[indexOfOrder].status = "cancelled";
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
