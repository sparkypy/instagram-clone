import express from "express";
import {
  getUserProfileController,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// GET /api/users/profile/:username
userRouter.get("/profile/:username", getUserProfileController);

export { userRouter };

