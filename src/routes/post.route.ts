import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { createPost, getAllPostsForHome } from "../controllers/post.controller";

const router = express.Router();

router
  .route("/create-post")
  .post(verifyJWT, upload.single("image"), createPost);

router.route("/all-posts").get(verifyJWT, getAllPostsForHome);

export default router;
