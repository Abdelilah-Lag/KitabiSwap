import "./AddInventoryModal.css";
import { useEffect, useMemo, useState } from "react";

export default function EditInventoryModal({
    open,
    row,
    onClose,
    onSubmit
}) {
    const initial = useMemo(() => {
        if (!row) return null;
        return {
            selling_price: row.selling_price ?? "",
            old_price: row.old_price ?? "",
            stock_quantity: row.stock_quantity ?? "0",
            min_stock_alert: row.min_stock_alert ?? "5",
            featured: !!row.featured,
            status: row.status ?? "available"
        };
    }, [row]);

    const [form, setForm] = useState(initial || {
        selling_price: "",
        old_price: "",
        stock_quantity: "0",
        min_stock_alert: "5",
        featured: false,
        status: "available"
    });

    useEffect(() => {
        if (!open) return;
        if (!row) return;
        setForm({
            selling_price: row.selling_price ?? "",
            old_price: row.old_price ?? "",
            stock_quantity: row.stock_quantity ?? "0",
            min_stock_alert: row.min_stock_alert ?? "5",
            featured: !!row.featured,
            status: row.status ?? "available"
        });
    }, [open, row]);

    if (!open || !row) return null;

    return (
        <div className="inventory-modal-overlay">
            <div className="inventory-modal">
                <div className="inventory-modal-header">
                    <h3>Modifier l'inventaire</h3>
                    <button className="inventory-modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="inventory-modal-body">
                    <div className="inventory-modal-summary">
                        <div>
                            <b>{row?.books_catalog?.title ?? ""}</b>
                        </div>
                        <div>{row?.books_catalog?.author ?? ""}</div>
                        <div>ISBN: {row?.books_catalog?.isbn ?? "-"}</div>
                    </div>

                    <div className="inventory-modal-form">
                        <label>
                            Prix de vente
                            <input
                                type="number"
                                step="0.01"
                                value={form.selling_price}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, selling_price: e.target.value }))
                                }
                            />
                        </label>

                        <label>
                            Ancien prix (optionnel)
                            <input
                                type="number"
                                step="0.01"
                                value={form.old_price}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, old_price: e.target.value }))
                                }
                            />
                        </label>

                        <label>
                            Quantité
                            <input
                                type="number"
                                step="1"
                                value={form.stock_quantity}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, stock_quantity: e.target.value }))
                                }
                            />
                        </label>

                        <label>
                            Stock minimum
                            <input
                                type="number"
                                step="1"
                                value={form.min_stock_alert}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, min_stock_alert: e.target.value }))
                                }
                            />
                        </label>

                        <label className="inventory-modal-checkbox">
                            <input
                                type="checkbox"
                                checked={!!form.featured}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, featured: e.target.checked }))
                                }
                            />
                            Featured
                        </label>

                        <label>
                            Statut
                            <select
                                value={form.status}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, status: e.target.value }))
                                }
                            >
                                <option value="available">Disponible</option>
                                <option value="out_of_stock">Rupture</option>
                                <option value="coming_soon">Bientôt</option>
                                <option value="discontinued">Désactivé</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="inventory-modal-footer">
                    <button
                        className="inventory-modal-submit"
                        onClick={() => {
                            const payload = {
                                selling_price: form.selling_price,
                                old_price: form.old_price === "" ? null : form.old_price,
                                stock_quantity: form.stock_quantity,
                                min_stock_alert: form.min_stock_alert,
                                featured: !!form.featured,
                                status: form.status
                            };
                            onSubmit?.(payload);
                        }}
                    >
                        Confirmer
                    </button>
                    <button className="inventory-modal-cancel" onClick={onClose}>
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}

