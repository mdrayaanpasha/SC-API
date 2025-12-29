import jwt from "jsonwebtoken";
import cartModel from "../dbModels/cart.js";
import SofaModel from "../dbModels/sofa.js";
import ShoeRackModel from "../dbModels/shoeRacks.js";
import DashBoardModel from "../dbModels/Dashboard.js";

class CartController {

  constructor() {
    this.addToCart = this.addToCart.bind(this);
    this.getCart = this.getCart.bind(this);
    this.getItemForCart = this.getItemForCart.bind(this);
    this.getMyOrders = this.getMyOrders.bind(this);
    this.updateCart = this.updateCart.bind(this);
  }

  extractEmailFromToken(token) {
    const JWT_SECRET = process.env.JWT_SECRET;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded.email;
    } catch (error) {
      console.error("JWT Verification failed:", error.message);
      return null;
    }
  }

  // 1. ADD ITEM TO CART
  async addToCart(req, res) {
    const { token, Sku: sku } = req.body;
    if (!token) return res.status(401).json({ message: "Authentication token required." });

    const email = this.extractEmailFromToken(token);
    if (!email) return res.status(401).json({ message: "Invalid or expired token." });

    try {
      const cart = await cartModel.findOne({ Email: email });

      if (cart) {
        const Skus = cart.Skus || [];
        if (!Skus.includes(sku)) {
          cart.Skus = [...Skus, sku];
          await cart.save();
          return res.json({ message: "done" });
        } else {
          return res.json({ message: "there" });
        }
      } else {
        await cartModel.create({ Email: email, Skus: [sku] });
        return res.json({ message: "done" });
      }
    } catch (err) {
      console.error("Error adding item to cart:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  // 2. GET CART CONTENTS
  async getCart(req, res) {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Authentication token required." });

    const email = this.extractEmailFromToken(token);
    if (!email) return res.status(401).json({ message: "Invalid or expired token." });

    try {
      const cart = await cartModel.findOne({ Email: email });
      res.json({ message: "ok", Da: cart || { Skus: [] } });
    } catch (err) {
      console.error("Error fetching cart:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  // 3. GET ITEM DETAILS FOR CART
  async getItemForCart(req, res) {
    const { Sku } = req.body;
    if (!Sku) return res.status(400).json({ message: "Sku is required." });

    try {
      const sofaItem = await SofaModel.findOne({ Sku },{Description:0,Color:0,Material:0,size:0,"Similar Sku":0});
      if (sofaItem) return res.json({ Message: "done", Da: sofaItem });

      const shoeRackItem = await ShoeRackModel.findOne({ Sku });
      if (shoeRackItem) return res.json({ Message: "done", Da: shoeRackItem });

      res.status(404).json({ Message: "item not found!" });
    } catch (err) {
      console.error("Error fetching item for cart:", err);
      res.status(500).json({ Message: "Internal server error." });
    }
  }

  // 4. GET MY ORDERS
  async getMyOrders(req, res) {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Authentication token required." });

    const email = this.extractEmailFromToken(token);
    if (!email) return res.status(401).json({ message: "Invalid or expired token." });

    try {
      const orders = await DashBoardModel.find({ "Costumer Email": email });
      res.json({ Orders: orders, message: true });
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ message: false, error: "Internal server error" });
    }
  }

  // 5. UPDATE CART
  async updateCart(req, res) {
    const { token, Arr: skuArray } = req.body;
    if (!token) return res.status(401).json({ message: "Authentication token required." });
    if (!Array.isArray(skuArray)) return res.status(400).json({ message: "Arr must be an array of SKUs." });

    const email = this.extractEmailFromToken(token);
    if (!email) return res.status(401).json({ message: "Invalid or expired token." });

    try {
      await cartModel.updateOne({ Email: email }, { $set: { Skus: skuArray } });
      res.json({ message: "Cart updated successfully." });
    } catch (err) {
      console.error("Error updating cart:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}

export default new CartController();
