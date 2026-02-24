import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  addBio,
  updateBio,
  updateProfileImage,
  getUserProfileData,
  followUser,
  unfollowUser,
  getUserFollowers,
  searchUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { rateLimiter } from "../middlewares/rateLimitter.middleware.js";

const router = express.Router();

const loginLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  prefix: "login",
});

const refreshLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  prefix: "refresh",
});

router.route("/register").post(upload.single("profileImage"), registerUser);
router.route("/login").post(loginLimiter, loginUser);
router.route("/refresh-token").post(refreshLimiter, refreshAccessToken);

// secured routes
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/add-bio").post(verifyJWT, addBio);
router.route("/update-bio").patch(verifyJWT, updateBio);
router
  .route("/update-profile-image")
  .patch(verifyJWT, upload.single("profileImage"), updateProfileImage);
router
  .route("/get-user-profile-data/:username")
  .get(verifyJWT, getUserProfileData);
router.route("/follow/:username").post(verifyJWT, followUser);
router.route("/unfollow/:username").post(verifyJWT, unfollowUser);
router.route("/get-followers").get(verifyJWT, getUserFollowers);
router.route("/search").get(verifyJWT, searchUser);

export default router;
