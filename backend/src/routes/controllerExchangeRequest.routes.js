import { Router } from "express";

import {

    getPendingExchangeRequestsController,
    startCollectingBooksController,
    rejectExchangeRequestController

} from "../controllers/controllerExchangeRequest.controller.js";

import {

    authenticate,
    authorize

} from "../middleware/auth.middleware.js";

const router = Router();

/* ==========================================================
   CONTROLLER EXCHANGE REQUESTS
========================================================== */

/*
    GET
    Toutes les demandes d'échange en attente
*/
router.get(

    "/",

    authenticate,

    authorize("controller"),

    getPendingExchangeRequestsController

);

/*
    PUT
    Commencer la collecte des livres
*/
router.put(

    "/:deliveryId/collect",

    authenticate,

    authorize("controller"),

    startCollectingBooksController

);

/*
    PUT
    Refuser une demande d'échange
*/
router.put(

    "/:deliveryId/reject",

    authenticate,

    authorize("controller"),

    rejectExchangeRequestController

);

export default router;