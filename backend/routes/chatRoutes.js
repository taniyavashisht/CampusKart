import express from "express";
import { reportChat } from "../controllers/chatController.js";

import { protect } from "../middleware/Auth.js";
import {
  accessChat,
  getMessages,
  fetchMyChats,
  deleteChat
} from "../controllers/chatController.js";

const router = express.Router();

// ✅ Get all chats
router.get("/", protect, fetchMyChats);

// ✅ Create / Access chat
router.post("/", protect, accessChat);

// ✅ Get messages of a chat
router.get("/:chatId", protect, getMessages);

// ✅ DELETE chat
router.delete("/:id", protect, deleteChat);

router.post("/report/:chatId", protect, reportChat);


export default router;
