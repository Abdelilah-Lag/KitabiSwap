import { useEffect, useState } from "react";

import "./ApproveExchangeSubmissionModal.css";

import { approveExchangeSubmission } from "../../../services/controllerExchangeSubmissionService";

export default function ApproveExchangeSubmissionModal({
  isOpen,
  onClose,
  submissionId,
  catalogData,
  onApproved
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
      setError(null);
    }
  }, [isOpen]);

  async function handleApprove() {
    try {
      setLoading(true);
      setError(null);
      await approveExchangeSubmission(submissionId, catalogData);
      onApproved();
    } catch (e) {
      console.error(e);
      setError(e?.message || "Erreur lors de l'approbation");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal small">
        <div className="modal-header">
          <div>
            <h2>Accepter la proposition</h2>
            <div className="muted">#{submissionId}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p>Cette action va créer le livre dans le catalogue si nécessaire et l’insérer dans <strong>user_books</strong>.</p>

          {error && <div className="modal-error">{error}</div>}

          <div className="modal-actions">
            <button className="btn" disabled={loading} onClick={onClose}>
              Annuler
            </button>
            <button className="btn btn-primary" disabled={loading} onClick={handleApprove}>
              {loading ? "Validation..." : "Accepter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

