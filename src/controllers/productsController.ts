import { RequestHandler } from "express";
import { Response, Request } from "express";
import Product from "../models/productModel";

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
        const product = req.body;
        const newProduct = new Product({
            productName: product.productName,
            price: product.price,
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
