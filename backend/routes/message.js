import express from "express";
import {
  getMessages,
  sendMessage,
  getUnreadCounts,
} from "../controllers/message.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/unread", protectRoute, getUnreadCounts);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
