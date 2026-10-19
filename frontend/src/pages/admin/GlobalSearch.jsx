import { useState, useCallback, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { globalSearch } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function AdminGlobalSearch() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);

    const search = useCallback(async (q) => {
        if (q.length < 2) {
            setResults(null);
            return;
        }
        setLoading(true);
        try {
            const res = await globalSearch(q);
            setResults(res.results || {});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    function handleChange(e) {
        const val = e.target.value;
        setQuery(val);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => search(val), 400);
    }

    function goTo(type, id) {
        const paths = {
            catalog_books: `/admin/catalog`,
            users: `/admin/users`,
            orders: `/admin/orders`,
            exchanges: `/admin/exchanges`,
            deliveries: `/admin/deliveries`
        };
        if (paths[type]) navigate(paths[type]);
    }

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("global_search")}</h1>

                <div className="admin-global-search">
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder={t("search_anything")}
                        className="admin-search-input admin-search-large"
                        autoFocus
                    />
                    {loading && <p className="admin-search-loading">{t("searching")}</p>}
                </div>

                {results && (
                    <div className="admin-search-results">
                        {results.catalog_books?.length > 0 && (
                            <section>
                                <h3>📚 {t("catalog_books")} ({results.catalog_books.length})</h3>
                                <div className="admin-search-list">
                                    {results.catalog_books.map(book => (
                                        <div key={book.id} className="admin-search-item" onClick={() => goTo("catalog_books", book.id)}>
                                            <strong>{book.title}</strong> - {book.author}
                                            <span className="admin-search-meta">{book.isbn}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {results.users?.length > 0 && (
                            <section>
                                <h3>👥 {t("users")} ({results.users.length})</h3>
                                <div className="admin-search-list">
                                    {results.users.map(user => (
                                        <div key={user.id} className="admin-search-item" onClick={() => goTo("users", user.id)}>
                                            <strong>{user.first_name} {user.last_name}</strong>
                                            <span className="admin-search-meta">{user.email}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {results.orders?.length > 0 && (
                            <section>
                                <h3>📦 {t("orders")} ({results.orders.length})</h3>
                                <div className="admin-search-list">
                                    {results.orders.map(order => (
                                        <div key={order.id} className="admin-search-item" onClick={() => goTo("orders", order.id)}>
                                            <strong>#{order.id}</strong> - {Number(order.price).toFixed(2)} DH
                                            <span className={`admin-status-badge ${order.status}`}>{order.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {results.exchanges?.length > 0 && (
                            <section>
                                <h3>🔄 {t("exchanges")} ({results.exchanges.length})</h3>
                                <div className="admin-search-list">
                                    {results.exchanges.map(ex => (
                                        <div key={ex.id} className="admin-search-item" onClick={() => goTo("exchanges", ex.id)}>
                                            <strong>#{ex.id}</strong>
                                            <span className={`admin-status-badge ${ex.status}`}>{ex.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {results.deliveries?.length > 0 && (
                            <section>
                                <h3>🚚 {t("deliveries")} ({results.deliveries.length})</h3>
                                <div className="admin-search-list">
                                    {results.deliveries.map(del => (
                                        <div key={del.id} className="admin-search-item" onClick={() => goTo("deliveries", del.id)}>
                                            <strong>#{del.id}</strong> - {Number(del.total).toFixed(2)} DH
                                            <span className={`admin-status-badge ${del.status}`}>{del.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {results.transactions?.length > 0 && (
                            <section>
                                <h3>💳 {t("transactions")} ({results.transactions.length})</h3>
                                <div className="admin-search-list">
                                    {results.transactions.map(tx => (
                                        <div key={tx.id} className="admin-search-item">
                                            <strong>#{tx.id}</strong> - {tx.transaction_type} - {Number(tx.amount).toFixed(2)} DH
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {!results.catalog_books?.length && !results.users?.length && !results.orders?.length && !results.exchanges?.length && !results.deliveries?.length && !results.transactions?.length && (
                            <p className="admin-empty">{t("no_results_found")}</p>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

