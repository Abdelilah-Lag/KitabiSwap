import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { getDashboard } from "../controllers/adminDashboard.controller.js";

const router = express.Router();

router.get("/", authenticate, authorize("admin"), getDashboard);

export default router;

