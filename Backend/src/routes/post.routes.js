import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createPostController,
  getPostController,
  getPostDetails,
  likePostController,
} from "../controllers/post.controller.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const postRouter = express.Router();

// POST /api/posts/ [protected]
postRouter.post("/", authMiddleware, upload.single("image"), createPostController);

// GET /api/posts [protected]
postRouter.get("/", authMiddleware, getPostController);

// GET /api/posts/details/:postid
postRouter.get("/details/:postid", authMiddleware, getPostDetails);

// POST /api/posts/like/:postid
postRouter.post("/like/:postid", authMiddleware, likePostController);

export { postRouter };
