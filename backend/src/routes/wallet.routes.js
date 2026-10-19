import express from "express";

import {

    authenticate,

    authorize

} from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";

import {

    getPaymentMethods,

    createRechargeRequest,

    getRechargeHistory,

    getWalletBalance

} from "../controllers/wallet.controller.js";


const router = express.Router();

/*
==========================================================
GET ACTIVE PAYMENT METHODS
==========================================================
*/

router.get(

    "/payment-methods",

    authenticate,

    authorize("user"),

    getPaymentMethods

);

/*
==========================================================
CREATE RECHARGE REQUEST
==========================================================
*/

router.post(

    "/recharge",

    authenticate,

    authorize("user"),

    upload.single("proof"),

    createRechargeRequest

);

/*
==========================================================
GET USER RECHARGE HISTORY
==========================================================
*/

router.get(
    "/history",
    authenticate,
    authorize("user"),
    getRechargeHistory
);

/*
==========================================================
GET WALLET (BALANCE)
==========================================================
*/
router.get(
    "/",
    authenticate,
    authorize("user"),
    getWalletBalance
);

export default router;
