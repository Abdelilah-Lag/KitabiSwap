import express from "express";

import {
    authenticate,
    authorize
} from "../middleware/auth.middleware.js";

import {
    listInventory,
    searchCatalogue,
    addToStock,
    updateInventory,
    deleteInventory
} from "../controllers/warehouseInventory.controller.js";

const router = express.Router();

/*
==========================================================
WAREHOUSE INVENTORY
==========================================================
*/

router.get(
    "/",
    authenticate,
    authorize("warehouse_manager"),
    listInventory
);

router.get(
    "/catalog/search",
    authenticate,
    authorize("warehouse_manager"),
    searchCatalogue
);

router.post(
    "/",
    authenticate,
    authorize("warehouse_manager"),
    addToStock
);

router.put(
    "/:id",
    authenticate,
    authorize("warehouse_manager"),
    updateInventory
);

router.delete(
    "/:id",
    authenticate,
    authorize("warehouse_manager"),
    deleteInventory
);

export default router;

