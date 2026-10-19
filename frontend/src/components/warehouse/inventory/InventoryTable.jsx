import "./InventoryTable.css";

import InventoryRow from "./InventoryRow";

export default function InventoryTable({ rows = [], onDelete, onUpdate }) {
    return (
        <div className="inventory-table-wrapper">
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Titre</th>
                        <th>Auteur</th>
                        <th>Prix</th>
                        <th>Stock</th>
                        <th>Stock minimum</th>
                        <th>Featured</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="inventory-empty">
                                Aucun produit en inventaire.
                            </td>
                        </tr>
                    ) : (
                        rows.map((r) => (
                            <InventoryRow key={r.id} row={r} onDelete={onDelete} onUpdate={onUpdate} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

