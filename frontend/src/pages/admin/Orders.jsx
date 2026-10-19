import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getBookOrders, getOrder, updateOrderStatus, cancelOrder } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminOrders() {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (status) params.status = status;
            const res = await getBookOrders(params);
            setOrders(res.orders || []);
            setPagination(res.pagination || {});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, status]);

    useEffect(() => { load(); }, [load]);

    async function viewDetail(id) {
        try {
            const res = await getOrder(id);
            setDetail(res.order);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("magazine_orders")}</h1>

                <div className="admin-filters">
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                        <option value="">{t("all_statuses")}</option>
                        <option value="en_cours">{t("in_progress")}</option>
                        <option value="valide">{t("validated")}</option>
                        <option value="refuse">{t("refused")}</option>
                    </select>
                </div>

                {detail ? (
                    <div className="admin-detail-card">
                        <button onClick={() => setDetail(null)} className="admin-btn-sm">{t("back")}</button>
                        <h3>{t("order")} #{detail.id}</h3>
                        <p><strong>{t("client")}:</strong> {detail.users?.first_name} {detail.users?.last_name} ({detail.users?.email})</p>
                        <p><strong>{t("amount")}:</strong> {Number(detail.price).toFixed(2)} DH</p>
                        <p><strong>{t("delivery_price")}:</strong> {Number(detail.delivery_price).toFixed(2)} DH</p>
                        <p><strong>{t("payment")}:</strong> {detail.payment_method}</p>
                        <p><strong>{t("status")}:</strong> <span className={`admin-badge ${detail.status}`}>{detail.status}</span></p>
                        {detail.shop_inventory?.books_catalog && (
                            <p><strong>{t("book")}:</strong> {detail.shop_inventory.books_catalog.title} ({detail.shop_inventory.books_catalog.author})</p>
                        )}
                        {detail.deliveries?.length > 0 && (
                            <div>
                                <h4>{t("delivery_info")}</h4>
                                {detail.deliveries.map(d => (
                                    <p key={d.id}>{t("delivery_person")}: {d.users?.first_name} {d.users?.last_name} - {d.status}</p>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>{t("client")}</th>
                                    <th>{t("book")}</th>
                                    <th>{t("amount")}</th>
                                    <th>{t("payment")}</th>
                                    <th>{t("status")}</th>
                                    <th>{t("delivery_person")}</th>
                                    <th>{t("date")}</th>
                                    <th>{t("actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.users?.first_name} {order.users?.last_name}</td>
                                        <td>{order.shop_inventory?.books_catalog?.title || order.user_books_to_sell?.books_catalog?.title || "-"}</td>
                                        <td>{Number(order.price).toFixed(2)} DH</td>
                                        <td>{order.payment_method}</td>
                                        <td><span className={`admin-status-badge ${order.status}`}>{order.status}</span></td>
                                        <td>{order.deliveries?.[0]?.users?.first_name || t("not_assigned")}</td>
                                        <td>{new Date(order.created_at).toLocaleDateString("fr-FR")}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <button onClick={() => viewDetail(order.id)} className="admin-btn-sm">{t("view")}</button>
                                                {order.status === "en_cours" && (
                                                    <button onClick={() => cancelOrder(order.id)} className="admin-btn-sm danger">{t("cancel")}</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr><td colSpan={9} className="admin-empty">{t("no_orders_found")}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="admin-pagination">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>{t("previous")}</button>
                    <span>{t("page")} {page} / {pagination.total_pages}</span>
                    <button disabled={page >= pagination.total_pages} onClick={() => setPage(p => p + 1)}>{t("next")}</button>
                </div>
            </div>
        </AdminLayout>
    );
}

