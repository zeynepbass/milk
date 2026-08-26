import User from "../models/User.js";
import { verifyToken } from "../config/jwt.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Token yok" });

    const token = authHeader.split(" ")[1];

    const decoded = await verifyToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Geçersiz token" });
  }
};
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Sadece admin erişebilir" });
  }
  next();
};
