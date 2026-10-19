import express from "express";

import { authenticate, authorize } from "../middleware/auth.middleware.js";

import {
  listControllerExchangeSubmissions,
  getControllerExchangeSubmissionDetails,
  approveControllerExchangeSubmission,
  rejectControllerExchangeSubmission
} from "../controllers/controllerExchangeSubmission.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("controller"),
  listControllerExchangeSubmissions
);

router.get(
  "/:id",
  authenticate,
  authorize("controller"),
  getControllerExchangeSubmissionDetails
);

router.post(
  "/:id/approve",
  authenticate,
  authorize("controller"),
  approveControllerExchangeSubmission
);

router.delete(
  "/:id/reject",
  authenticate,
  authorize("controller"),
  rejectControllerExchangeSubmission
);

export default router;

