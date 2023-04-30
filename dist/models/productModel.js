"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
});
const Product = (0, mongoose_1.model)("Product", productSchema);
exports.default = Product;
