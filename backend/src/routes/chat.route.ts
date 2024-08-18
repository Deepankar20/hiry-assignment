import express from "express";
import { addChat, getChats, sendImage } from "../controllers/chat.controller";

const router = express.Router();

router.post("/addChat", addChat);
router.post("/getChats", getChats);
router.post("/sendImage", sendImage)


export default router;
