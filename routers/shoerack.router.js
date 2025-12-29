import express from "express";
import shoerackController from "../controllers/shoerack.controller.js";

const shoerackRouter = express.Router();

// GET all shoe racks
shoerackRouter.get(
  "/",
  (req, res) => shoerackController.getAllShoeRacks(req, res)
);

// POST get shoe rack by SKU
shoerackRouter.post(
  "/sku",
  (req, res) => shoerackController.getShoeRackBySku(req, res)
);

export default shoerackRouter;
