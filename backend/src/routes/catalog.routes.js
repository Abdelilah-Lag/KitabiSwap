import express from "express";

import { searchBookCatalog } from "../controllers/catalog.controller.js";

const router = express.Router();

router.get("/search", searchBookCatalog);

export default router;

