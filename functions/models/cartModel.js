"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    items: [
        {
            prod_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product" },
            image: String,
            productName: String,
            description: String,
            price: Number,
            discount: Number,
            discountedPrice: Number,
            quantity: Number,
        },
    ],
    cartOwner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
const Cart = (0, mongoose_1.model)("Cart", cartSchema);
exports.default = Cart;
