import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  createComment,
  getCommentsByPostId,
  deleteComment,
} from "../controllers/comment.controller";

const router = express.Router();

router.route("/create-comment/:postId").post(verifyJWT, createComment);
router.route("/all/:postId").get(verifyJWT, getCommentsByPostId);
router
  .route("/delete-comment/post/:postId/comment/:commentId")
  .delete(verifyJWT, deleteComment);

export default router;
