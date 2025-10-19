//boring modules to import!!
import express from "express";
import multer from "multer";
import path from "path";
import {
  fileURLToPath
}
from 'url';
import fs from "fs"
import nodemailer from "nodemailer"
import {
  ppid
}
from "process";

import mongoose from "mongoose";
import {
  Server
}
from "http";
import dotenv from 'dotenv';
dotenv.config();
//Mongo DB Config.
const MONGO_URI = process.env.MONGO_URI;

const PORT = process.env.PORT;
// --- Function to Start the Server ---
const startServer = async () => {
  try {
    // 1. Connect to the database and WAIT for it to succeed
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to the database! ✅");

    // 2. Only after a successful connection, start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1); // Exit the app if the connection fails
  }
};

// --- Call the function to start everything ---
startServer();

//mongoDB models import.
import SofaModel from "./dbModels/sofa.js";
import userModel from "./dbModels/user.js";
import cartModel from "./dbModels/cart.js";
import ShoeRackModel from "./dbModels/shoeRacks.js";
import DashBoardModel from "./dbModels/Dashboard.js";
import CancelModel from "./dbModels/cancelModel.js";
import productUrl from "./dbModels/productUrl.js";

//middle ware.
const app = express();
import cors from "cors";

app.use(cors({
  origin: "*", // allow requests from any origin (for dev/testing)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  '/public',
  express.static(
    path.join(__dirname, 'public')
  )
);
// Catch unhandled errors
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

const storage = multer.diskStorage(
  {
    destination:(req, file, cb) => {
      cb(null, 'public/img');
    },
    filename:(req, file, cb) => {
      const randomNumber = Math.floor(Math.random()*(999 - 100 + 1))+ 100;
      cb(null, randomNumber + file.fieldname + "-" + Date.now()+ path.extname(file.originalname));
    }
  }
);
const upload = multer(
  {
    storage: storage
  }
);
/*                                        ROUTING BITCHES!
                              So please note that you can find the apis by thier names using #<name> ps:no need of <>      */
//============================================================================================================================================================================================
// #TEST ROUTING
app.get(
  "/test",
  async(req, res) => {
    try {
      const D = await SofaModel.find(
        {
          "Sub Category": "1 Seater Sofa"
        }
      );
      res.send(
        {
          Data: D,
          message: "ok"
        }
      )
    }
    catch(error) {
      console.log(error)
    }
  }
)
//================================================================================================================================================================================================================================
// #SOFA - ROUTING.
app.get(
  '/getSofas',
  async(req, res) => {
    try {
      // Call function to get sofas from database
      const sofas = await SofaModel.find();
      res.send(
        {
          S: sofas,
          message: 'ok'
        }
      );
    }
    catch(error) {
      console.error(error);
      res.send(
        {
          message: 'not ok'
        }
      );
    }
  }
);
/*
this API is to get all sofa images!!
*/


app.post('/getS', async (req, res) => {

  try {

    const sku = req.body.Sku;


    // 1. Check if SKU was provided in the request

    if (!sku) {

      return res.status(400).send({ message: "Product SKU is required." });

    }


    // 2. Fetch both the sofa details and its image URLs from the database at the same time

    const [sofaDetails, imageDoc] = await Promise.all([

      SofaModel.findOne({ Sku: sku }),

      productUrl.findOne({ "Product ID": sku }) // Correctly query using 'productId'

    ]);
  


    // 3. Check if we found a product

    if (!sofaDetails) {

      return res.status(404).send({ message: `No data found for SKU: ${sku}` });

    }


    // 4. Send a clean response with product data and the image URLs

    res.status(200).send({

      message: "ok",

      sofa: sofaDetails,

      // If imageDoc exists, use its urls array; otherwise, return an empty array

      images: imageDoc ? imageDoc["Image URLs"] : []

    });

    

  } catch (error) {

    console.error("Error in /getS endpoint:", error);

    res.status(500).send({ message: "An internal server error occurred." });

  }

});

app.get("/new",(req,res)=>{
  res.status(200);
})


app.post('/sofaimg', async (req, res) => {
  try {
    const sku = req.body.sku; // Get SKU from request body

    // 1. Check if SKU was provided
    if (!sku) {
      return res.status(400).send({ message: "Product SKU is required." });
    }

    // 2. Fetch product details and image URLs from the database at the same time
    const imageDoc = await productUrl.findOne({ "Product ID": sku })
  



    // 3. Send the response
    res.status(200).send({
      message: "ok",
      // If imageDoc exists, use its "Image URLs" array; otherwise, return an empty array
      images: imageDoc ? imageDoc["Image URLs"] : []
    });

  } catch (error) {
    console.error("Error in /sofaimg endpoint:", error);
    res.status(500).send({ message: "An internal server error occurred." });
  }
});

//this route is the one where we take data for products below the product order page.
app.post(
  "/otherGetData",
  async(req, res) => {
    const subcat = req.body.PC;
    const cat = req.body.Product;
    try {
      if(cat === "Sofa") {
        const D = await SofaModel.aggregate(
          [
            {
              $sample: {
                size: 20
              }
            },
          ]
        );
        res.send(
          {
            Data: D,
            message: "ok"
          }
        )
      }
      else if(cat === "SR") {
        const D = await ShoeRackModel.aggregate(
          [
            {
              $sample: {
                size: 20
              }
            },
          ]
        );
        res.send(
          {
            Data: D,
            message: "ok"
          }
        )
      }
    }
    catch(error) {
      console.log(error)
      res.send(
        {
          message: "not ok"
        }
      )
    }
  }
)
app.get(
  "/3seatget",
  async(req, res) => {
    try {
      const D = await SofaModel.find(
        {
          "Sub Category": "3 Seater Sofa"
        }
      );
      res.send(
        {
          Data: D,
          message: "ok"
        }
      )
    }
    catch(error) {
      console.log(error)
      res.send(
        {
          message: "notok"
        }
      )
    }
  }
)
app.get(
  "/2seatget",
  async(req, res) => {
    try {
      const D = await SofaModel.find(
        {
          "Sub Category": "2 Seater Sofa"
        }
      );
      res.send(
        {
          Data: D,
          message: "ok"
        }
      )
    }
    catch(error) {
      console.log(error)
      res.send(
        {
          message: "notok"
        }
      )
    }
  }
)
app.get(
  "/1seatget",
  async(req, res) => {
    try {
      const D = await SofaModel.find(
        {
          "Sub Category": "1 Seater Sofa"
        }
      );
      res.send(
        {
          Data: D,
          message: "ok"
        }
      )
    }
    catch(error) {
      console.log(error)
      res.send(
        {
          message: "notok"
        }
      )
    }
  }
)
app.get(
  "/storageBGet",
  async(req, res) => {
    try {
      const D = await SofaModel.find(
        {
          "Sub Category": "Storage Bench"
        }
      );
      res.send(
        {
          Data: D,
          message: "ok"
        }
      )
    }
    catch(error) {
      console.log(error)
      res.send(
        {
          message: "notok"
        }
      )
    }
  }
)
app.get(
  "/Lget",
  async(req, res) => {
    try {
      const D = await SofaModel.find(
        {
          "Sub Category": "L Shape Sofa"
        }
      );
      res.send(
        {
          Data: D,
          message: "ok"
        }
      )
    }
    catch(error) {
      console.log(error)
      res.send(
        {
          message: "notok"
        }
      )
    }
  }
)
//============================================================================================================================================================================================
// # AUTHENTICATION - ROUTING.
app.post(
  "/reg",
  async(req, res) => {
    //here first check if a person with that email already exist?
    try {
      const d = await userModel.find(
        {
          email: req.body.email
        }
      )
      if(d.length > 0) {
        res.send(
          {
            message: "there"
          }
        )
      }
      else {
        const randomNumber = Math.floor(1000 + Math.random()* 9000);
        const transporter = nodemailer.createTransport(
          {
            host: "smtp.gmail.com",
            // Correct hostname for Gmail SMTP server
            port: 587,
            secure: false,
            // true for 465, false for other ports
            auth: {
              user: "mohdrayaanpasha@gmail.com",
              // your Gmail email
              pass: "dotv epql rczc xeap",
            },
          }
        );
        try {
          const info = await transporter.sendMail({
    from: '"Solace Craft" <noreply@solacecraft.com>',
    to: req.body.email,
    subject: `Your Key to Solace Craft, ${req.body.name}`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
      <style>
        body { margin: 0; padding: 0; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; width: 100%; background-color: #0a0a0a;">
      <div style="background-image: radial-gradient(circle at top, #1a1a1a 0%, #0a0a0a 100%); color: #f3f3f3; padding: 40px 20px; text-align: center;" class="font-sans">
          <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #27272a; border-radius: 24px; overflow: hidden; border-top: 4px solid #ca8a04;">
              <div style="padding: 40px 32px;">
                  <h1 style="letter-spacing: 0.1em; color: #ffffff; margin: 0;" class="font-serif">SOLACE CRAFT</h1>
                  <h2 style="font-size: 28px; color: #ffffff; margin: 40px 0 16px 0; font-weight: 700;" class="font-serif">Welcome, ${req.body.name.split(' ')[0]}.</h2>
                  <p style="font-size: 16px; color: #a1a1aa; line-height: 1.6; margin: 0;">Your journey into timeless design begins now. To unlock your account and explore our curated collections, please use the verification code below.</p>
                  <div style="margin: 32px 0;">
                      <p style="font-size: 48px; font-weight: 700; letter-spacing: 0.5em; color: #ffffff; margin: 0; background-color: #0a0a0a; padding: 20px; border-radius: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">${randomNumber}</p>
                  </div>
                  <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">
                      This code is valid for the next 10 minutes.
                  </p>
                  <p style="margin-top: 32px; font-size: 12px; color: #71717a;">
                      If you did not initiate this request, please disregard this email.
                  </p>
              </div>
              <div style="background-color: #18181b; padding: 20px; font-size: 12px; color: #71717a;">
                  &copy; ${new Date().getFullYear()} Solace Craft. All Rights Reserved.
              </div>
          </div>
      </div>
    </body>
    </html>
    `,
});


        }
        catch(error) {
          console.error("Error occurred:", error);
          return res.status(500).send("Failed to send email.");
        }
        res.send(
          {
            message: "notthere"
          }
        );
      }
    }
    catch(error) {
      console.error("Error occurred:", error);
      res.status(500).send("Internal server error.");
    }
  }
);
//if there send for login, else send otp and authenticate
app.post(
  "/confirmReg",
  async(req, res) => {
    try {
      await userModel.create(
        {
          email: req.body.email,
          name: req.body.name,
          phoneNo: req.body.number,
          Adress: req.body.shippingAddress,
          Password: req.body.password
        }
      )
      res.send(
        {
          message: "done"
        }
      )
    }
    catch(error) {
      res.send(
        {
          message: "notdone"
        }
      )
    }
  }
)
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

app.post("/register", async (req, res) => {
  try {
    const { email, name, password, address } = req.body;

    // Validate input
    if (!email || !name || !password || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await userModel.create({
      email,
      name,
      Password: hashedPassword,
      Adress:address,
      verifiedStatus:false
      
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" }
    );

    // Save token in user document
    newUser.token = token;
    await newUser.save();

    // Send welcome email (optional)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
          user: "mohdrayaanpasha@gmail.com",
              // your Gmail email
              pass: "dotv epql rczc xeap",
      },
    });

    const mailOptions = {
      from: '"Solace Craft" <noreply@solacecraft.com>',
      to: email,
      subject: `Welcome to Solace Craft, ${name}`,
      html: `
      <div style="font-family: 'Inter', sans-serif; background-color: #0a0a0a; color: #f3f3f3; padding: 40px;">
        <h1>Welcome, ${name.split(" ")[0]}!</h1>
        <p>Your Solace Craft account has been created successfully.</p>
        <a href="https://solacecraft.co.in/verify/${token}">Click To Verify</a>
      </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error("Email send error:", mailError);
      // Don't fail registration if email fails
    }

    // Respond success
    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");

    // Find user
    const user = await userModel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified." });

    // Mark as verified
    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token." });
  }
});



app.post(
  "/login",
  async(req, res) => {
    const E = req.body.Email 
    const P = req.body.Password 
    try {
      const data = await userModel.find(
        {
          email: E
        }
      );
      if(data.length > 0) {
        if(
          data [0]
          .Password === P
        )
        {
          res.send(
            {
              message: "Pass"
            }
          )
        }
        else {
          res.send(
            {
              message: "Fail"
            }
          )
        }
      }
      else {
        res.send(
          {
            message: "not"
          }
        )
      }
    }
    catch(error){}
  }
)
app.post(
  "/userInfo",
  async(req, res) => {
    const E = req.body.Email 
    try {
      const data = await userModel.find(
        {
          email: E
        }
      )
      res.send(
        {
          message: true,
          D: data
        }
      )
    }
    catch(error) {
      console.log(error)
      res.send(
        {
          message: false
        }
      )
    }
  }
)
//============================================================================================================================================================================================
// # CART & ORDER - ROUTING.
app.post(
  "/addcart",
  async(req, res) => {
    const E = req.body.Email;
    let Arr = [];
    // Initialize outside the try block
    try {
      const D = await cartModel.find(
        {
          Email: E
        }
      );
      if(D.length > 0) {
        const Existing = D[0].Skus;
        let there = false 
        for(let i = 0; i < Existing.length; i++) {
          if(Existing [i] === req.body.Sku) {
            there = true;
            break
          }
        }
        if(!there) {
          const mergedSkus = [...Existing, req.body.Sku];
          await cartModel.updateOne(
            {
              Email: E
            },
            {
              Skus: mergedSkus
            }
          );
          res.send(
            {
              message: "done"
            }
          )
        }
        else {
          res.send(
            {
              message: "there"
            }
          )
        }
      }
      else {
        Arr.push(req.body.Sku);
        await cartModel.create(
          {
            Email: E,
            Skus: Arr,
          }
        );
        res.send(
          {
            message: "done"
          }
        )
      }
    }
    catch(error) {
      console.error("Error adding item to cart:", error);
      res.status(500).send("Internal server error.");
    }
  }
);
app.post(
  "/CartGet",
  async(req, res) => {
    const E = req.body.Email;
    try {
      const D = await cartModel.find(
        {
          Email: E
        }
      )
      res.send(
        {
          message: "ok",
          Da: D [0]
        }
      )
    }
    catch(error) {
      res.send(
        {
          message: "notok"
        }
      )
      console.log(error)
    }
  }
)
app.post(
  "/Item4Cart",
  async(req, res) => {
    const S = req.body.Sku;
    try {
      const D = await SofaModel.find(
        {
          Sku: S
        }
      );
      if(D.length > 0) {
        res.send(
          {
            Message: "done",
            Da: D [0]
          }
        )
      }
      else {
        const a = await ShoeRackModel.find(
          {
            Sku: S
          }
        );
        if(a.length > 0) {
          res.send(
            {
              Message: "done",
              Da: a [0]
            }
          )
        }
        else {
          res.send(
            {
              Message: "item not found!"
            }
          )
          console.log("item not found!")
        }
      }
      // console.log(D)
    }
    catch(error) {
      console.log(error)
    }
  }
)
app.post(
  "/myordersget",
  async(req, res) => {
    const email = req.body.Email;
    // Use a consistent naming convention (lowercase `id`)
    if(!email) {
      return res.status(400).send(
        {
          message: "No customer ID provided"
        }
      );
    }
    try {
      const orders = await DashBoardModel.find(
        {
          "Costumer Email": email
        }
      );
      // Assuming the model field name is correct
      if(orders.length > 0) {
        res.send(
          {
            Orders: orders,
            message: true
          }
        )
      }
      else {
        res.send(
          {
            Orders: [],
            message: true
          }
        );
      }
      // Explicitly return an empty array if no orders are found
    }
    catch(error) {
      console.error("Error fetching orders:", error);
      // More descriptive logging
      res.status(500).send(
        {
          message: "Internal server error"
        }
      );
      // More informative error message
    }
  }
);
app.post(
  "/cartUpdate",
  async(req, res) => {
    const email = req.body.Email 
    const sku = req.body.Arr 
    try {
      await cartModel.updateOne(
        {
          Email: email
        },
        {
          $set: {
            Skus: sku
          }
        }
      );
    }
    catch(error) {
      console.log(error)
    }
  }
)
//============================================================================================================================================================================================
//#SHOERACK - ROUTING.
app.get(
  "/ShoeRacksget",
  async(req, res) => {
    try {
      const Data = await ShoeRackModel.find({});
      res.send(
        {
          message: "ok",
          D: Data
        }
      )
    }
    catch(error) {
      console.log(error)
      res.send(
        {
          message: "not ok"
        }
      )
    }
  }
)

app.post('/SRget', async (req, res) => {
  try {
    const sku = req.body.Sku;

    // 1. Validate input
    if (!sku) {
      return res.status(400).send({ message: "Product SKU is required." });
    }

    // 2. Fetch ShoeRack details and optionally a URL doc (if you have one)
    const [shoeDetails, imageDoc] = await Promise.all([
      ShoeRackModel.findOne({ Sku: sku }),
      productUrl.findOne({ "Product ID": sku }) // optional collection for URLs
    ]);

    // 3. Check if product exists
    if (!shoeDetails) {
      return res.status(404).send({ message: `No data found for SKU: ${sku}` });
    }

    // 4. Read image files from folder
    const folderPath = path.join(__dirname, `public/img/SR/${shoeDetails["Sub Category"]}/${sku}`);
    let imageFiles = [];
    try {
      const files = await fs.readdir(folderPath);
      // Only include actual files (ignore subfolders)
      imageFiles = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(folderPath, file);
          const stat = await fs.stat(filePath);
          return stat.isFile() ? file : null;
        })
      );
      // Remove nulls
      imageFiles = imageFiles.filter(Boolean);
    } catch (err) {
      console.warn("Error reading image folder:", err);
      imageFiles = [];
    }



    // 6. Send response
    res.status(200).send({
      message: "ok",
      shoe: shoeDetails,
      images: imageDoc ? imageDoc["Image URLs"] : imageUrls // prefer DB URLs if exist
    });

  } catch (error) {
    console.error("Error in /SRget endpoint:", error);
    res.status(500).send({ message: "An internal server error occurred." });
  }
});



app.get(
  "/seatSRget",
  async(req, res) => {
    try {
      const D = await ShoeRackModel.find(
        {
          "Sub Category": "Shoe Cabinet with Seat"
        }
      );
      res.send(
        {
          Data: D,
          message: "ok"
        }
      )
    }
    catch(error) {
      console.log(error)
      res.send(
        {
          message: "notok"
        }
      )
    }
  }
)
app.get(
  "/benchSRget",
  async(req, res) => {
    try {
      const D = await ShoeRackModel.find(
        {
          "Sub Category": "Shoe Cabinet Bench"
        }
      );
      res.send(
        {
          Data: D,
          message: "ok"
        }
      )
    }
    catch(error) {
      console.log(error)
      res.send(
        {
          message: "notok"
        }
      )
    }
  }
)
app.get(
  "/cabSRget",
  async(req, res) => {
    try {
      const D = await ShoeRackModel.find(
        {
          "Sub Category": "Shoe Cabinet"
        }
      );
      res.send(
        {
          Data: D,
          message: "ok"
        }
      )
    }
    catch(error) {
      console.log(error)
      res.send(
        {
          message: "notok"
        }
      )
    }
  }
)
app.get(
  "/cabSRget",
  async(req, res) => {
    try {
      const D = await ShoeRackModel.find(
        {
          "Sub Category": "Shoe Cabinet"
        }
      );
      res.send(
        {
          Data: D,
          message: "ok"
        }
      )
    }
    catch(error) {
      console.log(error)
      res.send(
        {
          message: "notok"
        }
      )
    }
  }
)
//================================================================================================================================================================================================
// #ADMIN & DASHBOARD - ROUTING
app.post(
  "/EnterDash",
  async(req, res) => {
    const Da = req.body.D;
    try {
      const s = await DashBoardModel.create(Da);
      res.send(
        {
          message: true,
          id: s._id
        }
      );
    }
    catch(error) {
      console.log(error);
      res.status(500).send(
        {
          message: false,
          error: error.message
        }
      );
      // Return a status and error message
    }
  }
);
app.get(
  "/getAdmin",
  async(req, res) => {
    try {
      const d = await DashBoardModel.find();
      res.send(
        {
          message: true,
          D: d
        }
      )
    }
    catch(error) {
      res.send(
        {
          message: false
        }
      )
      console.log(error)
    }
  }
)
app.post(
  "/delorder",
  async(req, res) => {
    const orderId = req.body.orderId;
    // Ensure the field name matches the one used in your React component
    try {
      // Update the order status (assuming "Admin" field indicates cancellation)
      const result = await DashBoardModel.updateOne(
        {
          _id: orderId
        },
        {
          $set: {
            Admin: false
          }
        }
      );
      res.send(
        {
          message: true
        }
      );
    }
    catch(error) {
      console.error(error);
      res.send(
        {
          message: false
        }
      );
    }
  }
);
app.post(
  "/delCancel",
  async(req, res) => {
    const orderId = req.body.orderId;
    // Ensure the field name matches the one used in your React component
    try {
      // Update the order status (assuming "Admin" field indicates cancellation)
      await CancelModel.deleteOne(
        {
          _id: orderId
        }
      );
      res.send(
        {
          message: true
        }
      );
    }
    catch(error) {
      console.error(error);
      res.send(
        {
          message: false
        }
      );
    }
  }
);
app.post(
  "/cancelorder",
  async(req, res) => {
    const {
      data
    } = req.body;
    if(
      !data || !data ["Costumer Id"]
    )
    {
      return res.status(400).send(
        {
          message: 'Invalid request data'
        }
      );
    }
    data.Admin = true;
    try {
      await CancelModel.create(data);
      let i = data._id 
      await DashBoardModel.deleteOne(
        {
          _id: i
        }
      );
      // Send a success responses
      res.send(
        {
          message: true
        }
      );
    }
    catch(error) {
      console.error(error);
      // Send a failure response
      res.status(500).send(
        {
          message: false
        }
      );
    }
  }
);
app.get(
  "/cancelGet",
  async(req, res) => {
    try {
      const D = await CancelModel.find();
      res.send(
        {
          message: true,
          Da: D
        }
      )
    }
    catch(error) {
      console.log(error)
      res.send(
        {
          message: false
        }
      )
    }
  }
)
