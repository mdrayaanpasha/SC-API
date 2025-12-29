import express from "express";
import cartController from "../controllers/cart.controller.js";

class CartRouter {
  constructor() {
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post("/add", cartController.addToCart);
    this.router.post("/", cartController.getCart);
    this.router.post("/itemDetails", cartController.getItemForCart);
    this.router.post("/getMyOrders", cartController.getMyOrders);
    this.router.put("/", cartController.updateCart);
  }
}

export default new CartRouter().router;
