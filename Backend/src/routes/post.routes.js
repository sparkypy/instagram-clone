import express from "express";
import {
  getUserPostsController,
  createPostController,
  deletePostController,
  getFeedPostsController,
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const postRouter = express.Router();

// POST /api/posts/
postRouter.post("/", authMiddleware, createPostController);

// DELETE /api/posts/:postId
postRouter.delete("/:postId", authMiddleware, deletePostController);

// Get /api/posts/feed
postRouter.get("/feed", authMiddleware, getFeedPostsController);

// GET /api/posts/:username
postRouter.get("/:username", getUserPostsController);

export { postRouter };
