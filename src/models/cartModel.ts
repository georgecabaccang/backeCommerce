import { Schema, model } from "mongoose";

const cartSchema = new Schema(
    {
        items: [
            {
                prod_id: { type: Schema.Types.ObjectId, ref: "Product" },
                image: String,
                productName: String,
                description: String,
                price: Number,
                discount: Number,
                discountedPrice: Number,
                quantity: Number,
            },
        ],
        cartOwner: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const Cart = model("Cart", cartSchema);
export default Cart;
