import { searchBookCatalogService } from "../services/catalog.service.js";

export async function searchBookCatalog(req, res) {
    try {
        const q = req.query.q ?? "";
        const books = await searchBookCatalogService(q);

        return res.status(200).json(books);
    }
    catch (error) {
        console.error("Catalog search error:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal server error"
        });
    }
}

