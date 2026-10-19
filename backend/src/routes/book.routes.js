import express from "express";

import { getBook } from "../controllers/book.controller.js";

const router = express.Router();

/* ==========================================
   BOOK DETAILS
========================================== */

router.get(

    "/details/:type/:id",

    getBook

);

export default router;