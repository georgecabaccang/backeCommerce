"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRoutes = express_1.default.Router();
const productsController_1 = require("../controllers/productsController");
const authentication_1 = require("../security/authentication");
productRoutes.get("/", productsController_1.getProducts);
productRoutes.get("/product/:_id", productsController_1.getProductDetails);
productRoutes.post("/add-product", authentication_1.authToken, productsController_1.createProduct);
productRoutes.post("/my-products", authentication_1.authToken, productsController_1.getUserProducts);
productRoutes.post("/search-products", productsController_1.searchProducts);
productRoutes.patch("/update-my-product", authentication_1.authToken, productsController_1.updateProductDetails);
productRoutes.post("/:prod_id/delete", authentication_1.authToken, productsController_1.deleteProduct);
exports.default = productRoutes;
