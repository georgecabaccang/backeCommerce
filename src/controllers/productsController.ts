import { Response, Request } from "express";
import Product from "../models/productModel";
import { IProductModel } from "../types/ProductModel";
import User from "../models/userModel";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const product = await Product.find().where("stock").gt(0);
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
            const product: IProductModel = req.body.product;
            const discountedPrice = product.price * (1 - product.discount);
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

export const updateProductDetails = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const prod_id = req.body.updatedProductDetails.prod_id;
        const updatedProductDetails = req.body.updatedProductDetails;
        const productToBeUpdated = await Product.findById(prod_id);
        if (productToBeUpdated) {
            if (productToBeUpdated.postedBy?.toString() == user_id) {
                productToBeUpdated.image = updatedProductDetails.image;
                productToBeUpdated.productName = updatedProductDetails.productName;
                productToBeUpdated.description = updatedProductDetails.description;
                productToBeUpdated.price = updatedProductDetails.price;
                productToBeUpdated.discount = updatedProductDetails.discount;
                productToBeUpdated.discountedPrice =
                    updatedProductDetails.price * (1 - updatedProductDetails.discount);
                productToBeUpdated.stock = updatedProductDetails.stock;

                await productToBeUpdated.save();
                return res.send(productToBeUpdated);
            }
            return res.send("you're not the poster of this product");
        }
        return res.send("product not found");
    } catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message });
        }
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const prod_id = req.params.prod_id;
        const productToBeDeleted = await Product.findById(prod_id);

        if (productToBeDeleted) {
            if (productToBeDeleted.postedBy?.toString() == user_id) {
                await Product.deleteOne({ _id: prod_id });
                return res.sendStatus(200);
            }
            return res.sendStatus(403);
        }
        return res.sendStatus(404);
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
        const products = await Product.find({ productName: { $regex: query, $options: "i" } })
            .where("stock")
            .gt(0);
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
