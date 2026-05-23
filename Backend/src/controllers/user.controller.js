import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Follow } from "../models/follow.model.js";

const getUserProfileController = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const currentUserId = req.user?._id;
  const user = await User.findOne({
    username,
  }).select("-password");
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const followerCount = await Follow.countDocuments({
    following: user._id,
  });

  const followingCount = await Follow.countDocuments({
    follower: user._id,
  });

  let isFollowing = false;
  if (currentUserId) {
    const followExists = await Follow.findOne({
      follower: currentUserId,
      following: user._id,
    });

    isFollowing = !!followExists;
  }
  return res.status(200).json({
    success: true,
    user: {
      ...user.toObject(),
      followerCount,
      followingCount,
      isFollowing,
    },
  });
});

export { getUserProfileController };

