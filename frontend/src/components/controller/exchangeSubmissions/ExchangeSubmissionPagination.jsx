import "./ExchangeSubmissionPagination.css";

export default function ExchangeSubmissionPagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="exchange-submission-pagination">
      <button className="btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Précédent
      </button>
      <div className="pagination-info">
        Page {page} / {totalPages}
      </div>
      <button
        className="btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Suivant
      </button>
    </div>
  );
}

