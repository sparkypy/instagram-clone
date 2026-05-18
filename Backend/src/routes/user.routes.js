import express from "express";
import { followUserController, unfollowUserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

// POST /api/users/follow/:userid [protected] 

userRouter.post("/follow/:userid", authMiddleware, followUserController);
userRouter.delete("/unfollow/:userid", authMiddleware, unfollowUserController);

export { userRouter };

