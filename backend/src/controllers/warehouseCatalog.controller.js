import {
    listCatalogue as listCatalogueService,
    createBookService,
    getBookService,
    updateBookService,
    deleteBookService,
    uploadBookImagesService,
    deleteBookImageService
} from "../services/warehouseCatalog.service.js";

export async function listCatalogue(req, res) {
    try {
        const data = await listCatalogueService(req.query);

        return res.status(200).json(data);
    } catch (error) {
        console.error("LIST_CATALOGUE_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors du chargement du catalogue"
        });
    }
}

export async function createBook(req, res) {
    try {
        const files = req.files || [];

        const payload = {
            ...req.body
        };

        const data = await createBookService({
            payload,
            files
        });

        return res.status(201).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("CREATE_BOOK_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors de la création"
        });
    }
}

export async function getBook(req, res) {
    try {
        const { id } = req.params;
        const data = await getBookService(id);
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Catalogue introuvable"
            });
        }
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("GET_BOOK_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors de la récupération"
        });
    }
}

export async function updateBook(req, res) {
    try {
        const { id } = req.params;
        const payload = {
            ...req.body
        };

        const data = await updateBookService({
            id,
            payload
        });

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("UPDATE_BOOK_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors de la modification"
        });
    }
}

export async function deleteBook(req, res) {
    try {
        const { id } = req.params;
        const result = await deleteBookService(id);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("DELETE_BOOK_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors de la suppression"
        });
    }
}

export async function uploadBookImages(req, res) {
    try {
        const { id } = req.params;
        const files = req.files || [];

        const data = await uploadBookImagesService({
            id,
            files,
            body: req.body
        });

        return res.status(201).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("UPLOAD_BOOK_IMAGES_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors de l'upload"
        });
    }
}

export async function deleteBookImage(req, res) {
    try {
        const { imageId } = req.params;
        const result = await deleteBookImageService(imageId);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("DELETE_BOOK_IMAGE_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors de la suppression"
        });
    }
}

