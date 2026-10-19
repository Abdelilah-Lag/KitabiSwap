import express from "express";

import {
    authenticate,
    authorize
} from "../middleware/auth.middleware.js";

import {
    getDashboard
} from "../controllers/controllerDashboard.controller.js";

const router = express.Router();

router.get(
    "/",
    authenticate,
    authorize("controller"),
    getDashboard
);

export default router;

