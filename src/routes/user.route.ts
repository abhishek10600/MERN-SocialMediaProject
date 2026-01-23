import express from "express";
import { upload } from "../middlewares/multer.middleware";
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
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/register").post(upload.single("profileImage"), registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

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

export default router;
