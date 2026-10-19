import "./InventoryStats.css";

export default function InventoryStats({ statistics }) {
    const s = statistics || {};
    return (
        <div className="inventory-stats">
            <div className="inventory-stat-card">
                <div className="inventory-stat-label">Total produits</div>
                <div className="inventory-stat-value">{s.totalProducts ?? 0}</div>
            </div>
            <div className="inventory-stat-card">
                <div className="inventory-stat-label">Produits disponibles</div>
                <div className="inventory-stat-value">{s.availableCount ?? 0}</div>
            </div>
            <div className="inventory-stat-card">
                <div className="inventory-stat-label">Stock faible</div>
                <div className="inventory-stat-value">{s.lowStockCount ?? 0}</div>
            </div>
            <div className="inventory-stat-card">
                <div className="inventory-stat-label">Valeur du stock</div>
                <div className="inventory-stat-value">{s.totalInventoryValue ?? "0.00"}</div>
            </div>
        </div>
    );
}

