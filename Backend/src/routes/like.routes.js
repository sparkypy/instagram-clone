import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { toggleLikeController } from "../controllers/like.controller.js";

const likeRouter = express.Router();

// POST /api/likes/:postId
likeRouter.post("/:postId", authMiddleware, toggleLikeController);

export { likeRouter };
