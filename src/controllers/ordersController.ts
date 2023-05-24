import { NextFunction, Request, Response } from "express";
import Cart from "../models/cartModel";
import OrderList from "../models/orderListModel";

export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = req.authenticatedUser._id;
        const userCart = await Cart.findOne({ cartOwner: user_id });
        const userOrders = await OrderList.findOne({ ordersOwner: user_id });

        if (userOrders) {
            const toBePushed = {
                items: req.body.items,
                totalAmount: req.body.totalAmountToPay,
            };

            userOrders.orders.push(toBePushed);
            await userOrders.save();
            next();
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
        const orders = await OrderList.findOne({ ordersOwner: user_id });
        if (orders) {
            const indexOfOrder = orders.orders.findIndex((order) => {
                return order._id == req.body.order_id;
            });

            if (indexOfOrder != -1) {
                orders.orders.splice(indexOfOrder, 1);
                await orders.save();
                return res.sendStatus(200);
            }
            return res.sendStatus(404);
        }
        return res.sendStatus(404);
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};
