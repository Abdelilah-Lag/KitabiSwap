import express from "express";

import {
    getExchangeChat,
    sendExchangeMessage,
    sendExchangeImage,
    chooseDeliveryMethod,
    payDelivery
} from "../controllers/exchangeChat.controller.js";

import {
    authenticate,
    authorize
} from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";

import { logUploadFields } from "../middleware/uploadDebug.middleware.js";


const router = express.Router();

/* ==========================================
   Récupérer tous les messages du chat
========================================== */

router.get(
    "/:exchangeRequestId",
    authenticate,
    authorize("user"),
    getExchangeChat
);

/* ==========================================
   Envoyer un message texte
========================================== */

router.post(
    "/:exchangeRequestId/message",
    authenticate,
    authorize("user"),
    sendExchangeMessage
);

/* ==========================================
   Envoyer une image
========================================== */

router.post(
    "/:exchangeRequestId/image",
    authenticate,
    authorize("user"),
    logUploadFields,
    upload.single("image"),
    sendExchangeImage
);

/* ==========================================
   Choisir la méthode de livraison
========================================== */

router.put(
    "/:exchangeRequestId/delivery",
    authenticate,
    authorize("user"),
    chooseDeliveryMethod
);

/* ==========================================
   Paiement livraison
========================================== */

router.put(
    "/:exchangeRequestId/payment",
    authenticate,
    authorize("user"),
    payDelivery
);

export default router;

