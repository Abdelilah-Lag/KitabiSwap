import { Router } from "express";

import {

    getDeliveryDashboardController

} from "../controllers/deliveryDashboard.controller.js";

import {

    authenticate,
    authorize

} from "../middleware/auth.middleware.js";

const router = Router();

/*
==========================================================
DELIVERY DASHBOARD
==========================================================
*/

router.get(

    "/",

    authenticate,

    authorize("delivery"),

    getDeliveryDashboardController

);

export default router;