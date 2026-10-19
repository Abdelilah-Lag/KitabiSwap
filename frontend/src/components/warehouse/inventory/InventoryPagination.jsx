import "./InventoryPagination.css";

export default function InventoryPagination({ pagination, onPageChange, onPageSizeChange, pageSize }) {
    const p = pagination || { page: 1, totalPages: 1 };
    const page = p.page ?? 1;
    const totalPages = p.totalPages ?? 1;

    return (
        <div className="inventory-pagination">
            <div className="inventory-page-size">
                <label>Par page</label>
                <select value={pageSize} onChange={(e) => onPageSizeChange?.(Number(e.target.value))}>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>

            <div className="inventory-page-controls">
                <button disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
                    Précédent
                </button>
                <span>
                    {page} / {totalPages}
                </span>
                <button disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)}>
                    Suivant
                </button>
            </div>
        </div>
    );
}

