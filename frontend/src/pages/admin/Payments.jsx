import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getPayments, approvePayment, rejectPayment } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminPayments() {
    const { t } = useTranslation();
    const [payments, setPayments] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (status) params.status = status;
            const res = await getPayments(params);
            setPayments(res.requests || []);
            setPagination(res.pagination || {});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, status]);

    useEffect(() => { load(); }, [load]);

    async function handleApprove(id) {
        if (window.confirm(t("confirm_approve_payment"))) {
            await approvePayment(id);
            load();
        }
    }

    async function handleReject(id) {
        const reason = prompt(t("rejection_reason"));
        if (reason !== null) {
            await rejectPayment(id, reason);
            load();
        }
    }

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("payment_management")}</h1>

                <div className="admin-filters">
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                        <option value="">{t("all_statuses")}</option>
                        <option value="pending">{t("pending")}</option>
                        <option value="approved">{t("approved")}</option>
                        <option value="rejected">{t("rejected")}</option>
                    </select>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t("user")}</th>
                                <th>{t("amount")}</th>
                                <th>{t("proof")}</th>
                                <th>{t("status")}</th>
                                <th>{t("date")}</th>
                                <th>{t("actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(p => (
                                <tr key={p.id}>
                                    <td>#{p.id}</td>
                                    <td>{p.wallets?.users?.first_name} {p.wallets?.users?.last_name}<br /><small>{p.wallets?.users?.email}</small></td>
                                    <td><strong>{Number(p.amount).toFixed(2)} DH</strong></td>
                                    <td>
                                        {p.proof_image_url ? (
                                            <a href={p.proof_image_url} target="_blank" rel="noreferrer">{t("view_proof")}</a>
                                        ) : "-"}
                                    </td>
                                    <td><span className={`admin-status-badge ${p.status}`}>{p.status}</span></td>
                                    <td>{new Date(p.created_at).toLocaleDateString("fr-FR")}</td>
                                    <td>
                                        {p.status === "pending" && (
                                            <div className="admin-actions">
                                                <button onClick={() => handleApprove(p.id)} className="admin-btn-sm success">{t("approve")}</button>
                                                <button onClick={() => handleReject(p.id)} className="admin-btn-sm danger">{t("reject")}</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr><td colSpan={7} className="admin-empty">{t("no_payments_found")}</td></tr>
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

