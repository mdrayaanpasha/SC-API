import mongoose from "mongoose";

// Schema to store URLs for products
const productUrlSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true, // product ID must be provided
        unique: true,   // optional: ensures one URL list per product
    },
    urls: {
        type: [String], // array of URLs
        required: true,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ProductUrlModel = mongoose.model("ProductUrl", productUrlSchema);

export default ProductUrlModel;
