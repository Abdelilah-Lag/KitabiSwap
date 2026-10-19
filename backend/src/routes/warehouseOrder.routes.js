import { Router } from "express";

import {
    getWarehouseOrdersController,
    approveWarehouseOrderController,
    rejectWarehouseOrderController
} from "../controllers/warehouseOrder.controller.js";

import {
    authenticate,
    authorize
} from "../middleware/auth.middleware.js";

const router = Router();

/* ==========================================================
   WAREHOUSE ORDERS
========================================================== */

/*
    GET
    Toutes les commandes en attente
*/
router.get(
    "/",
    authenticate,
    authorize("warehouse_manager"),
    getWarehouseOrdersController
);

/*
    PATCH
    Valider une commande
    source = book_orders | user_commandes
*/
router.patch(
    "/:source/:id/approve",
    authenticate,
    authorize("warehouse_manager"),
    approveWarehouseOrderController
);

/*
    PATCH
    Refuser une commande
    source = book_orders | user_commandes
*/
router.patch(
    "/:source/:id/reject",
    authenticate,
    authorize("warehouse_manager"),
    rejectWarehouseOrderController
);

export default router;