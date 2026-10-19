import express from "express";

import {
    authenticate,
    authorize
} from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";

import {
    listCatalogue,
    createBook,
    getBook,
    updateBook,
    deleteBook,
    uploadBookImages,
    deleteBookImage
} from "../controllers/warehouseCatalog.controller.js";

const router = express.Router();

/*
==========================================================
WAREHOUSE CATALOGUE
==========================================================
*/

router.get(
    "/",
    authenticate,
    authorize("warehouse_manager"),
    listCatalogue
);

router.post(
    "/",
    authenticate,
    authorize("warehouse_manager"),
    upload.array("images", 10),
    createBook
);

router.get(
    "/:id",
    authenticate,
    authorize("warehouse_manager"),
    getBook
);

router.put(
    "/:id",
    authenticate,
    authorize("warehouse_manager"),
    updateBook
);

router.delete(
    "/:id",
    authenticate,
    authorize("warehouse_manager"),
    deleteBook
);

// Ajout d'images supplémentaires
router.post(
    "/:id/images",
    authenticate,
    authorize("warehouse_manager"),
    upload.array("images", 10),
    uploadBookImages
);

// Suppression d'une image
router.delete(
    "/images/:imageId",
    authenticate,
    authorize("warehouse_manager"),
    deleteBookImage
);

export default router;

