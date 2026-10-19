import { Router } from "express";

import {

    getPaymentDashboardController

} from "../controllers/paymentDashboard.controller.js";

import {

    authenticate,
    authorize

} from "../middleware/auth.middleware.js";

const router = Router();

/*
==========================================================
PAYMENT MANAGER DASHBOARD
==========================================================
*/

router.get(

    "/dashboard",

    authenticate,

    authorize("payment_manager"),

    getPaymentDashboardController

);

export default router;