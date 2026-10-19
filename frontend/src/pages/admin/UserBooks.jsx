import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getUserBooks, updateUserBook, deleteUserBook } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminUserBooks() {
    const { t } = useTranslation();
    const [books, setBooks] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (status) params.status = status;
            const res = await getUserBooks(params);
            setBooks(res.books || []);
            setPagination(res.pagination || {});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, status]);

    useEffect(() => { load(); }, [load]);

    async function handleDelete(id) {
        if (window.confirm(t("confirm_delete"))) {
            await deleteUserBook(id);
            load();
        }
    }

    const statusLabels = {
        available: { label: t("available"), class: "success" },
        reserved: { label: t("reserved"), class: "warning" },
        exchanged: { label: t("exchanged"), class: "info" },
        sold: { label: t("sold"), class: "dark" },
        hidden: { label: t("hidden"), class: "danger" }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("user_books_management")}</h1>

                <div className="admin-filters">
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                        <option value="">{t("all_statuses")}</option>
                        <option value="available">{t("available")}</option>
                        <option value="reserved">{t("reserved")}</option>
                        <option value="exchanged">{t("exchanged")}</option>
                        <option value="sold">{t("sold")}</option>
                        <option value="hidden">{t("hidden")}</option>
                    </select>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t("book")}</th>
                                <th>{t("owner")}</th>
                                <th>{t("condition")}</th>
                                <th>{t("estimated_price")}</th>
                                <th>{t("status")}</th>
                                <th>{t("created_at")}</th>
                                <th>{t("actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book => (
                                <tr key={book.id}>
                                    <td>{book.books_catalog?.title || "-"}</td>
                                    <td>{book.users?.first_name} {book.users?.last_name}</td>
                                    <td>{book.book_condition || "-"}</td>
                                    <td>{book.estimated_price ? `${Number(book.estimated_price).toFixed(2)} DH` : "-"}</td>
                                    <td><span className={`admin-badge ${statusLabels[book.status]?.class || "info"}`}>{book.status}</span></td>
                                    <td>{new Date(book.created_at).toLocaleDateString("fr-FR")}</td>
                                    <td>
                                        <button onClick={() => handleDelete(book.id)} className="admin-btn-sm danger">{t("delete")}</button>
                                    </td>
                                </tr>
                            ))}
                            {books.length === 0 && (
                                <tr><td colSpan={7} className="admin-empty">{t("no_books_found")}</td></tr>
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

