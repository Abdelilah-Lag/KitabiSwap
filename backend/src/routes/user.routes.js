import express from "express";

import { getDashboard } from "../controllers/user.controller.js";

import { authenticate , authorize} from "../middleware/auth.middleware.js";

const router = express.Router();

/* ===========================
   USER DASHBOARD
=========================== */

router.get(
    "/dashboard",
    authenticate,
    authorize("user"),
    getDashboard
);

export default router;