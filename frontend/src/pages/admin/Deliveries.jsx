import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getDeliveries, getDeliveryPersons } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminDeliveries() {
    const { t } = useTranslation();
    const [deliveries, setDeliveries] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [deliveryPersonId, setDeliveryPersonId] = useState("");
    const [deliveryPersons, setDeliveryPersons] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (status) params.status = status;
            if (deliveryPersonId) params.delivery_person_id = deliveryPersonId;
            const res = await getDeliveries(params);
            setDeliveries(res.deliveries || []);
            setPagination(res.pagination || {});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, status, deliveryPersonId]);

    useEffect(() => {
        load();
        getDeliveryPersons().then(res => setDeliveryPersons(res.persons || [])).catch(() => {});
    }, [load]);

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("delivery_management")}</h1>

                <div className="admin-filters">
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                        <option value="">{t("all_statuses")}</option>
                        <option value="en_cours">{t("in_progress")}</option>
                        <option value="delivre">{t("delivered")}</option>
                    </select>
                    <select value={deliveryPersonId} onChange={e => { setDeliveryPersonId(e.target.value); setPage(1); }}>
                        <option value="">{t("all_delivery_persons")}</option>
                        {deliveryPersons.map(p => (
                            <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                        ))}
                    </select>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t("delivery_person")}</th>
                                <th>{t("type")}</th>
                                <th>{t("total")}</th>
                                <th>{t("status")}</th>
                                <th>{t("created_at")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map(del => (
                                <tr key={del.id}>
                                    <td>#{del.id}</td>
                                    <td>{del.users?.first_name} {del.users?.last_name}</td>
                                    <td>
                                        {del.book_orders ? t("book_order") : del.user_commandes ? t("user_order") : del.exchange_delivery ? t("exchange") : "-"}
                                    </td>
                                    <td>{Number(del.total).toFixed(2)} DH</td>
                                    <td><span className={`admin-status-badge ${del.status}`}>{del.status === "en_cours" ? t("in_progress") : t("delivered")}</span></td>
                                    <td>{new Date(del.created_at).toLocaleDateString("fr-FR")}</td>
                                </tr>
                            ))}
                            {deliveries.length === 0 && (
                                <tr><td colSpan={6} className="admin-empty">{t("no_deliveries_found")}</td></tr>
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

