import { Post } from "../models/post.model.js";
import { Like } from "../models/like.model.js";
import ImageKit, { toFile } from "@imagekit/nodejs";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const createPostController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(req.file.mimetype)) {
    throw new ApiError(400, "Invalid file type");
  }

  const uploadedFile = await imageKit.files.upload({
    file: await toFile(req.file.buffer, req.file.originalname),
    fileName: `${Date.now()}-${req.file.originalname}`,
    folder: "ig_posts",
  });

  const post = await Post.create({
    caption: req.body.caption,
    img_url: uploadedFile.url,
    user: req.user._id,
  });

  return res.status(201).json({
    message: "Post Created",
    post,
  });
});

const getPostController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const posts = await Post.find({ user: userId });

  return res.status(200).json({
    message: "Posts Fetched",
    posts,
  });
});

const getPostDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postid = req.params.postid;

  if (!mongoose.Types.ObjectId.isValid(postid)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const post = await Post.findOne({
    _id: postid,
    user: userId,
  });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res.status(200).json({
    message: "Details Fetched",
    post,
  });
});

const likePostController = asyncHandler(async (req, res) => {
  const userid = new mongoose.Types.ObjectId(req.user?._id);
  const postid = req.params.postid;

  // validating the post Id
  if (!mongoose.Types.ObjectId.isValid(postid)) {
    throw new ApiError(400, "Invalid post ID");
  }

  // Check if the post exists
  const post = await Post.findById(postid);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if the user has already liked the post
  const existingLike = await Like.findOne({ user: userid, post: postid });
  if (existingLike) {
    throw new ApiError(400, "You have already liked this post");
  }

  const like = await Like.create({ user: userid, post: postid });

  return res.status(201).json({
    success: true,
    message: "Post liked successfully",
    data: like,
  });
});

export { createPostController, getPostController, getPostDetails, likePostController };
