import mongoose, { mongo } from "mongoose";
import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const toggleLikeController = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id");
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const existingLike = await Like.findOne({
    user: userId,
    post: postId,
  });

  if (existingLike) {
    await existingLike.deleteOne();

    const likesCount = await Like.countDocuments({ post: postId });

    return res.status(200).json({
      success: true,
      liked: false,
      likesCount,
    });
  }

  await Like.create({
    user: userId,
    post: postId,
  });
  const likesCount = await Like.countDocuments({ post: postId });

  return res.status(200).json({
    success: true,
    liked: true,
    likesCount,
  });
});

export { toggleLikeController };
