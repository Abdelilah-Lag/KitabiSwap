import { useState } from "react";

import "./RejectSubmissionModal.css";

import { rejectExchangeSubmission } from "../../../services/controllerExchangeSubmissionService";

export default function RejectExchangeSubmissionModal({
  isOpen,
  onClose,
  submissionId,
  onRejected
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  async function onReject() {
    try {
      setLoading(true);
      setError(null);
      await rejectExchangeSubmission(submissionId);
      onRejected?.();
    } catch (e) {
      setError(e?.message || "Erreur lors du refus");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal modal-sm">
        <div className="modal-header">
          <h2>Refuser la proposition ?</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ opacity: 0.85, marginBottom: 12 }}>
            Les images Cloudinary seront supprimées et la proposition sera effacée.
          </div>
          {error && <div className="modal-error">{error}</div>}
          <div className="modal-actions">
            <button className="btn" onClick={onClose} disabled={loading}>
              Annuler
            </button>
            <button className="btn btn-danger" onClick={onReject} disabled={loading}>
              {loading ? "Refus..." : "Refuser"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

