import express from "express";

import {

    authenticate,

    authorize

} from "../middleware/auth.middleware.js";

import {

    getDeliveryUserOrdersController,

    takeDeliveryUserOrderController

} from "../controllers/deliveryUserOrders.controller.js";

const router = express.Router();

/*
==========================================================
GET USER ORDERS TO DELIVER
==========================================================
*/

router.get(

    "/",

    authenticate,

    authorize("delivery"),

    getDeliveryUserOrdersController

);

/*
==========================================================
TAKE USER DELIVERY ORDER
==========================================================
*/

router.post(

    "/:id/take",

    authenticate,

    authorize("delivery"),

    takeDeliveryUserOrderController

);

export default router;