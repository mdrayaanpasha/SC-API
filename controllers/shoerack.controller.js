import ShoeRackModel from "../dbModels/shoeRacks.js";
import productUrl from "../dbModels/productUrl.js";

class ShoeRackController {

  // GET /shoe-racks
  async getAllShoeRacks(req, res) {
    try {
      const data = await ShoeRackModel.find(
        {},
        {
          Sku: 1,
          "Sub Category": 1,
          Title: 1,
          "Mrp ": 1,
          "Selling Price ": 1,
          _id: 0
        }
      );

      return res.status(200).json({
        message: "ok",
        data
      });

    } catch (error) {
      console.error("getAllShoeRacks error:", error);

      return res.status(500).json({
        message: "Failed to fetch shoe racks"
      });
    }
  }

  // POST /shoe-racks/sku
  async getShoeRackBySku(req, res) {
    const { Sku: sku } = req.body;

    if (!sku) {
      return res.status(400).json({
        message: "Product SKU is required"
      });
    }

    try {
      const [shoeDetails, imageDoc] = await Promise.all([
        ShoeRackModel.findOne(
          { Sku: sku },
          { Description: 0 }
        ),
        productUrl.findOne({ "Product ID": sku })
      ]);

      if (!shoeDetails) {
        return res.status(404).json({
          message: `No product found for SKU: ${sku}`
        });
      }

      return res.status(200).json({
        message: "ok",
        shoe: shoeDetails,
        images: imageDoc ? imageDoc["Image URLs"] : []
      });

    } catch (error) {
      console.error("getShoeRackBySku error:", error);

      return res.status(500).json({
        message: "Failed to fetch shoe rack details"
      });
    }
  }
}

export default new ShoeRackController();
