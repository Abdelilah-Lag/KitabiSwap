import express from "express";

import {

    authenticate,

    authorize

} from "../middleware/auth.middleware.js";

import {

    getMyDeliveriesController,

    completeDeliveryController

} from "../controllers/deliveryTracking.controller.js";

const router = express.Router();

/*
==========================================================
GET MY DELIVERIES
==========================================================
*/

router.get(

    "/",

    authenticate,

    authorize("delivery"),

    getMyDeliveriesController

);

/*
==========================================================
COMPLETE DELIVERY
==========================================================
*/

router.put(

    "/:id/complete",

    authenticate,

    authorize("delivery"),

    completeDeliveryController

);

export default router;