import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getOrCreateConversation,
  sendMessage,
  getMessages,
  markSeen,
  getUserConversations,
} from "../controllers/chat.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/conversation").post(verifyJWT, getOrCreateConversation);
router.route("/message").post(verifyJWT, upload.single("image"), sendMessage);
router.route("/messages/:conversationId").get(verifyJWT, getMessages);
router.route("/seen/:conversationId").patch(verifyJWT, markSeen);
router.route("/conversations").get(verifyJWT, getUserConversations);

export default router;
