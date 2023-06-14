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
exports.getUserProducts = exports.searchProducts = exports.getProductDetails = exports.createProduct = exports.getProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.find().where("stock").gt(0);
        res.send(product);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const user = yield userModel_1.default.findById(user_id);
        if (user === null || user === void 0 ? void 0 : user.isSeller) {
            const product = req.body.product;
            const discountedPrice = product.price * (1 - product.discount);
            const newProduct = new productModel_1.default({
                productName: product.productName,
                description: product.description,
                price: product.price,
                discount: product.discount,
                discountedPrice: discountedPrice,
                stock: product.stock,
                image: product.image,
                postedBy: user_id,
            });
            yield newProduct.save();
            return res.send("product created");
        }
        return res.send("user not seller");
    }
    catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
});
exports.createProduct = createProduct;
const getProductDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prod_id = req.params._id;
        const product = yield productModel_1.default.findById(prod_id);
        res.send(product);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
});
exports.getProductDetails = getProductDetails;
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.body.query;
        const products = yield productModel_1.default.find({ productName: { $regex: query, $options: "i" } })
            .where("stock")
            .gt(0);
        res.send(products);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
});
exports.searchProducts = searchProducts;
const getUserProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const userProducts = yield productModel_1.default.find({ postedBy: user_id });
        if (userProducts.length != 0) {
            return res.send(userProducts);
        }
        return res.send("no posted products");
    }
    catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
});
exports.getUserProducts = getUserProducts;
