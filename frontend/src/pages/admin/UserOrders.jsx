import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getUserCommandes } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminUserOrders() {
    const { t } = useTranslation();
    const [commandes, setCommandes] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });
    const [page, setPage] = useState(1);
    const [orderStatus, setOrderStatus] = useState("");
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (orderStatus) params.order_status = orderStatus;
            const res = await getUserCommandes(params);
            setCommandes(res.commandes || []);
            setPagination(res.pagination || {});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, orderStatus]);

    useEffect(() => { load(); }, [load]);

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("user_orders")}</h1>

                <div className="admin-filters">
                    <select value={orderStatus} onChange={e => { setOrderStatus(e.target.value); setPage(1); }}>
                        <option value="">{t("all_statuses")}</option>
                        <option value="pending">{t("pending")}</option>
                        <option value="confirmed">{t("confirmed")}</option>
                        <option value="shipping">{t("shipping")}</option>
                        <option value="delivered">{t("delivered")}</option>
                        <option value="cancelled">{t("cancelled")}</option>
                    </select>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t("client")}</th>
                                <th>{t("total")}</th>
                                <th>{t("payment")}</th>
                                <th>{t("payment_status")}</th>
                                <th>{t("order_status")}</th>
                                <th>{t("delivery_price")}</th>
                                <th>{t("date")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commandes.map(cmd => (
                                <tr key={cmd.id}>
                                    <td>#{cmd.id}</td>
                                    <td>{cmd.users?.first_name} {cmd.users?.last_name}</td>
                                    <td>{Number(cmd.total_price).toFixed(2)} DH</td>
                                    <td>{cmd.payment_type}</td>
                                    <td><span className={`admin-status-badge ${cmd.payment_status}`}>{cmd.payment_status}</span></td>
                                    <td><span className={`admin-status-badge ${cmd.order_status}`}>{cmd.order_status}</span></td>
                                    <td>{Number(cmd.delivery_price).toFixed(2)} DH</td>
                                    <td>{new Date(cmd.created_at).toLocaleDateString("fr-FR")}</td>
                                </tr>
                            ))}
                            {commandes.length === 0 && (
                                <tr><td colSpan={8} className="admin-empty">{t("no_orders_found")}</td></tr>
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

