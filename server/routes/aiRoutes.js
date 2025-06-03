import express from "express";
import { generateSmartReply, translateMessage } from "../controllers/aiController.js";

const router = express.Router();

router.post("/smart-reply", generateSmartReply);
router.post("/translate", translateMessage);

export default router;
