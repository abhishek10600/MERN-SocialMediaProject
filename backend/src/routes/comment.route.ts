import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createComment,
  getCommentsByPostId,
  deleteComment,
} from "../controllers/comment.controller.js";
import { rateLimiter } from "../middlewares/rateLimitter.middleware.js";

const router = express.Router();

const commentLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  prefix: "comment",
  perUser: true,
});

router
  .route("/create-comment/:postId")
  .post(verifyJWT, commentLimiter, createComment);
router.route("/all/:postId").get(verifyJWT, getCommentsByPostId);
router
  .route("/delete-comment/post/:postId/comment/:commentId")
  .delete(verifyJWT, deleteComment);

export default router;
