import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  togglePostLike,
  getUsersWhoLikedPost,
} from "../controllers/like.controller.js";
import { rateLimiter } from "../middlewares/rateLimitter.middleware.js";

const router = express.Router();

const likeLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  prefix: "like",
  perUser: true,
});

router
  .route("/post/:postId/toggle-like")
  .post(verifyJWT, likeLimiter, togglePostLike);
router.route("/post/:postId").get(verifyJWT, getUsersWhoLikedPost);

export default router;
