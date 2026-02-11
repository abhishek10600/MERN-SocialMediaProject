import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  getOrCreateConversation,
  sendMessage,
  getMessages,
} from "../controllers/chat.controller";
import { upload } from "../middlewares/multer.middleware";

const router = express.Router();

router.route("/conversation").post(verifyJWT, getOrCreateConversation);
router.route("/message").post(verifyJWT, upload.single("image"), sendMessage);
router.route("/messages/:conversationId").get(verifyJWT, getMessages);

export default router;
