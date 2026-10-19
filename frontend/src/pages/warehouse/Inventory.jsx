import "./Inventory.css";

import { useEffect, useMemo, useState } from "react";

import WarehouseLayout from "../../components/warehouse/WarehouseLayout";

import InventorySearchBar from "../../components/warehouse/inventory/InventorySearchBar";
import InventoryTable from "../../components/warehouse/inventory/InventoryTable";
import InventoryFilters from "../../components/warehouse/inventory/InventoryFilters";
import InventoryPagination from "../../components/warehouse/inventory/InventoryPagination";
import InventoryStats from "../../components/warehouse/inventory/InventoryStats";
import InventoryAddStockSection from "../../components/warehouse/inventory/InventoryAddStockSection";

import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";

import {
    getInventory,
    searchCatalog,
    deleteInventory as deleteInventoryApi
} from "../../services/warehouseInventoryService";

export default function Inventory() {
    const [loading, setLoading] = useState(true);

    const [inventory, setInventory] = useState({
        data: [],
        statistics: null,
        pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 }
    });

    const [catalogResults, setCatalogResults] = useState([]);
    const [catalogLoading, setCatalogLoading] = useState(false);

    const [filters, setFilters] = useState({
        q: "",
        status: "",
        featured: "",
        low_stock: ""
    });

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 25
    });

    const effectiveFilters = useMemo(() => ({
        q: filters.q || undefined,
        status: filters.status || undefined,
        featured: filters.featured || undefined,
        low_stock: filters.low_stock || undefined
    }), [filters]);

    // Unwrap {success, data} envelope from controller responses.
    function unwrap(res) {
        if (res && typeof res === "object" && "success" in res && "data" in res) {
            return res.data;
        }
        return res;
    }

    async function loadInventory(nextPage = pagination.page, nextPageSize = pagination.pageSize) {
        setLoading(true);
        try {
            const res = await getInventory({
                page: nextPage,
                pageSize: nextPageSize,
                ...effectiveFilters
            });
            const data = unwrap(res);
            setInventory({
                data: data?.data || [],
                statistics: data?.statistics || null,
                pagination: data?.pagination || {
                    page: nextPage,
                    pageSize: nextPageSize,
                    total: 0,
                    totalPages: 0
                }
            });
        } catch (err) {
            console.error("[WarehouseInventory] loadInventory error:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadInventory(1, pagination.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effectiveFilters.status, effectiveFilters.featured, effectiveFilters.low_stock]);

    async function runCatalogSearch(q) {
        setFilters((p) => ({ ...p, q }));
        if (!q || !q.trim()) {
            setCatalogResults([]);
            return;
        }
        setCatalogLoading(true);
        try {
            const res = await searchCatalog({ q });
            const payload = unwrap(res);
            setCatalogResults(payload?.data || []);
        } catch (e) {
            console.error("[WarehouseInventory] catalog search error:", e);
            setCatalogResults([]);
        } finally {
            setCatalogLoading(false);
        }
    }

    if (loading) {
        return (
            <WarehouseLayout>
                <LoadingSpinner />
            </WarehouseLayout>
        );
    }

    const stats = inventory.statistics || {
        totalProducts: 0,
        availableCount: 0,
        lowStockCount: 0,
        featuredCount: 0,
        totalInventoryValue: "0.00"
    };

    return (
        <WarehouseLayout>
            <div className="warehouse-inventory">
                <div className="warehouse-inventory-actions">
                    <button
                        type="button"
                        className="warehouse-inventory-addbook-btn"
                        onClick={() => {
                            document
                                .getElementById("warehouse-inventory-catalog")
                                ?.scrollIntoView({ behavior: "smooth", block: "start" });
                            const input = document.getElementById(
                                "warehouse-inventory-search-input"
                            );
                            if (input) {
                                input.focus();
                            }
                        }}
                    >
                        + Ajouter un livre
                    </button>
                </div>

                <InventoryStats statistics={stats} />

                <InventorySearchBar
                    value={filters.q}
                    onChange={(q) => setFilters((p) => ({ ...p, q }))}
                    onSearch={runCatalogSearch}
                />

                <InventoryAddStockSection
                    results={catalogResults}
                    catalogLoading={catalogLoading}
                    onAdded={() => {
                        setCatalogResults([]);
                        setFilters((p) => ({ ...p, q: "" }));
                        loadInventory(pagination.page, pagination.pageSize);
                    }}
                />

                <InventoryFilters
                    status={filters.status}
                    featured={filters.featured}
                    low_stock={filters.low_stock}
                    onChange={(next) => setFilters((p) => ({ ...p, ...next }))}
                    onApply={() => loadInventory(1, pagination.pageSize)}
                />

                <InventoryTable
                    rows={inventory.data}
                    onDelete={async (id) => {
                        try {
                            await deleteInventoryApi(id);
                            await loadInventory(pagination.page, pagination.pageSize);
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                    onUpdate={async () => {
                        await loadInventory(pagination.page, pagination.pageSize);
                    }}
                />

                <InventoryPagination
                    pagination={inventory.pagination}
                    onPageChange={(page) => {
                        setPagination((p) => ({ ...p, page }));
                        loadInventory(page, pagination.pageSize);
                    }}
                    pageSize={pagination.pageSize}
                    onPageSizeChange={(pageSize) => {
                        setPagination({ page: 1, pageSize });
                        loadInventory(1, pageSize);
                    }}
                />
            </div>
        </WarehouseLayout>
    );
}
