import "./AddInventoryModal.css";

export default function DeleteInventoryModal({
    open,
    row,
    onClose,
    onConfirm
}) {
    if (!open || !row) return null;

    return (
        <div className="inventory-modal-overlay">
            <div className="inventory-modal" style={{ width: "min(520px,95vw)" }}>
                <div className="inventory-modal-header">
                    <h3>Supprimer l'inventaire</h3>
                    <button className="inventory-modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="inventory-modal-body">
                    <div style={{ marginBottom: 12 }}>
                        Confirmer la suppression
                        {row?.books_catalog?.title ? (
                            <span>
                                : <b>{row.books_catalog.title}</b>
                            </span>
                        ) : null}
                        ?
                    </div>
                </div>

                <div className="inventory-modal-footer">
                    <button
                        className="inventory-modal-submit"
                        style={{ background: "#b00020" }}
                        onClick={() => onConfirm?.()}
                    >
                        Supprimer
                    </button>
                    <button className="inventory-modal-cancel" onClick={onClose}>
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}

