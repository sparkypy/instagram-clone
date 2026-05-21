import express from "express";
import {
  getCurrentUser,
  loginController,
  registerController,
  logoutController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

// POST /api/auth/register
authRouter.post("/register", registerController);

// POST /api/auth/login
authRouter.post("/login", loginController);

// GET /api/auth/me
authRouter.get("/me", authMiddleware, getCurrentUser);

// Post /api/auth/logout
authRouter.post("/logout", authMiddleware, logoutController);

export { authRouter };
