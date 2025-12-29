import mongoose from "mongoose";

import dotenv from 'dotenv';
dotenv.config();

//mongoDB models import.
import SofaModel from "../dbModels/sofa.js";
import userModel from "../dbModels/user.js";
import cartModel from "../dbModels/cart.js";
import ShoeRackModel from "../dbModels/shoeRacks.js";
import DashBoardModel from "../dbModels/Dashboard.js";
import CancelModel from "../dbModels/cancelModel.js";
import productUrl from "../dbModels/productUrl.js";

const MONGO_URI = process.env.MONGO_URI;

const startDB = async () => {
  try {
    // 1. Connect to the database and WAIT for it to succeed
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to the database! ✅");


  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1); // Exit the app if the connection fails
  }
};

export default startDB
