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
CONTROLLER CATALOGUE (ALIAS)
Reuse the exact same backend logic as warehouse.
Only role is different.
==========================================================
*/

router.get(
    "/",
    authenticate,
    authorize("controller"),
    listCatalogue
);

router.post(
    "/",
    authenticate,
    authorize("controller"),
    upload.array("images", 10),
    createBook
);

router.get(
    "/:id",
    authenticate,
    authorize("controller"),
    getBook
);

router.put(
    "/:id",
    authenticate,
    authorize("controller"),
    updateBook
);

router.delete(
    "/:id",
    authenticate,
    authorize("controller"),
    deleteBook
);

// Ajout d'images supplémentaires
router.post(
    "/:id/images",
    authenticate,
    authorize("controller"),
    upload.array("images", 10),
    uploadBookImages
);

// Suppression d'une image
router.delete(
    "/images/:imageId",
    authenticate,
    authorize("controller"),
    deleteBookImage
);

export default router;

