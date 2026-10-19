import "./InventoryFilters.css";

export default function InventoryFilters({ status, featured, low_stock, onChange, onApply }) {
    return (
        <div className="inventory-filters">
            <select
                value={status}
                onChange={(e) => onChange?.({ status: e.target.value })}
            >
                <option value="">Statut: Tous</option>
                <option value="available">Disponible</option>
                <option value="out_of_stock">Rupture</option>
                <option value="coming_soon">Bientôt</option>
                <option value="discontinued">Désactivé</option>
            </select>

            <select
                value={low_stock}
                onChange={(e) => onChange?.({ low_stock: e.target.value })}
            >
                <option value="">Stock faible: Tous</option>
                <option value="true">Stock faible</option>
                <option value="false">Pas stock faible</option>
            </select>

            <select
                value={featured}
                onChange={(e) => onChange?.({ featured: e.target.value })}
            >
                <option value="">Featured: Tous</option>
                <option value="true">Featured</option>
                <option value="false">Non featured</option>
            </select>

            <button className="inventory-filters-apply" onClick={onApply}>
                Appliquer
            </button>
        </div>
    );
}

