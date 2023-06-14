"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderDetails = exports.updateOrderStatusToReceived = exports.cancelOrder = exports.getOrders = exports.placeOrder = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const orderListModel_1 = __importDefault(require("../models/orderListModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const userCart = yield cartModel_1.default.findOne({ cartOwner: user_id });
        const userOrders = yield orderListModel_1.default.findOne({ ordersOwner: user_id });
        const items = req.body.toPurchase.items;
        const totalAmountToPay = req.body.toPurchase.totalAmountToPay;
        if (userOrders && userCart) {
            // Check if client side and database side prices match
            let samePrices = true;
            let outOfStockProduct = "";
            for (let i = 0; i < items.length; i++) {
                const productInDB = yield productModel_1.default.findById(items[i].prod_id);
                const itemInOrder = items[0];
                if (productInDB) {
                    const priceMatch = itemInOrder.price === productInDB.price;
                    const discountMatch = itemInOrder.discount === productInDB.discount;
                    const discountedPriceMatch = itemInOrder.discountedPrice === productInDB.discountedPrice;
                    const inStock = productInDB.stock != 0;
                    if (!inStock) {
                        outOfStockProduct = itemInOrder.productName;
                        break;
                    }
                    if (!priceMatch || !discountMatch || !discountedPriceMatch) {
                        samePrices = false;
                        break;
                    }
                }
                else {
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
            yield userOrders.save();
            for (const itemPurchased of items) {
                const indexOfItemInCart = userCart.items.findIndex((item) => {
                    var _a;
                    return ((_a = item.prod_id) === null || _a === void 0 ? void 0 : _a.toString()) == itemPurchased.prod_id;
                });
                if (indexOfItemInCart != -1) {
                    userCart.items.splice(indexOfItemInCart, 1);
                }
                else {
                    break;
                }
            }
            yield userCart.save();
            res.send("OK");
        }
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.placeOrder = placeOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const orders = yield orderListModel_1.default.findOne({ ordersOwner: user_id });
        return res.send(orders);
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.getOrders = getOrders;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const orderList = yield orderListModel_1.default.findOne({ ordersOwner: user_id });
        if (orderList) {
            const indexOfOrderInOrders = orderList.orders.findIndex((order) => {
                return order._id == req.body.order_id;
            });
            if (indexOfOrderInOrders != -1) {
                orderList.orders[indexOfOrderInOrders].status = "cancelled";
                yield orderList.save();
                return res.sendStatus(200);
            }
            return res.sendStatus(404);
        }
        return res.sendStatus(404);
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.cancelOrder = cancelOrder;
const updateOrderStatusToReceived = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const orderList = yield orderListModel_1.default.findOne({ ordersOwner: user_id });
        if (orderList) {
            const indexOfOrderInOrders = orderList.orders.findIndex((order) => {
                return order._id == req.body.order_id;
            });
            if (indexOfOrderInOrders != -1) {
                const orderItems = orderList.orders[indexOfOrderInOrders].items;
                for (let i = 0; i < orderItems.length; i++) {
                    const product = yield productModel_1.default.findById(orderItems[i].prod_id);
                    if (product) {
                        product.salesCount += orderItems[i].quantity;
                        product.stock -= orderItems[i].quantity;
                        yield product.save();
                    }
                }
                orderList.orders[indexOfOrderInOrders].status = "received";
                yield orderList.save();
                return res.sendStatus(200);
            }
            return res.sendStatus(404);
        }
        return res.sendStatus(404);
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.updateOrderStatusToReceived = updateOrderStatusToReceived;
const getOrderDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order_id = req.params.order_id;
        const user_id = req.authenticatedUser._id;
        const orderList = yield orderListModel_1.default.findOne({ ordersOwner: user_id });
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
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.getOrderDetails = getOrderDetails;
