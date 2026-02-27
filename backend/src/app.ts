import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./middlewares/rateLimitter.middleware.js";

const app = express();

app.set("trust proxy", 1); // required behind proxy

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser(
  
));

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 500,
    prefix: "global",
  })
);

// routes
import testRoute from "./routes/testRoute.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import likeRouter from "./routes/like.route.js";
import chatRouter from "./routes/chat.route.js";

app.use("/api/v1/test", testRoute);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/chats", chatRouter);

export default app;
