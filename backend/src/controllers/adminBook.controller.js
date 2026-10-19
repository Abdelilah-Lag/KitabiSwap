import {
    getCatalogBooks,
    getCatalogBookById,
    createCatalogBook,
    updateCatalogBook,
    deleteCatalogBook,
    toggleBookActive,
    getCatalogBookStats,
    getUserBooks,
    updateUserBook,
    deleteUserBook,
    getInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem
} from "../services/adminBook.service.js";

export async function listCatalogBooks(req, res) {
    try {
        const { page, limit, search, category, language, is_active, sort, order } = req.query;
        const data = await getCatalogBooks({
            page: Number(page) || 1,
            limit: Number(limit) || 20,
            search, category, language, is_active, sort, order
        });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminCatalog] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getCatalogBook(req, res) {
    try {
        const book = await getCatalogBookById(req.params.id);
        if (!book) return res.status(404).json({ success: false, message: "Livre introuvable" });
        res.json({ success: true, book });
    } catch (error) {
        console.error("[AdminCatalog] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function addCatalogBook(req, res) {
    try {
        const book = await createCatalogBook(req.body);
        res.status(201).json({ success: true, book });
    } catch (error) {
        console.error("[AdminCatalog] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function editCatalogBook(req, res) {
    try {
        const book = await updateCatalogBook(req.params.id, req.body);
        res.json({ success: true, book });
    } catch (error) {
        console.error("[AdminCatalog] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function removeCatalogBook(req, res) {
    try {
        await deleteCatalogBook(req.params.id);
        res.json({ success: true, message: "Livre supprimé du catalogue" });
    } catch (error) {
        console.error("[AdminCatalog] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function toggleActive(req, res) {
    try {
        const book = await toggleBookActive(req.params.id);
        res.json({ success: true, book, message: book.is_active ? "Livre activé" : "Livre désactivé" });
    } catch (error) {
        console.error("[AdminCatalog] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getBookStats(req, res) {
    try {
        const stats = await getCatalogBookStats(req.params.id);
        res.json({ success: true, stats });
    } catch (error) {
        console.error("[AdminCatalog] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function listUserBooks(req, res) {
    try {
        const { page, limit, status, search, sort, order } = req.query;
        const data = await getUserBooks({
            page: Number(page) || 1,
            limit: Number(limit) || 20,
            status, search, sort, order
        });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminUserBooks] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function editUserBook(req, res) {
    try {
        const book = await updateUserBook(req.params.id, req.body);
        res.json({ success: true, book });
    } catch (error) {
        console.error("[AdminUserBooks] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function removeUserBook(req, res) {
    try {
        await deleteUserBook(req.params.id);
        res.json({ success: true, message: "Livre utilisateur supprimé" });
    } catch (error) {
        console.error("[AdminUserBooks] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function listInventory(req, res) {
    try {
        const { page, limit, status, search, sort, order } = req.query;
        const data = await getInventory({
            page: Number(page) || 1,
            limit: Number(limit) || 20,
            status, search, sort, order
        });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminInventory] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function addInventoryItem(req, res) {
    try {
        const item = await createInventoryItem(req.body);
        res.status(201).json({ success: true, item });
    } catch (error) {
        console.error("[AdminInventory] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function editInventoryItem(req, res) {
    try {
        const item = await updateInventoryItem(req.params.id, req.body);
        res.json({ success: true, item });
    } catch (error) {
        console.error("[AdminInventory] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function removeInventoryItem(req, res) {
    try {
        await deleteInventoryItem(req.params.id);
        res.json({ success: true, message: "Article supprimé du stock" });
    } catch (error) {
        console.error("[AdminInventory] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

