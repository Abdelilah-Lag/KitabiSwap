import { Router } from "express";

import {
    getCommandeInitController,
    searchBooksController,
    createCommandeController
} from "../controllers/userCommande.controller.js";

import {
    authenticate,
    authorize
} from "../middleware/auth.middleware.js";
import {
    validateCreateCommande
} from "../validations/userCommande.validation.js";

const router = Router();

/* ==========================================================
   USER COMMANDE
========================================================== */

/*
    GET
    Charger les données de la page

    - favoris
    - adresse
    - wallet
    - prix livraison
*/
router.get(
    "/init",
    authenticate,
    authorize("user"),
    getCommandeInitController
);

/*
    GET
    Recherche des livres

    Recherche dans :
    - shop_inventory
    - user_books_to_sell
*/
router.get(
    "/search",
    authenticate,
    authorize("user"),
    searchBooksController
);

/*
    POST
    Créer une commande
*/
router.post(
    "/",
    authenticate,
    authorize("user"),
    validateCreateCommande,
    createCommandeController
);

export default router;