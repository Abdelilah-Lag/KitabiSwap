import express from "express";

import {

    getMagazineBooks,
    getBookDetails,
    getBuyBook,
    toggleFavorite,
    getDeliveryInfo,
    createBookOrder

} from "../controllers/magazine_user.controller.js";


import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/* =====================================================
   Tous les livres du magazine
===================================================== */

router.get(

    "/books",

    authenticate,

    getMagazineBooks

);

/* =====================================================
   BUY BOOK PAGE (shop + user)
===================================================== */

router.get(

    "/buy/:type/:id",

    authenticate,

    getBuyBook

);

/* =====================================================
   Détails d'un livre
===================================================== */

router.get(

    "/book/:type/:id",

    authenticate,

    getBookDetails

);


/* =====================================================
   Ajouter / supprimer des favoris
===================================================== */

router.post(

    "/favorite",

    authenticate,

    toggleFavorite

);

/* =====================================================
   Calcul du prix de livraison
===================================================== */

router.get(

    "/delivery/:type/:id",

    authenticate,

    getDeliveryInfo

);

/* =====================================================
   Acheter un livre
===================================================== */

router.post(

    "/order",

    authenticate,

    createBookOrder

);

export default router;