import "./CataloguePagination.css";

export default function CataloguePagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange
}) {
  const safeTotal = Number(totalPages || 0);
  const canPrev = page > 1;
  const canNext = page < safeTotal;

  return (
    <div className="warehouse-catalogue-pagination">
      <div className="warehouse-catalogue-pagination-left">
        <button disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
          Précédent
        </button>
        <span>Page {page} / {safeTotal || 1}</span>
        <button disabled={!canNext} onClick={() => onPageChange(page + 1)}>
          Suivant
        </button>
      </div>

      <div className="warehouse-catalogue-pagination-right">
        <label>
          Taille page
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
            {[10, 25, 50, 100].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

