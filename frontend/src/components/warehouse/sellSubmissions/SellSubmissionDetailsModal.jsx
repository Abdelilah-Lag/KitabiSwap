import { useEffect, useState } from "react";

import "./SellSubmissionDetailsModal.css";

import {
  getSubmissionDetails
} from "../../../services/warehouseSellSubmissionService";

export default function SellSubmissionDetailsModal({ isOpen, onClose, submissionId }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await getSubmissionDetails(submissionId);
        setData(res?.data ?? null);
      } catch (e) {
        setError(e?.message || "Erreur chargement détails");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isOpen, submissionId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>Détails proposition</h2>
            <div className="muted">#{data?.id}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div>Chargement...</div>
          ) : error ? (
            <div className="modal-error">{error}</div>
          ) : !data ? (
            <div>Introuvable</div>
          ) : (
            <div className="details-grid">
              <div className="details-section">
                <h3>Informations utilisateur</h3>
                <div><strong>Nom:</strong> {data?.user?.first_name} {data?.user?.last_name}</div>
                <div><strong>Email:</strong> {data?.user?.email}</div>
                <div><strong>Téléphone:</strong> {data?.user?.phone}</div>
              </div>

              <div className="details-section">
                <h3>Etat proposition</h3>
                <div><strong>Numéro:</strong> {data?.id}</div>
                <div><strong>Date:</strong> {data?.created_at ? new Date(data.created_at).toLocaleString() : ""}</div>
                <div><strong>Etat:</strong> {data?.status}</div>
                <div><strong>Catalogue:</strong> {data?.book_catalog_id ? "Livre déjà existant" : "Nouveau livre"}</div>
              </div>

              <div className="details-section">
                <h3>Informations livre</h3>
                <div><strong>ISBN:</strong> {data?.book?.isbn}</div>
                <div><strong>Titre:</strong> {data?.book?.title}</div>
                <div><strong>Sous-titre:</strong> {data?.book?.subtitle}</div>
                <div><strong>Auteur:</strong> {data?.book?.author}</div>
                <div><strong>Editeur:</strong> {data?.book?.publisher}</div>
                <div><strong>Edition:</strong> {data?.book?.edition}</div>
                <div><strong>Année:</strong> {data?.book?.publication_year}</div>
                <div><strong>Langue:</strong> {data?.book?.language}</div>
                <div><strong>Catégorie:</strong> {data?.book?.category}</div>
                <div><strong>Type:</strong> {data?.book?.book_type}</div>
                <div><strong>Couverture:</strong> {data?.book?.cover_type}</div>
                <div><strong>Public cible:</strong> {data?.book?.target_audience}</div>
                <div><strong>Pages:</strong> {data?.book?.pages}</div>
                <div><strong>Pages couleur:</strong> {data?.book?.pages_color}</div>
                <div><strong>Dimensions:</strong> {data?.book?.dimensions}</div>
                <div><strong>Poids:</strong> {data?.book?.weight}</div>
                <div><strong>Description:</strong> {data?.book?.description}</div>
                <div><strong>Résumé:</strong> {data?.book?.summary}</div>
                <div><strong>Keywords:</strong> {data?.book?.search_keywords}</div>
                <div><strong>Note moyenne:</strong> {data?.book?.average_rating}</div>
              </div>

              <div className="details-section">
                <h3>Informations vente</h3>
                <div><strong>Etat du livre:</strong> {data?.sale?.book_condition}</div>
                <div><strong>Prix demandé:</strong> {data?.sale?.price} DH</div>
                <div><strong>Prix estimé:</strong> {data?.sale?.estimated_price} DH</div>
              </div>

              <div className="details-section">
                <h3>Images</h3>
                <div className="images-grid">
                  {(data?.images?.gallery || []).map(img => (
                    <div key={img.id} className="img-item">
                      <img src={img.image_url} alt="submission" />
                      <div className="img-meta">{img.is_cover ? "Cover" : ""} #{img.sort_order}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

