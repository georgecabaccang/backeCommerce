"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderListSchema = new mongoose_1.Schema({
    orders: [
        {
            items: [{ prod_id: String, productName: String, quantity: Number, price: Number }],
            totalAmount: Number,
        },
    ],
    ordersOwner: { type: mongoose_1.Types.ObjectId, ref: "User" },
}, { timestamps: true });
const OrderList = (0, mongoose_1.model)("OrderList", orderListSchema);
exports.default = OrderList;
