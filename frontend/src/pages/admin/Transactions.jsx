import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getWalletTransactions } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminTransactions() {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });
    const [page, setPage] = useState(1);
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (type) params.type = type;
            const res = await getWalletTransactions(params);
            setTransactions(res.transactions || []);
            setPagination(res.pagination || {});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, type]);

    useEffect(() => { load(); }, [load]);

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("transactions")}</h1>

                <div className="admin-filters">
                    <select value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
                        <option value="">{t("all_types")}</option>
                        <option value="deposit">{t("deposit")}</option>
                        <option value="exchange_fee">{t("exchange_fee")}</option>
                        <option value="delivery_fee">{t("delivery_fee")}</option>
                        <option value="purchase">{t("purchase")}</option>
                        <option value="refund">{t("refund")}</option>
                        <option value="admin_adjustment">{t("admin_adjustment")}</option>
                    </select>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t("user")}</th>
                                <th>{t("type")}</th>
                                <th>{t("amount")}</th>
                                <th>{t("balance_before")}</th>
                                <th>{t("balance_after")}</th>
                                <th>{t("description")}</th>
                                <th>{t("date")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id}>
                                    <td>#{tx.id}</td>
                                    <td>{tx.wallets?.users?.first_name} {tx.wallets?.users?.last_name}</td>
                                    <td><span className={`admin-badge ${tx.transaction_type}`}>{tx.transaction_type}</span></td>
                                    <td><strong>{Number(tx.amount).toFixed(2)} DH</strong></td>
                                    <td>{Number(tx.balance_before).toFixed(2)} DH</td>
                                    <td>{Number(tx.balance_after).toFixed(2)} DH</td>
                                    <td className="admin-log-details">{tx.description || "-"}</td>
                                    <td>{new Date(tx.created_at).toLocaleString("fr-FR")}</td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr><td colSpan={8} className="admin-empty">{t("no_transactions_found")}</td></tr>
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

