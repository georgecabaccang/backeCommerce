import { Response, Request } from "express";
import Product from "../models/productModel";
import { IProductModel } from "../types/ProductModel";
import Cart from "../models/cartModel";
import { ICartModel } from "../types/CartModel";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const product = await Product.find();
        res.send(product);
    } catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
};

export const addProducts = async (req: Request, res: Response) => {
    try {
        const product: IProductModel = req.body;
        const newProduct = new Product({
            productName: product.productName,
            description: product.description,
            price: product.price,
            discount: product.discount,
            stock: product.stock,
            image: product.image,
        });

        await newProduct.save();
        res.send(newProduct);
    } catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
};

export const getProductDetails = async (req: Request, res: Response) => {
    try {
        const prod_id = req.params._id;
        const product = await Product.findById(prod_id);
        res.send(product);
    } catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
};

export const searchProducts = async (req: Request, res: Response) => {
    try {
        const query = req.body.query;
        const products = await Product.find({ productName: { $regex: query, $options: "i" } });
        res.send(products);
    } catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
};
