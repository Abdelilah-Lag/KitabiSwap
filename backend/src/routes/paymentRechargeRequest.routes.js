import { Router } from "express";

import {

    getRechargeRequestsController,
    approveRechargeRequestController,
    rejectRechargeRequestController

} from "../controllers/paymentRechargeRequest.controller.js";

import {

    authenticate,
    authorize

} from "../middleware/auth.middleware.js";

const router = Router();

/*
==========================================================
PAYMENT RECHARGE REQUESTS
==========================================================
*/

/*
----------------------------------------------------------
GET
Toutes les demandes de recharge
----------------------------------------------------------
*/

router.get(

    "/",

    authenticate,

    authorize("payment_manager"),

    getRechargeRequestsController

);

/*
----------------------------------------------------------
PUT
Valider une demande
----------------------------------------------------------
*/

router.patch(

    "/:id/approve",

    authenticate,

    authorize("payment_manager"),

    approveRechargeRequestController

);

/*
----------------------------------------------------------
PUT
Refuser une demande
----------------------------------------------------------
*/

router.patch(

    "/:id/reject",

    authenticate,

    authorize("payment_manager"),

    rejectRechargeRequestController

);

export default router;