import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const authMiddleware = (req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new ApiError(401, "Unauthorized: Token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!mongoose.Types.ObjectId.isValid(decoded._id)) {
      return next(new ApiError(401, "Invalid token payload"));
    }
    req.user = { _id: decoded._id };
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid Token"));
    }

    if (err.name == "TokenExpiredError") {
      return next(new ApiError(401, "Token Expired"));
    }

    return next(new ApiError(500, "Authentication Failed"));
  }
};


