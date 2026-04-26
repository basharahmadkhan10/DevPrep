import jwt from "jsonwebtoken";
import userModel from "../models/user.models.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        message: "Access token not found",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN
    );

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid access token",
      });
    }
    const user = await userModel.findById(decoded.userId).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error.message);

    return res.status(401).json({
      message: "Unauthorized access",
    });
  }
};

export default authMiddleware;