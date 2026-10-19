import express from "express";

import { magazineBooks } from "../controllers/magazine.controller.js";

const router = express.Router();

/*
    GET /api/magazine

    Query Parameters:

    page
    search
    category
    language
    minPrice
    maxPrice
*/

router.get(

    "/",

    magazineBooks

);

export default router;