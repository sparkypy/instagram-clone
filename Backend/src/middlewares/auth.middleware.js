import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
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

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    req.user = user;
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

// working of the authMiddleware
/*
  i. fetch the Token
  ii. check if the token is there:
          if there is: continue
          else: throw("Token Missing")
  iii. verify the token with JWT_SECRET and store it in decoded
          decoded now has whatever payload you used to create the token (_.id in our case)
  iv. verify if ._id is a mongoose ID
  v. query the DB to fetch the user (except password)
          'v' step is important because there can be scenario where the token exists (in the browser) but the user has been deleted
          so, it's better to query the DB to get the current state
  vi. verify if user exists:
          if user exists: req.user = user
          else: throw("User not found")
*/