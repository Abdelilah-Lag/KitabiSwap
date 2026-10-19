import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
    listCatalogBooks,
    getCatalogBook,
    addCatalogBook,
    editCatalogBook,
    removeCatalogBook,
    toggleActive,
    getBookStats,
    listUserBooks,
    editUserBook,
    removeUserBook,
    listInventory,
    addInventoryItem,
    editInventoryItem,
    removeInventoryItem
} from "../controllers/adminBook.controller.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

// Catalog
router.get("/catalog", listCatalogBooks);
router.get("/catalog/:id", getCatalogBook);
router.post("/catalog", addCatalogBook);
router.put("/catalog/:id", editCatalogBook);
router.delete("/catalog/:id", removeCatalogBook);
router.patch("/catalog/:id/toggle-active", toggleActive);
router.get("/catalog/:id/stats", getBookStats);

// User Books
router.get("/user-books", listUserBooks);
router.put("/user-books/:id", editUserBook);
router.delete("/user-books/:id", removeUserBook);

// Inventory
router.get("/inventory", listInventory);
router.post("/inventory", addInventoryItem);
router.put("/inventory/:id", editInventoryItem);
router.delete("/inventory/:id", removeInventoryItem);

export default router;

