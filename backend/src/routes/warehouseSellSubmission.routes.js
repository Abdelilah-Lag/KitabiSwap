import express from "express";

import {
    authenticate,
    authorize
} from "../middleware/auth.middleware.js";

import {
    listSellSubmissions,
    getSellSubmissionDetails,
    approveSellSubmission,
    rejectSellSubmission
} from "../controllers/warehouseSellSubmission.controller.js";

const router = express.Router();

/*
==========================================================
WAREHOUSE SELL SUBMISSIONS
==========================================================
*/

router.get(
    "/",
    authenticate,
    authorize("warehouse_manager"),
    listSellSubmissions
);

router.get(
    "/:id",
    authenticate,
    authorize("warehouse_manager"),
    getSellSubmissionDetails
);

router.post(
    "/:id/approve",
    authenticate,
    authorize("warehouse_manager"),
    approveSellSubmission
);

router.delete(
    "/:id/reject",
    authenticate,
    authorize("warehouse_manager"),
    rejectSellSubmission
);

export default router;

