import express from "express";

import { exploreBooks } from "../controllers/explore.controller.js";

const router = express.Router();

/*
    GET /api/explore

    Query Parameters:

    page
    search
    category
    language
    condition
    availability
*/

router.get(

    "/",

    exploreBooks

);

export default router;