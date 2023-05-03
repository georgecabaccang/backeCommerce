"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose_1.Schema({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    productID: { type: String, required: true },
});
const Item = (0, mongoose_1.model)("Item", itemSchema);
exports.default = Item;
