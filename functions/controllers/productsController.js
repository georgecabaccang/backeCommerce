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
exports.getUserProducts = exports.searchProducts = exports.getProductDetails = exports.deleteProduct = exports.updateProductDetails = exports.createProduct = exports.getProducts = void 0;
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
const updateProductDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = req.authenticatedUser._id;
        const prod_id = req.body.updatedProductDetails.prod_id;
        const updatedProductDetails = req.body.updatedProductDetails;
        const productToBeUpdated = yield productModel_1.default.findById(prod_id);
        if (productToBeUpdated) {
            if (((_a = productToBeUpdated.postedBy) === null || _a === void 0 ? void 0 : _a.toString()) == user_id) {
                productToBeUpdated.image = updatedProductDetails.image;
                productToBeUpdated.productName = updatedProductDetails.productName;
                productToBeUpdated.description = updatedProductDetails.description;
                productToBeUpdated.price = updatedProductDetails.price;
                productToBeUpdated.discount = updatedProductDetails.discount;
                productToBeUpdated.discountedPrice =
                    updatedProductDetails.price * (1 - updatedProductDetails.discount);
                productToBeUpdated.stock = updatedProductDetails.stock;
                yield productToBeUpdated.save();
                return res.send(productToBeUpdated);
            }
            return res.send("you're not the poster of this product");
        }
        return res.send("product not found");
    }
    catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
});
exports.updateProductDetails = updateProductDetails;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const user_id = req.authenticatedUser._id;
        const prod_id = req.params.prod_id;
        const productToBeDeleted = yield productModel_1.default.findById(prod_id);
        if (productToBeDeleted) {
            if (((_b = productToBeDeleted.postedBy) === null || _b === void 0 ? void 0 : _b.toString()) == user_id) {
                yield productModel_1.default.deleteOne({ _id: prod_id });
                return res.sendStatus(200);
            }
            return res.sendStatus(403);
        }
        return res.sendStatus(404);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
});
exports.deleteProduct = deleteProduct;
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
