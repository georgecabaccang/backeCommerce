"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    items: [
        {
            prod_id: String,
            image: String,
            productName: String,
            price: Number,
            discount: Number,
            discountedPrice: Number,
            quantity: Number,
        },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "pending" },
}, { timestamps: true });
const Order = (0, mongoose_1.model)("Order", orderSchema);
exports.default = Order;
