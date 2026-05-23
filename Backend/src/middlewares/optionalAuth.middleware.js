import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");
    if (user) {
      req.user = user;
    }
    next();
  } catch {
    next();
  }
};

export { optionalAuth };
