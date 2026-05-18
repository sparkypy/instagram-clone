import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

// POST /api/auth/register
authRouter.post("/register", registerController);

// POST /api/auth/login
authRouter.post("/login", loginController);

export { authRouter };
