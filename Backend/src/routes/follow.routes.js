import express from "express";
import {
  followUserController,
  unfollowUserController,
} from "../controllers/follow.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const followRouter = express.Router();

// POST /api/follows/:userId
followRouter.post("/:userId", authMiddleware, followUserController);

// DELETE /api/follows/:userId
followRouter.delete("/:userId", authMiddleware, unfollowUserController);

export { followRouter };
