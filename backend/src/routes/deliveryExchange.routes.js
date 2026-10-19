import express from "express";

import {

    authenticate,

    authorize

} from "../middleware/auth.middleware.js";

import {

    getDeliveryExchangeOrdersController,

    takeDeliveryExchangeController

} from "../controllers/deliveryExchange.controller.js";

const router = express.Router();

/*
==========================================================
GET DELIVERY EXCHANGE ORDERS
==========================================================
*/

router.get(

    "/",

    authenticate,

    authorize("delivery"),

    getDeliveryExchangeOrdersController

);

/*
==========================================================
TAKE DELIVERY EXCHANGE
==========================================================
*/

router.post(

    "/:id/take",

    authenticate,

    authorize("delivery"),

    takeDeliveryExchangeController

);

export default router;