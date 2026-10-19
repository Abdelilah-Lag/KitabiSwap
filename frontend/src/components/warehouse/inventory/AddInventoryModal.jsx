import "./AddInventoryModal.css";
import { useEffect, useState } from "react";

const DEFAULT_FORM = {
    selling_price: "",
    old_price: "",
    stock_quantity: "0",
    min_stock_alert: "5",
    featured: false,
    status: "available"
};

export default function AddInventoryModal({
    open,
    book,
    onClose,
    onSubmit
}) {
    const [form, setForm] = useState(DEFAULT_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Reset when the modal opens with a new book.
    useEffect(() => {
        if (!open || !book) return;
        setForm(DEFAULT_FORM);
        setError(null);
        setSubmitting(false);
    }, [open, book?.id]);

    if (!open || !book) return null;

    async function handleSubmit() {
        // Basic validation — the field is required by shop_inventory schema.
        const sellingNumber = Number(form.selling_price);
        if (!form.selling_price || Number.isNaN(sellingNumber) || sellingNumber < 0) {
            setError("Le prix de vente est obligatoire et doit être un nombre positif.");
            return;
        }

        const token =
            typeof window !== "undefined"
                ? window.localStorage.getItem("token")
                : null;

        if (!token) {
            setError("Veuillez vous connecter pour continuer.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                book_catalog_id: book.id,
                selling_price: sellingNumber,
                old_price:
                    form.old_price === "" || form.old_price === null
                        ? null
                        : Number(form.old_price),
                stock_quantity:
                    form.stock_quantity === "" ? 0 : Number(form.stock_quantity),
                min_stock_alert:
                    form.min_stock_alert === "" ? 0 : Number(form.min_stock_alert),
                featured: !!form.featured,
                status: form.status
            };

            await onSubmit?.(payload);
            // onSubmit closes the modal on success (via onClose from parent).
        } catch (e) {
            const message =
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                e?.message ||
                "Erreur lors de l'ajout au stock";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div
            className="inventory-modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !submitting) {
                    onClose?.();
                }
            }}
        >
            <div className="inventory-modal">
                <div className="inventory-modal-header">
                    <h3>Ajouter au stock</h3>
                    <button
                        type="button"
                        className="inventory-modal-close"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        ✕
                    </button>
                </div>

                <div className="inventory-modal-body">
                    <div className="inventory-modal-summary">
                        <div><b>{book.title}</b></div>
                        <div>{book.author}</div>
                        <div>ISBN: {book.isbn || "—"}</div>
                    </div>

                    {error ? (
                        <div className="inventory-modal-error" role="alert" style={{
                            background: "#fdecec",
                            color: "#8a1f1f",
                            border: "1px solid #f5c2c2",
                            borderRadius: 8,
                            padding: 10,
                            marginBottom: 10
                        }}>
                            {error}
                        </div>
                    ) : null}

                    <div className="inventory-modal-form">
                        <label>
                            Prix de vente *
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.selling_price}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, selling_price: e.target.value }))
                                }
                                disabled={submitting}
                                required
                            />
                        </label>

                        <label>
                            Ancien prix (optionnel)
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.old_price}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, old_price: e.target.value }))
                                }
                                disabled={submitting}
                            />
                        </label>

                        <label>
                            Quantité
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={form.stock_quantity}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, stock_quantity: e.target.value }))
                                }
                                disabled={submitting}
                            />
                        </label>

                        <label>
                            Stock minimum
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={form.min_stock_alert}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, min_stock_alert: e.target.value }))
                                }
                                disabled={submitting}
                            />
                        </label>

                        <label className="inventory-modal-checkbox">
                            <input
                                type="checkbox"
                                checked={!!form.featured}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, featured: e.target.checked }))
                                }
                                disabled={submitting}
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
                                disabled={submitting}
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
                        type="button"
                        className="inventory-modal-cancel"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        className="inventory-modal-submit"
                        disabled={submitting}
                        onClick={handleSubmit}
                    >
                        {submitting ? "En cours..." : "Confirmer"}
                    </button>
                </div>
            </div>
        </div>
    );
}
