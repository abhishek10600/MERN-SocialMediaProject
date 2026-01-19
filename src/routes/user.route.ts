import express from "express";
import { upload } from "../middlewares/multer.middleware";
import { registerUser } from "../controllers/user.controller";

const router = express.Router();

router.route("/register").post(upload.single("profileImage"), registerUser);

export default router;
