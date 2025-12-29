import express from "express";
import adminController from "../controllers/admin.controller.js";

class AdminDashboardRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/orders/create", adminController.createOrder);
    this.router.get("/orders", adminController.getAllOrders);
    this.router.post("/orders/mark-inactive", adminController.markOrderAsInactive);
    this.router.post("/orders/delete-cancelled", adminController.deleteCancelledOrder);
    this.router.post("/orders/cancel", adminController.cancelOrder);
    this.router.get("/orders/cancelled", adminController.getCancelledOrders);
  }
}

export default new AdminDashboardRouter().router;
