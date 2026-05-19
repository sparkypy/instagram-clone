import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const registerController = asyncHandler(async (req, res) => {
  let { username, email, password, bio, profileImage } = req.body;
  if (
    ![username, email, password].every(
      (ele) => typeof ele === "string" && ele.trim(),
    )
  ) {
    throw new ApiError(400, "Username, Password & Email are required");
  }
  username = username.trim().toLowerCase();
  email = email.trim().toLowerCase();
  const newUser = await User.create({
    username,
    email,
    password,
    bio,
    profileImage,
  });

  const token = jwt.sign(
    {
      _id: newUser._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "6d",
    },
  );

  res.cookie("token", token, cookieOptions);

  const user = newUser.toObject();
  delete user.password;

  return res.status(201).json({
    message: "User registered",
    user,
  });
});

const loginController = asyncHandler(async (req, res) => {
  let { identifier, password } = req.body;
  if (typeof identifier !== "string" || !identifier.trim()) {
    throw new ApiError(400, "Email or Username required");
  }
  if (typeof password !== "string" || !password.trim()) {
    throw new ApiError(400, "Password is required");
  }

  identifier = identifier.trim().toLowerCase();

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, cookieOptions);

  const userObj = user.toObject();
  delete userObj.password;

  return res.status(200).json({
    message: "Logged In",
    user: userObj,
  });
});

export { registerController, loginController };
