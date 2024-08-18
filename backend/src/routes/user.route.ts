import express from "express";
import { getUsersToChat, searchUsers } from "../controllers/user.controller";

const router = express.Router();

router.get("/getUsersToChat", getUsersToChat);
router.get("/search", searchUsers);

export default router;
