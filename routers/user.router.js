import express from "express";
import userController from "../controllers/user.controller.js";

const userRouter = express.Router();

// ================= PUBLIC ROUTES =================
userRouter.post("/register", userController.register);
userRouter.get("/verify/:token", userController.verifyEmail);
userRouter.post("/login", userController.login);
userRouter.put("/updateUser", userController.updateUser);
userRouter.delete("/deleteUser", userController.deleteUser);
// ================= TOKEN-BASED ROUTES =================
userRouter.post("/userInfo", userController.getUserInfo);

export default userRouter;
