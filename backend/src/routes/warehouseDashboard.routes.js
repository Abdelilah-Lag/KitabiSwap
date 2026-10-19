import express from "express";

import {
    authenticate,
    authorize
} from "../middleware/auth.middleware.js";

import {
    getDashboard
} from "../controllers/warehouseDashboard.controller.js";

const router = express.Router();

/*
==========================================================
WAREHOUSE DASHBOARD
==========================================================
*/

router.get(
    "/",
    authenticate,
    authorize("warehouse_manager"),
    getDashboard
);

export default router;