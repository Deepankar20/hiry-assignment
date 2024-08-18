import express from "express";

const router = express.Router();

import { getURL } from "../controllers/aws.controller";

router.get("/getURL", getURL);

export default router;
