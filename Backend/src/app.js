import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import { postRouter } from "./routes/post.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

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
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

app.use(errorMiddleware);

export { app };
