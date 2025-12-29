import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.body.token || req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Authentication token required." });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "defaultsecret"
        );
        req.user = decoded; // { id, email }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

export default authMiddleware;
