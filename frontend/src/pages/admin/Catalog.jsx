import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getCatalogBooks, toggleBookActive, deleteCatalogBook } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminCatalog() {
    const { t } = useTranslation();
    const [books, setBooks] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 });
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const loadBooks = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (search) params.search = search;
            if (category) params.category = category;
            const res = await getCatalogBooks(params);
            setBooks(res.books || []);
            setPagination(res.pagination || { page: 1, total_pages: 1, total: 0 });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, category]);

    useEffect(() => { loadBooks(); }, [loadBooks]);

    async function handleToggleActive(id) {
        await toggleBookActive(id);
        loadBooks();
    }

    async function handleDelete(id) {
        if (window.confirm(t("confirm_delete_book"))) {
            await deleteCatalogBook(id);
            loadBooks();
        }
    }

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("catalog_management")}</h1>

                <div className="admin-filters">
                    <input
                        type="text"
                        placeholder={t("search_by_title_author_isbn")}
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="admin-search-input"
                    />
                    <input
                        type="text"
                        placeholder={t("category")}
                        value={category}
                        onChange={e => { setCategory(e.target.value); setPage(1); }}
                    />
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t("image")}</th>
                                <th>{t("title")}</th>
                                <th>{t("author")}</th>
                                <th>{t("isbn")}</th>
                                <th>{t("category")}</th>
                                <th>{t("language")}</th>
                                <th>{t("active")}</th>
                                <th>{t("created_at")}</th>
                                <th>{t("actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book => (
                                <tr key={book.id}>
                                    <td>
                                        {book.book_images?.[0]?.image_url ? (
                                            <img src={book.book_images[0].image_url} alt="" className="admin-book-thumb" />
                                        ) : "📖"}
                                    </td>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.isbn || "-"}</td>
                                    <td>{book.category || "-"}</td>
                                    <td>{book.language || "-"}</td>
                                    <td>
                                        <span className={`admin-status-badge ${book.is_active ? "active" : "inactive"}`}>
                                            {book.is_active ? t("yes") : t("no")}
                                        </span>
                                    </td>
                                    <td>{new Date(book.created_at).toLocaleDateString("fr-FR")}</td>
                                    <td>
                                        <div className="admin-actions">
                                            <button onClick={() => handleToggleActive(book.id)} className="admin-btn-sm warning">
                                                {book.is_active ? t("deactivate") : t("activate")}
                                            </button>
                                            <button onClick={() => handleDelete(book.id)} className="admin-btn-sm danger">{t("delete")}</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {books.length === 0 && (
                                <tr><td colSpan={9} className="admin-empty">{t("no_books_found")}</td></tr>
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

