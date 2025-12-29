import SofaModel from "../dbModels/sofa.js";
import productUrl from "../dbModels/productUrl.js";

class SofaController {

  // GET /sofas
  async getAllSofas(req, res) {
    try {
      const sofas = await SofaModel.find(
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
        data: sofas
      });

    } catch (error) {
      console.error("getAllSofas error:", error);

      return res.status(500).json({
        message: "Failed to fetch sofas"
      });
    }
  }

  // POST /sofa
  async getSofaBySku(req, res) {
    const { Sku: sku } = req.body;

    if (!sku) {
      return res.status(400).json({
        message: "Product SKU is required"
      });
    }

    try {
      const [sofaDetails, imageDoc] = await Promise.all([
        SofaModel.findOne(
          { Sku: sku },
          { Description: 0 }
        ),
        productUrl.findOne({ "Product ID": sku })
      ]);

      if (!sofaDetails) {
        return res.status(404).json({
          message: `No product found for SKU: ${sku}`
        });
      }

      return res.status(200).json({
        message: "ok",
        sofa: sofaDetails,
        images: imageDoc ? imageDoc["Image URLs"] : []
      });

    } catch (error) {
      console.error("getSofaBySku error:", error);

      return res.status(500).json({
        message: "Failed to fetch sofa details"
      });
    }
  }

 
}

export default new SofaController();
