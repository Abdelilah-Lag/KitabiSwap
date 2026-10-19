import { useMemo, useState } from "react";

import "./SellSubmissionCard.css";

import SellSubmissionDetailsModal from "./SellSubmissionDetailsModal";
import EditCatalogBookModal from "./EditCatalogBookModal";
import ApproveSubmissionModal from "./ApproveSubmissionModal";
import RejectSubmissionModal from "./RejectSubmissionModal";

export default function SellSubmissionCard({ submission, onRefresh }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  /*
  =====================================
  LOCAL CATALOG OVERRIDE
  Filled by EditCatalogBookModal and sent
  to the backend on approve, so the values
  inserted into `books_catalog` are the
  admin-validated ones.
  =====================================
  */
  const [catalogOverride, setCatalogOverride] = useState(null);

  const badge = useMemo(() => {
    return submission?.book_catalog_id
      ? "Livre déjà existant"
      : "Nouveau livre";
  }, [submission]);

  /*
  =====================================
  LIST ENDPOINT RETURNS FLAT DATA
  (not nested under book/sale/images)
  =====================================
  */
  const cover = submission?.cover_image;
  const title = catalogOverride?.title  ?? submission?.title;
  const author = catalogOverride?.author ?? submission?.author;
  const condition = submission?.book_condition;
  const price = submission?.price;

  return (
    <div className="sell-submission-card">
      <div className="card-top">
        <div className="user">
          <img
            className="user-avatar"
            src={submission?.user?.avatar_url || "/images/mon_image.jpg"}
            alt="user"
          />

          <div>
            <div className="user-name">
              {submission?.user?.first_name} {submission?.user?.last_name}
            </div>

            <div className="user-meta">
              {submission?.user?.email}
            </div>

            <div className="user-meta">
              {submission?.user?.phone}
            </div>
          </div>
        </div>

        <div className="badge">
          {badge}
        </div>
      </div>

      <div className="card-body">
        <div className="submission-id">
          Proposition #{submission?.id}
        </div>

        <div className="created-at">
          Date :{" "}
          {submission?.created_at
            ? new Date(submission.created_at).toLocaleDateString()
            : ""}
        </div>

        <div className="book-mini">
          <img
            className="cover"
            src={cover?.image_url || "/images/book-placeholder.png"}
            alt="book"
          />

          <div>
            <div className="book-title">
              {title}
            </div>

            <div className="book-author">
              {author}
            </div>

            <div className="book-sale">
              Condition : {condition}
            </div>

            <div className="book-sale">
              Prix demandé : {price} DH
            </div>

            {catalogOverride && !submission?.book_catalog_id && (
              <div className="book-sale" style={{ color: "#2e7d32" }}>
                ✓ Informations modifiées
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-actions">
        <button
          className="btn"
          onClick={() => setDetailsOpen(true)}
        >
          Voir détails
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setEditOpen(true)}
          disabled={!!submission?.book_catalog_id}
          title={
            submission?.book_catalog_id
              ? "Le livre est déjà dans le catalogue"
              : "Modifier les informations avant insertion"
          }
        >
          Modifier
        </button>

        <button
          className="btn btn-primary"
          onClick={() => setApproveOpen(true)}
        >
          Confirmer
        </button>

        <button
          className="btn btn-danger"
          onClick={() => setRejectOpen(true)}
        >
          Refuser
        </button>
      </div>

      <SellSubmissionDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        submissionId={submission?.id}
      />

      <EditCatalogBookModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        submission={submission}
        initialData={catalogOverride}
        onUpdated={(data) => {
          setCatalogOverride(data);
          setEditOpen(false);
        }}
      />

      <ApproveSubmissionModal
        isOpen={approveOpen}
        onClose={() => setApproveOpen(false)}
        submissionId={submission?.id}
        catalogData={catalogOverride}
        onApproved={() => {
          setApproveOpen(false);
          setCatalogOverride(null);
          onRefresh();
        }}
      />

      <RejectSubmissionModal
        isOpen={rejectOpen}
        onClose={() => setRejectOpen(false)}
        submissionId={submission?.id}
        onRejected={() => {
          setRejectOpen(false);
          onRefresh();
        }}
      />
    </div>
  );
}
