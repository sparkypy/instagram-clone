import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const getUserProfileController = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({
    username,
  }).select("-password");
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  return res.status(200).json({
    success: true,
    user,
  });
});

export { getUserProfileController };

