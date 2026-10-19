import { useState } from "react";

import "./RejectSubmissionModal.css";

import {
  approveSubmission
} from "../../../services/warehouseSellSubmissionService";

export default function ApproveSubmissionModal({
  isOpen,
  onClose,
  submissionId,
  catalogData,
  onApproved
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  async function onConfirm() {
    try {
      setLoading(true);
      setError(null);
      /*
      =====================================
      Pass the admin-edited catalog data
      (may be null if no edits were made)
      =====================================
      */
      await approveSubmission(submissionId, catalogData);
      onApproved?.();
    } catch (e) {
      setError(e?.message || "Erreur lors de la validation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal modal-sm">
        <div className="modal-header">
          <h2>Confirmer la proposition ?</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{opacity:.85,marginBottom:12}}>
            Le livre sera ajouté au catalogue (si nécessaire) et les images
            seront déplacées vers le stockage officiel.
          </div>
          {catalogData && (
            <div style={{
              background: "#e8f5e9",
              border: "1px solid #a5d6a7",
              padding: "8px 10px",
              borderRadius: 6,
              marginBottom: 12,
              fontSize: 13
            }}>
              Les informations modifiées seront utilisées pour l'insertion
              dans le catalogue.
            </div>
          )}
          {error && <div className="modal-error">{error}</div>}
          <div className="modal-actions">
            <button className="btn" onClick={onClose} disabled={loading}>Annuler</button>
            <button className="btn btn-primary" onClick={onConfirm} disabled={loading}>
              {loading ? "Validation..." : "Confirmer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
