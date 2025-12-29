import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import userModel from "../dbModels/user.js";

class UserController {
    constructor() {
    this.register = this.register.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.login = this.login.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  // Helper: send verification email
  async sendVerificationEmail(user, token) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "mohdrayaanpasha@gmail.com",
        pass: "dotv epql rczc xeap", // Use environment variable in production
      },
    });

    const mailOptions = {
      from: '"Solace Craft" <noreply@solacecraft.com>',
      to: user.email,
      subject: `Welcome to Solace Craft, ${user.name}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; background-color: #0a0a0a; color: #f3f3f3; padding: 40px;">
          <h1>Welcome, ${user.name.split(" ")[0]}!</h1>
          <p>Your Solace Craft account has been created successfully.</p>
          <a href="https://solacecraft.co.in/verify/${token}">Click To Verify</a>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error("Email send error:", err);
    }
  }

  // ================= REGISTER =================
  async register(req, res) {
    try {
      const { email, name, password, address, phoneNo } = req.body;

      if (!email || !name || !password || !address){
        return res.status(400).json({ message: "All fields are required." });
      }

      const existingUser = await userModel.findOne({ email: email.toLowerCase() });
      if (existingUser) return res.status(409).json({ message: "User already exists." });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userModel.create({
        email: email.toLowerCase(),
        name,
        Password: hashedPassword,
        Adress:address,
        phoneNo,
        verifiedStatus: false,
      });

      const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET || "defaultsecret", {
        expiresIn: "7d",
      });

      newUser.token = token;
      await newUser.save();

      await this.sendVerificationEmail(newUser, token);

      res.status(201).json({
        message: "User registered successfully. Check your email to verify account.",
        token,
        user: { id: newUser._id, email: newUser.email, name: newUser.name },
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  // ================= VERIFY EMAIL =================
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");

      const user = await userModel.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found." });
      if (user.verifiedStatus) return res.status(400).json({ message: "User already verified." });

      user.verifiedStatus = true;
      user.token = undefined;
      await user.save();

      res.status(200).json({ message: "Email verified successfully!" });
    } catch (err) {
      console.error("Verification error:", err);
      res.status(400).json({ message: "Invalid or expired token." });
    }
  }

  // ================= LOGIN =================
  async login(req, res) {
    try {
      const { Email, Password } = req.body;

      const user = await userModel.findOne({ email: Email.toLowerCase() });
      if (!user) return res.status(401).json({ message: "Invalid credentials." });

      const isMatch = await bcrypt.compare(Password, user.Password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

      if (!user.verifiedStatus)
        return res.status(403).json({ message: "Account not verified. Check your email." });

      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "defaultsecret", {
        expiresIn: "7d",
      });

      res.status(200).json({
        message: "Login successful!",
        token,
        user: { id: user._id, email: user.email, name: user.name },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  // ================= GET USER INFO =================
  async getUserInfo(req, res) {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Token is required." });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
      const user = await userModel.findById(decoded.id).select("-password -token -verifyToken");
      console.log(user)
      if (!user) return res.status(404).json({ message: "User not found." });

      res.status(200).json({ message: true, D: user });
    } catch (err) {
      console.error("Token verification failed:", err);
      res.status(401).json({ message: false, error: "Invalid or expired token." });
    }
  }

  // ================= UPDATE USER =================
async updateUser(req, res) {
  const { token, name, phoneNo, address, password } = req.body;

  if (!token) return res.status(401).json({ message: "Token is required." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");

    const updateData = {};
    if (name) updateData.name = name;
    if (phoneNo) updateData.phoneNo = phoneNo;
    if (address) updateData.Adress = address;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = await userModel.findByIdAndUpdate(decoded.id, { $set: updateData }, { new: true }).select("-password -token");

    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ message: "User updated successfully.", user });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

// ================= DELETE USER =================
async deleteUser(req, res) {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: "Token is required." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");

    const user = await userModel.findByIdAndDelete(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Optional: delete related data (like cart)
    // await cartModel.deleteOne({ email: user.email });

    res.status(200).json({ message: "User account deleted successfully." });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

}

export default new UserController();
