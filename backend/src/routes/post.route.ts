import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import {
  createPost,
  getAllPostsForHome,
  getUserPosts,
  getUserPostById,
  updatePostContent,
  deletePost,
} from "../controllers/post.controller";

const router = express.Router();

router
  .route("/create-post")
  .post(verifyJWT, upload.single("image"), createPost);

router.route("/all-posts").get(verifyJWT, getAllPostsForHome);
router.route("/user-posts/:username").get(verifyJWT, getUserPosts);
router.route("/:postId").get(verifyJWT, getUserPostById);
router
  .route("/update-post-content/:postId")
  .patch(verifyJWT, updatePostContent);
router.route("/delete-post/:postId").delete(verifyJWT, deletePost);

export default router;
