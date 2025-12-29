import DashBoardModel from "../dbModels/Dashboard.js";
import CancelModel from "../dbModels/cancelModel.js";

class AdminDashboardController {
  constructor() {
    // Bind methods to preserve `this`
    this.createOrder = this.createOrder.bind(this);
    this.getAllOrders = this.getAllOrders.bind(this);
    this.markOrderAsInactive = this.markOrderAsInactive.bind(this);
    this.deleteCancelledOrder = this.deleteCancelledOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.getCancelledOrders = this.getCancelledOrders.bind(this);
  }

  // Create a new order in dashboard
  async createOrder(req, res) {
    const { orderData } = req.body;
    if (!orderData) return res.status(400).json({ message: "Order data is required" });

    try {
      const newOrder = await DashBoardModel.create(orderData);
      res.json({ success: true, orderId: newOrder._id });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get all orders in dashboard
  async getAllOrders(req, res) {
    try {
      const orders = await DashBoardModel.find();
      res.json({ success: true, orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Mark an order as inactive (Admin false)
  async markOrderAsInactive(req, res) {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "orderId is required" });

    try {
      await DashBoardModel.updateOne({ _id: orderId }, { $set: { Admin: false } });
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking order inactive:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Delete a cancelled order
  async deleteCancelledOrder(req, res) {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "orderId is required" });

    try {
      await CancelModel.deleteOne({ _id: orderId });
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting cancelled order:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Cancel an order (move from dashboard to cancelled collection)
  async cancelOrder(req, res) {
    const { orderData } = req.body;
    if (!orderData || !orderData["Costumer Id"]) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    orderData.Admin = true;

    try {
      await CancelModel.create(orderData);
      await DashBoardModel.deleteOne({ _id: orderData._id });
      res.json({ success: true });
    } catch (error) {
      console.error("Error cancelling order:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get all cancelled orders
  async getCancelledOrders(req, res) {
    try {
      const cancelledOrders = await CancelModel.find();
      res.json({ success: true, cancelledOrders });
    } catch (error) {
      console.error("Error fetching cancelled orders:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new AdminDashboardController();
