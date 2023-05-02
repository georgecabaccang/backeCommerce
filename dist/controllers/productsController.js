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
exports.getProductDetails = exports.addProducts = exports.getProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.find();
        res.send(product);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
});
exports.getProducts = getProducts;
const addProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        const newProduct = new productModel_1.default({
            productName: product.productName,
            price: product.price,
            image: product.image,
        });
        yield newProduct.save();
        res.send(newProduct);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
});
exports.addProducts = addProducts;
const getProductDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params._id;
        const product = yield productModel_1.default.findById(productId);
        res.send(product);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
});
exports.getProductDetails = getProductDetails;
