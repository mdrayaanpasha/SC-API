import express from "express";
import cors from "cors";

// Routers
import sofaRouter from "./routers/sofa.router.js";
import miscRouter from "./routers/misc.router.js";
import shoerackRouter from "./routers/shoerack.router.js";
import userRouter from "./routers/user.router.js";
import cartRouter from "./routers/cart.router.js";
import adminRouter from "./routers/admin.router.js";

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(cors());
app.use(express.json());

/* ===================== ROUTES ===================== */
app.use("/api/sofa", sofaRouter);
app.use("/api/misc", miscRouter);
app.use("/api/shoerack", shoerackRouter);
app.use("/api/auth", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/admin", adminRouter);

export default app;
