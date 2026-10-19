import {
    listInventory as listInventoryService,
    searchCatalogue as searchCatalogueService,
    addToStock as addToStockService,
    updateInventory as updateInventoryService,
    deleteInventory as deleteInventoryService
} from "../services/warehouseInventory.service.js";

export async function listInventory(req, res) {
    try {
        const data = await listInventoryService(req.query);
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("LIST_INVENTORY_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors du chargement de l'inventaire"
        });
    }
}

export async function searchCatalogue(req, res) {
    try {
        const data = await searchCatalogueService(req.query);
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("SEARCH_CATALOGUE_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors de la recherche dans le catalogue"
        });
    }
}

export async function addToStock(req, res) {
    try {
        const data = await addToStockService(req.body);
        return res.status(201).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("ADD_TO_STOCK_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors de l'ajout au stock"
        });
    }
}

export async function updateInventory(req, res) {
    try {
        const { id } = req.params;
        const data = await updateInventoryService({ id, payload: req.body });
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("UPDATE_INVENTORY_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors de la modification"
        });
    }
}

export async function deleteInventory(req, res) {
    try {
        const { id } = req.params;
        const data = await deleteInventoryService(id);
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("DELETE_INVENTORY_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors de la suppression"
        });
    }
}

