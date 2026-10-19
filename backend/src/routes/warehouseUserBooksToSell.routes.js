import { Router } from "express";

import {

    getUserBooksToSell,

    getUserBookToSellDetails,

    deleteUserBookToSell

} from "../controllers/warehouseUserBooksToSell.controller.js";

import {

    authenticate,

    authorize

} from "../middleware/auth.middleware.js";

const router = Router();

/*
==========================================================
USER BOOKS TO SELL
WAREHOUSE MANAGER
==========================================================
*/

/*
----------------------------------------------------------
GET
Tous les livres mis en vente
----------------------------------------------------------
*/

router.get(

    "/",

    authenticate,

    authorize("warehouse_manager"),

    getUserBooksToSell

);

/*
----------------------------------------------------------
GET DETAILS
----------------------------------------------------------
*/

router.get(

    "/:id",

    authenticate,

    authorize("warehouse_manager"),

    getUserBookToSellDetails

);

/*
----------------------------------------------------------
DELETE
----------------------------------------------------------
*/

router.delete(

    "/:id",

    authenticate,

    authorize("warehouse_manager"),

    deleteUserBookToSell

);

export default router;