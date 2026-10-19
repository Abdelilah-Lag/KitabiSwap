import {
  listPendingExchangeSubmissions,
  getExchangeSubmissionDetails,
  approveExchangeSubmission,
  rejectExchangeSubmission
} from "../services/controllerExchangeSubmission.service.js";

export async function listControllerExchangeSubmissions(req, res) {
  try {
    const data = await listPendingExchangeSubmissions();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("LIST_EXCHANGE_SUBMISSIONS_ERROR:", error);
    return res.status(400).json({
      success: false,
      message: error?.message || "Erreur lors du chargement des propositions"
    });
  }
}

export async function getControllerExchangeSubmissionDetails(req, res) {
  try {
    const { id } = req.params;
    const data = await getExchangeSubmissionDetails(id);

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
    console.error("GET_EXCHANGE_SUBMISSION_DETAILS_ERROR:", error);
    return res.status(400).json({
      success: false,
      message: error?.message || "Erreur lors de la récupération"
    });
  }
}

export async function approveControllerExchangeSubmission(req, res) {
  try {
    const { id } = req.params;
    const catalogData = req.body?.catalog_data || null;

    const data = await approveExchangeSubmission(id, catalogData);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("APPROVE_EXCHANGE_SUBMISSION_ERROR:", error);
    return res.status(400).json({
      success: false,
      message: error?.message || "Erreur lors de la validation"
    });
  }
}

export async function rejectControllerExchangeSubmission(req, res) {
  try {
    const { id } = req.params;
    const data = await rejectExchangeSubmission(id);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("REJECT_EXCHANGE_SUBMISSION_ERROR:", error);
    return res.status(400).json({
      success: false,
      message: error?.message || "Erreur lors du refus"
    });
  }
}

