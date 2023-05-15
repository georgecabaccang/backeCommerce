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
exports.createCart = exports.getProductDetails = exports.addProducts = exports.getProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
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
            description: product.description,
            price: product.price,
            discount: product.discount,
            stock: product.stock,
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
// JUST FOR CREATE A TEMP CART
const createCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCart = new cartModel_1.default({
            items: [],
        });
        yield newCart.save();
        res.send(newCart);
    }
    catch (error) { }
});
exports.createCart = createCart;
