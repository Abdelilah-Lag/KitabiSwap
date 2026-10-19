import { useState } from "react";

import InventoryBookSearchResult from "./InventoryBookSearchResult";
import AddInventoryModal from "./AddInventoryModal";

import { addToStock } from "../../../services/warehouseInventoryService";

export default function InventoryAddStockSection({
    results = [],
    catalogLoading = false,
    onAdded
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [error, setError] = useState(null);

    return (
        <div id="warehouse-inventory-catalog" className="warehouse-inventory-catalog">
            {catalogLoading ? (
                <div className="inventory-book-search-empty">
                    Recherche en cours...
                </div>
            ) : (
                <InventoryBookSearchResult
                    results={results}
                    onSelect={(b) => {
                        // Selecting a card opens the add modal directly so the
                        // "Add book" flow works without a second click.
                        setSelectedBook(b);
                        setModalOpen(true);
                    }}
                    onAdd={(b) => {
                        setSelectedBook(b);
                        setModalOpen(true);
                    }}
                />
            )}

            {error ? (
                <div
                    role="alert"
                    style={{
                        marginTop: 10,
                        padding: 10,
                        border: "1px solid #f5c2c2",
                        borderRadius: 8,
                        background: "#fdecec",
                        color: "#8a1f1f"
                    }}
                >
                    {error}
                </div>
            ) : null}

            <AddInventoryModal
                open={modalOpen}
                book={selectedBook}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedBook(null);
                }}
                onSubmit={async (payload) => {
                    setError(null);
                    try {
                        const res = await addToStock(payload);
                        if (res && res.success === false) {
                            throw new Error(res.message || "Erreur lors de l'ajout au stock");
                        }
                        setModalOpen(false);
                        setSelectedBook(null);
                        onAdded?.();
                    } catch (e) {
                        // Bubble to the modal so it can display the message,
                        // and also surface it here in case the modal closes.
                        setError(
                            e?.response?.data?.message ||
                            e?.message ||
                            "Erreur lors de l'ajout au stock"
                        );
                        throw e;
                    }
                }}
            />
        </div>
    );
}
