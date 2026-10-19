import express from "express";

import {

    authenticate

} from "../middleware/auth.middleware.js";

import {

    toggle,
    getFavorites

} from "../controllers/favorite.controller.js";

const router = express.Router();

/* ==========================================
   TOGGLE FAVORITE
   POST /api/favorites/toggle
========================================== */

router.post(

    "/toggle",

    authenticate,

    toggle

);

/* ==========================================
   GET USER FAVORITES
   GET /api/favorites
========================================== */

router.get(

    "/",

    authenticate,

    getFavorites

);

export default router;