import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token"
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-pin");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account has been deactivated"
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, invalid token"
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in authentication"
    });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};
