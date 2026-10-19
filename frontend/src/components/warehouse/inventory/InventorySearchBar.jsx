import "./InventorySearchBar.css";

import { useEffect, useState } from "react";

export default function InventorySearchBar({
    value = "",
    onChange,
    onSearch
}) {
    const [local, setLocal] = useState(value);

    useEffect(() => {
        setLocal(value || "");
    }, [value]);

    function handleSearch() {
        const q = local.trim();
        onSearch?.(q);
    }

    return (
        <div className="inventory-searchbar">
            <input
                id="warehouse-inventory-search-input"
                className="inventory-search-input"
                type="text"
                placeholder="Rechercher par titre, auteur, ISBN ou catégorie"
                value={local}
                onChange={(e) => {
                    setLocal(e.target.value);
                    onChange?.(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch();
                    }
                }}
            />
            <button
                type="button"
                className="inventory-search-button"
                onClick={handleSearch}
            >
                Rechercher
            </button>
        </div>
    );
}
