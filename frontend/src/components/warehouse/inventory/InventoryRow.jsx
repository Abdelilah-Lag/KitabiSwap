import "./InventoryRow.css";

import LowStockBadge from "./LowStockBadge";

export default function InventoryRow({ row, onDelete, onUpdate }) {
    const cover = row?.cover?.image_url || null;
    return (
        <tr>
            <td>
                {cover ? <img className="inventory-row-cover" src={cover} alt="cover" /> : <span className="inventory-row-noimg">-</span>}
            </td>
            <td>{row?.books_catalog?.title ?? ""}</td>
            <td>{row?.books_catalog?.author ?? ""}</td>
            <td>{row?.selling_price ?? 0} DH</td>
            <td>{row?.stock_quantity ?? 0}</td>
            <td>{row?.min_stock_alert ?? 0}</td>
            <td>{row?.featured ? "Oui" : "Non"}</td>
            <td>
                {row?.status ?? ""}
                <div style={{ marginTop: 6 }}>
                    <LowStockBadge row={row} />
                </div>
            </td>

            <td>
                <div className="inventory-actions">
                    <button
                        className="inventory-action-btn"
                        onClick={() => {
                            const newQty = prompt("Modifier stock_quantity", row?.stock_quantity ?? 0);
                            if (newQty === null) return;
                            const selling = prompt("Modifier selling_price (laisser vide si inchangé)", row?.selling_price ?? 0);
                            const payload = {
                                stock_quantity: Number(newQty),
                                ...(selling !== null && selling !== "" ? { selling_price: Number(selling) } : {})
                            };
                            import("../../../services/warehouseInventoryService")
                                .then((m) => m.updateInventory(row.id, payload))
                                .then(() => onUpdate?.())
                                .catch((e) => console.error(e));
                        }}
                    >
                        Modifier
                    </button>
                    <button
                        className="inventory-action-btn inventory-action-delete"
                        onClick={() => {
                            if (!confirm("Supprimer cet élément d'inventaire ?")) return;
                            onDelete?.(row.id);
                        }}
                    >
                        Supprimer
                    </button>
                </div>
            </td>
        </tr>
    );
}

