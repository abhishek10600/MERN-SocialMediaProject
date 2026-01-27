import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

// routes
import testRoute from "./routes/testRoute";
import userRouter from "./routes/user.route";
import postRouter from "./routes/post.route";
import commentRouter from "./routes/comment.route";
import likeRouter from "./routes/like.route";

app.use("/api/v1/test", testRoute);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);

export default app;
