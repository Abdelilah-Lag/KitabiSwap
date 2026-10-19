import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getExchanges, getExchange, updateExchangeStatus } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminExchanges() {
    const { t } = useTranslation();
    const [exchanges, setExchanges] = useState([]);
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
            const res = await getExchanges(params);
            setExchanges(res.exchanges || []);
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
            const res = await getExchange(id);
            setDetail(res.exchange);
        } catch (err) {
            console.error(err);
        }
    }

    const statusLabels = {
        pending: { label: t("pending"), class: "warning" },
        waiting_receiver_wallet: { label: t("waiting_payment"), class: "info" },
        accepted: { label: t("accepted"), class: "success" },
        rejected: { label: t("rejected"), class: "danger" },
        cancelled: { label: t("cancelled"), class: "danger" },
        completed: { label: t("completed"), class: "success" }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("exchange_management")}</h1>

                <div className="admin-filters">
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                        <option value="">{t("all_statuses")}</option>
                        <option value="pending">{t("pending")}</option>
                        <option value="accepted">{t("accepted")}</option>
                        <option value="rejected">{t("rejected")}</option>
                        <option value="completed">{t("completed")}</option>
                        <option value="cancelled">{t("cancelled")}</option>
                    </select>
                </div>

                {detail ? (
                    <div className="admin-detail-card">
                        <button onClick={() => setDetail(null)} className="admin-btn-sm">{t("back")}</button>
                        <h3>{t("exchange")} #{detail.id}</h3>
                        <p><strong>{t("requester")}:</strong> {detail.users_exchange_requests_requester_idTousers?.first_name} {detail.users_exchange_requests_requester_idTousers?.last_name}</p>
                        <p><strong>{t("receiver")}:</strong> {detail.users_exchange_requests_receiver_idTousers?.first_name} {detail.users_exchange_requests_receiver_idTousers?.last_name}</p>
                        <p><strong>{t("status")}:</strong> <span className={`admin-badge ${statusLabels[detail.status]?.class || "info"}`}>{detail.status}</span></p>
                        <p><strong>{t("created_at")}:</strong> {new Date(detail.created_at).toLocaleString("fr-FR")}</p>
                        {detail.exchange_delivery && (
                            <div>
                                <h4>{t("delivery_info")}</h4>
                                <p>{t("delivery_fee")}: {Number(detail.exchange_delivery.delivery_fee).toFixed(2)} DH</p>
                                <p>{t("delivery_person")}: {detail.exchange_delivery.users?.first_name} {detail.exchange_delivery.users?.last_name || t("not_assigned")}</p>
                            </div>
                        )}
                        {detail.exchange_chat?.length > 0 && (
                            <div>
                                <h4>{t("conversation")}</h4>
                                {detail.exchange_chat.map(msg => (
                                    <div key={msg.id} className="admin-chat-msg">
                                        <strong>{msg.users?.first_name}:</strong> {msg.message}
                                        <small>{new Date(msg.created_at).toLocaleString("fr-FR")}</small>
                                    </div>
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
                                    <th>{t("requester")}</th>
                                    <th>{t("receiver")}</th>
                                    <th>{t("status")}</th>
                                    <th>{t("delivery_method")}</th>
                                    <th>{t("created_at")}</th>
                                    <th>{t("actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exchanges.map(ex => (
                                    <tr key={ex.id}>
                                        <td>#{ex.id}</td>
                                        <td>{ex.users_exchange_requests_requester_idTousers?.first_name} {ex.users_exchange_requests_requester_idTousers?.last_name}</td>
                                        <td>{ex.users_exchange_requests_receiver_idTousers?.first_name} {ex.users_exchange_requests_receiver_idTousers?.last_name}</td>
                                        <td><span className={`admin-badge ${statusLabels[ex.status]?.class || "info"}`}>{ex.status}</span></td>
                                        <td>{ex.delivery_method || "-"}</td>
                                        <td>{new Date(ex.created_at).toLocaleDateString("fr-FR")}</td>
                                        <td><button onClick={() => viewDetail(ex.id)} className="admin-btn-sm">{t("view")}</button></td>
                                    </tr>
                                ))}
                                {exchanges.length === 0 && (
                                    <tr><td colSpan={7} className="admin-empty">{t("no_exchanges_found")}</td></tr>
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

