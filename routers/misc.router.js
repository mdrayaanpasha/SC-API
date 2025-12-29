import express from "express";
import miscController from "../controllers/misc.controller.js";

const miscRouter = express.Router();

// Get related products for product page
miscRouter.post(
  "/getRelatedProductData",
  (req, res) => miscController.getRelatedProducts(req, res)
);

export default miscRouter;
