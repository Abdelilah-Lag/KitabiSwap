import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getInventory, updateInventoryItem, deleteInventoryItem } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminInventory() {
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 });
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (search) params.search = search;
            if (status) params.status = status;
            const res = await getInventory(params);
            setItems(res.items || []);
            setPagination(res.pagination || {});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, status]);

    useEffect(() => { load(); }, [load]);

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("inventory_management")}</h1>

                <div className="admin-filters">
                    <input type="text" placeholder={t("search_books")} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="admin-search-input" />
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                        <option value="">{t("all_statuses")}</option>
                        <option value="available">{t("available")}</option>
                        <option value="out_of_stock">{t("out_of_stock")}</option>
                        <option value="discontinued">{t("discontinued")}</option>
                    </select>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t("title")}</th>
                                <th>{t("author")}</th>
                                <th>{t("selling_price")}</th>
                                <th>{t("old_price")}</th>
                                <th>{t("stock")}</th>
                                <th>{t("status")}</th>
                                <th>{t("featured")}</th>
                                <th>{t("updated_at")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.books_catalog?.title || "-"}</td>
                                    <td>{item.books_catalog?.author || "-"}</td>
                                    <td>{Number(item.selling_price).toFixed(2)} DH</td>
                                    <td>{item.old_price ? `${Number(item.old_price).toFixed(2)} DH` : "-"}</td>
                                    <td>{item.stock_quantity ?? 0}</td>
                                    <td><span className={`admin-status-badge ${item.status}`}>{item.status}</span></td>
                                    <td>{item.featured ? "⭐" : "-"}</td>
                                    <td>{new Date(item.updated_at).toLocaleDateString("fr-FR")}</td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr><td colSpan={8} className="admin-empty">{t("no_inventory_found")}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-pagination">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>{t("previous")}</button>
                    <span>{t("page")} {page} / {pagination.total_pages}</span>
                    <button disabled={page >= pagination.total_pages} onClick={() => setPage(p => p + 1)}>{t("next")}</button>
                </div>
            </div>
        </AdminLayout>
    );
}

