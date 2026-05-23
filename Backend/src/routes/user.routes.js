import express from "express";
import { getUserProfileController } from "../controllers/user.controller.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

const userRouter = express.Router();

// GET /api/users/profile/:username
userRouter.get("/profile/:username", optionalAuth, getUserProfileController);

export { userRouter };

