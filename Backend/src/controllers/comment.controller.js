import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const createCommentController = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  if (typeof content !== "string" || !content.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = await Comment.create({
    content,
    owner: req.user._id,
    post: postId,
  });

  const populatedComment = await comment.populate(
    "owner",
    "username profileImage",
  );

  return res.status(201).json({
    success: true,
    comment: populatedComment,
  });
});

const deleteCommentController = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  await comment.deleteOne();
  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});

const getPostCommentsController = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id");
  }
  const comments = await Comment.find({
    post: postId,
  })
    .populate("owner", "username profileImage")
    .sort({
      createdAt: -1,
    });

  return res.status(200).json({
    success: true,
    comments,
  });
});

export {
  createCommentController,
  deleteCommentController,
  getPostCommentsController,
};
