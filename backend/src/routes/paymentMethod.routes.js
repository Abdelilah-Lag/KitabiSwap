import { Router } from "express";

import {

    getPaymentMethodsController,
    createPaymentMethodController,
    updatePaymentMethodController,
    deletePaymentMethodController

} from "../controllers/paymentMethod.controller.js";

import {

    authenticate,
    authorize

} from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";

const router = Router();

/*
==========================================================
PAYMENT METHODS
==========================================================
*/

/*
----------------------------------------------------------
GET ALL PAYMENT METHODS
----------------------------------------------------------
*/

router.get(

    "/",

    authenticate,

    authorize("payment_manager"),

    getPaymentMethodsController

);

/*
----------------------------------------------------------
CREATE PAYMENT METHOD
----------------------------------------------------------
*/

router.post(

    "/",

    authenticate,

    authorize("payment_manager"),

    upload.single("qr_code"),

    createPaymentMethodController

);

/*
----------------------------------------------------------
UPDATE PAYMENT METHOD
----------------------------------------------------------
*/

router.put(

    "/:id",

    authenticate,

    authorize("payment_manager"),

    upload.single("qr_code"),

    updatePaymentMethodController

);

/*
----------------------------------------------------------
DELETE PAYMENT METHOD
----------------------------------------------------------
*/

router.delete(

    "/:id",

    authenticate,

    authorize("payment_manager"),

    deletePaymentMethodController

);

export default router;