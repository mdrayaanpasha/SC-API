import mongoose from "mongoose";

const productUrlSchema = new mongoose.Schema(
  {
    // 1. Field name matches "Product ID" exactly
    "Product ID": {
      type: String,
      required: true,
      unique: true,
    },
    // 2. Field name matches "Image URLs" exactly
    "Image URLs": {
      type: [String],
      required: true,
    },
  },
  {
    // 3. This tells Mongoose to use the exact collection name "ProductUrl"
    collection: "ProductUrl", 
    timestamps: true,
  }
);

// This line correctly handles model creation/re-use for nodemon
export default mongoose.models.ProductUrl || mongoose.model("ProductUrl", productUrlSchema);