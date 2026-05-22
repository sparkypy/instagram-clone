import mongoose from "mongoose";
import { Follow } from "../models/follow.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const followUserController = asyncHandler(async (req, res) => {
  const followerId = new mongoose.Types.ObjectId(req.user?._id);
  const followingId = req.params.userid;

  if (!mongoose.Types.ObjectId.isValid(followingId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  if (followerId.equals(followingId)) {
    throw new ApiError(400, "Can't follow yourself");
  }

  const userToFollow = await User.findById(followingId);

  if (!userToFollow) {
    throw new ApiError(404, "User not found");
  }

  const alreadyFollowing = await Follow.findOne({
    follower: followerId,
    following: followingId,
  });

  if (alreadyFollowing) {
    throw new ApiError(400, "Already following this user");
  }

  const follow = await Follow.create({
    follower: followerId,
    following: followingId,
  });

  return res.status(201).json({
    success: true,
    message: "User followed successfully",
    data: follow,
  });
});

const unfollowUserController = asyncHandler(async (req, res) => {
  const followerId = new mongoose.Types.ObjectId(req.user?._id);
  const followingId = req.params.userid;

  if (!mongoose.Types.ObjectId.isValid(followingId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  if (followerId.equals(followingId)) {
    throw new ApiError(400, "Can't unfollow yourself");
  }

  const follow = await Follow.findOneAndDelete({
    follower: followerId,
    following: followingId,
  });

  if (!follow) {
    throw new ApiError(404, "Follow relationship not found");
  }

  return res.status(200).json({
    success: true,
    message: "User unfollowed successfully",
  });
});

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

export { followUserController, unfollowUserController, getUserProfileController };

