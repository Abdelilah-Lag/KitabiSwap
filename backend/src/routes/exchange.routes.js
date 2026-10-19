import express from "express";

import {
    getExchangeBooks,
    getExchangeBook,
    getMyBooks,
    createExchangeRequest,
    getExchangeRequestPage,
    acceptExchangeRequest
} from "../controllers/exchange.controller.js";


import {
    authenticate,
    authorize
} from "../middleware/auth.middleware.js";


const router = express.Router();

/* ==========================================
   Livres disponibles pour échange
========================================== */

router.get(
    "/books",
    authenticate,
    authorize("user"),
    getExchangeBooks
);

/* ==========================================
   Détails d'un livre
========================================== */

router.get(
    "/book/:id",
    authenticate,
    authorize("user"),
    getExchangeBook
);

/* ==========================================
   Page de sélection (livres demandés + mes livres)
========================================== */
router.get(
    "/request-page/:bookId",
    authenticate,
    authorize("user"),
    getExchangeRequestPage
);


/* ==========================================
   Mes livres disponibles
========================================== */

router.get(
    "/my-books",
    authenticate,
    authorize("user"),
    getMyBooks
);

/* ==========================================
   Envoyer une demande d'échange
========================================== */

router.post(
    "/request",
    authenticate,
    authorize("user"),
    createExchangeRequest
);

/* ==========================================
   Accepter une demande (receiver)
========================================== */
router.post(
    "/request/:id/accept",
    authenticate,
    authorize("user"),
    acceptExchangeRequest
);

export default router;
