import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectedRoute = async (req, res, next) => {
  const token = req.cookies.Nexus;
  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: "Access denied. Invalid token." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      message: "Invalid token. Please log in again.",
    });
  }
};

export default protectedRoute;
