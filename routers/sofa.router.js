import express from "express";
import sofaController from "../controllers/sofa.controller.js";

const sofaRouter = express.Router();

// GET all sofas
sofaRouter.get(
  "/",
  (req, res) => sofaController.getAllSofas(req, res)
);

// POST get sofa by SKU
sofaRouter.post(
  "/sku",
  (req, res) => sofaController.getSofaBySku(req, res)
);



export default sofaRouter;
