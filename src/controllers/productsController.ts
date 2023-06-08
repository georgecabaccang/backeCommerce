import { Response, Request } from "express";
import Product from "../models/productModel";
import User from "../models/userModel";

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

export const createProduct = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const user = await User.findById(user_id);
        if (user?.isSeller) {
            const product = req.body.product;
            const discountedPrice = product.price - product.price * (1 - product.discount);
            const newProduct = new Product({
                productName: product.productName,
                description: product.description,
                price: product.price,
                discount: product.discount,
                discountedPrice: discountedPrice,
                stock: product.stock,
                image: product.image,
                postedBy: user_id,
            });

            await newProduct.save();
            return res.send("product created");
        }
        return res.send("user not seller");
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

export const getUserProducts = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const userProducts = await Product.find({ postedBy: user_id });
        if (userProducts.length != 0) {
            return res.send(userProducts);
        }
        return res.send("no posted products");
    } catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
};
