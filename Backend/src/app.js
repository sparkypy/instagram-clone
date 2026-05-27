import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { followRouter } from "./routes/follow.routes.js";
import { postRouter } from "./routes/post.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { likeRouter } from "./routes/like.routes.js";
import { commentRouter } from "./routes/comment.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/follows", followRouter);
app.use("/api/posts", postRouter);
app.use("/api/likes", likeRouter);
app.use("/api/comments", commentRouter);

app.use(errorMiddleware);

export { app };
