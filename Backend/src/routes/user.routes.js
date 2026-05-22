import express from "express";
import {
  followUserController,
  unfollowUserController,
  getUserProfileController,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

// POST /api/users/follow/:userid [protected]
userRouter.post("/follow/:userid", authMiddleware, followUserController);

// DELETE /api/users/unfollow/:userid
userRouter.delete("/unfollow/:userid", authMiddleware, unfollowUserController);

// GET /api/users/profile/:username
userRouter.get("/profile/:username", getUserProfileController);

export { userRouter };

