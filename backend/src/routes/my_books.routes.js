import express from "express";

import {
    authenticate
} from "../middleware/auth.middleware.js";

import {

    getMyBooks

} from "../controllers/my_books.controller.js";

const router = express.Router();

/*
==========================================================
MES LIVRES
==========================================================
*/

router.get(
    "/",
    authenticate,
    getMyBooks
);

export default router;