import express from "express";
import { submitContactMessage } from "../controllers/contact.controller.js";

const router = express.Router();

/* ===========================
   POST /api/contact
=========================== */

router.post("/", submitContactMessage);

export default router;
