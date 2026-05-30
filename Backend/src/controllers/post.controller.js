import mongoose, { mongo } from "mongoose";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Follow } from "../models/follow.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { imagekit } from "../lib/imagekit.js";
import { enrichPost } from "../utils/enrichPosts.js";

const createPostController = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (content && typeof content !== "string") {
    throw new ApiError(400, "Content type not supported");
  }

  let imageUrl = "";

  if (req.file) {
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
    });

    imageUrl = uploadedImage.url;
  }

  const post = await Post.create({
    content: content.trim(),
    owner: req.user._id,
    image: imageUrl,
  });

  const populatedPost = await post.populate("owner", "username profileImage");

  res.status(201).json({
    success: true,
    post: {
      ...populatedPost.toObject(),
      isLiked: false,
      likesCount: 0,
      commentsCount: 0,
    },
  });
});

const deletePostController = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  // authorization ("are you allowed to do this?")
  if (post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to delete this post");
  }

  await post.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

const getUserPostsController = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({
    username,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const posts = await Post.find({
    owner: user._id,
  }).sort({
    createdAt: -1,
  });

  return res.status(200).json({
    success: true,
    posts,
  });
});

const getFeedPostsController = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  const following = await Follow.find({
    follower: currentUserId,
  }).select("following");

  const followingIds = following.map((follow) => follow.following);
  followingIds.push(currentUserId);

  const posts = await Post.find({
    owner: {
      $in: followingIds,
    },
  })
    .populate("owner", "username profileImage")
    .sort({
      createdAt: -1,
    });

  const enrichedPosts = await Promise.all(
    posts.map(async (post) => {
      return await enrichPost(post, currentUserId);
    }),
  );

  return res.status(200).json({
    success: true,
    posts: enrichedPosts,
  });
});

export {
  createPostController,
  deletePostController,
  getUserPostsController,
  getFeedPostsController,
};
