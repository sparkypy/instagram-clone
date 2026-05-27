import express from "express";
import {
  createCommentController,
  deleteCommentController,
  getPostCommentsController,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const commentRouter = express.Router();

// POST /api/comments/:postId
commentRouter.post("/:postId", authMiddleware, createCommentController);

// DELETE /api/comments/:commentId
commentRouter.delete("/:commentId", authMiddleware, deleteCommentController);

// GET /api/comments/:postId
commentRouter.get("/:postId", getPostCommentsController);

export { commentRouter };
