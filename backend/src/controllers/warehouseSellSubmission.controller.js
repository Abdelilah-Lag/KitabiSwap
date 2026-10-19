import {
    listPendingSellSubmissions,
    getSubmissionDetails,
    approveSubmission,
    rejectSubmission
} from "../services/warehouseSellSubmission.service.js";

export async function listSellSubmissions(req, res) {
    try {
        const data = await listPendingSellSubmissions();
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("LIST_SELL_SUBMISSIONS_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors du chargement des propositions"
        });
    }
}

export async function getSellSubmissionDetails(req, res) {
    try {
        const { id } = req.params;
        const data = await getSubmissionDetails(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Proposition introuvable"
            });
        }

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("GET_SELL_SUBMISSION_DETAILS_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors de la récupération"
        });
    }
}

export async function approveSellSubmission(req, res) {
    try {
        const { id } = req.params;
        /*
        =====================================
        Optional admin-edited catalog data.
        Used only when the book is not yet
        in the catalog (book_catalog_id null).
        =====================================
        */
        const catalogData = req.body?.catalog_data || null;

        const data = await approveSubmission(id, catalogData);

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("APPROVE_SELL_SUBMISSION_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors de la validation"
        });
    }
}

export async function rejectSellSubmission(req, res) {
    try {
        const { id } = req.params;
        const data = await rejectSubmission(id);

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("REJECT_SELL_SUBMISSION_ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Erreur lors du refus"
        });
    }
}
