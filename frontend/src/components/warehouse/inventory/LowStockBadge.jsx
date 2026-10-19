import "./InventoryRow.css";

export default function LowStockBadge({ stockQuantity, minStockAlert, row }) {
    const qty = row?.stock_quantity ?? stockQuantity ?? 0;
    const min = row?.min_stock_alert ?? minStockAlert ?? 0;

    const isLow = Number(qty) <= Number(min);

    if (!isLow) return null;

    return (
        <span
            className="inventory-lowstock-badge"
            title={`Stock faible: ${qty} <= ${min}`}
        >
            Stock faible
        </span>
    );
}


