import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import {
  createPost,
  getAllPostsForHome,
  getUserPosts,
} from "../controllers/post.controller";

const router = express.Router();

router
  .route("/create-post")
  .post(verifyJWT, upload.single("image"), createPost);

router.route("/all-posts").get(verifyJWT, getAllPostsForHome);
router.route("/user-posts/:username").get(verifyJWT, getUserPosts);

export default router;
