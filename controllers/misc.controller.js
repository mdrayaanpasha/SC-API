import SofaModel from "../dbModels/sofa.js";
import ShoeRackModel from "../dbModels/shoeRacks.js";

class miscController {

  // POST /related-products
  async getRelatedProducts(req, res) {
    const { Product: category } = req.body;

    if (!category) {
      return res.status(400).json({
        message: "Product category is required"
      });
    }

    let model;

    if (category === "Sofa") {
      model = SofaModel;
    } else if (category === "SR") {
      model = ShoeRackModel;
    } else {
      return res.status(400).json({
        message: "Invalid product category"
      });
    }

    try {
      const data = await model.aggregate([
        { $sample: { size: 20 } },
        {
          $project: {
            _id: 0,
            Sku: 1,
            Title: 1,
            "Sub Category": 1,
            "Selling Price ": 1,
            "Mrp ": 1
          }
        }
      ]);

      return res.status(200).json({
        message: "ok",
        data
      });

    } catch (error) {
      console.error("getRelatedProducts error:", error);

      return res.status(500).json({
        message: "Failed to fetch related products"
      });
    }
  }

  
}

export default new miscController();
