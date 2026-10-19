import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getWallets, getWalletOverview, adjustWalletBalance } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminWallets() {
    const { t } = useTranslation();
    const [wallets, setWallets] = useState([]);
    const [overview, setOverview] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [roleName, setRoleName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getWallets({ page, limit: 20, search, role_name: roleName, sort: "balance", order: "desc" }),
            getWalletOverview()
        ]).then(([wres, ores]) => {
            setWallets(wres.wallets || []);
            setPagination(wres.pagination || {});
            setOverview(ores);
        }).catch(console.error).finally(() => setLoading(false));
    }, [page, search, roleName]);

    async function handleAdjust(walletId) {
        const amount = prompt(t("enter_amount"));
        if (!amount) return;
        const reason = prompt(t("reason")) || t("admin_adjustment");
        try {
            await adjustWalletBalance(walletId, amount, reason);
            alert(t("balance_updated"));
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    }

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("wallet_management")}</h1>

                {overview && (
                    <section className="admin-wallet-overview">
                        <div className="admin-stats-grid">
                            {overview.role_totals?.map(rt => (
                                <div key={rt.role_name} className="admin-stat-card">
                                    <span className="admin-stat-label">{rt.role_name}</span>
                                    <span className="admin-stat-value">{new Intl.NumberFormat("fr-FR").format(rt.total_balance)} DH</span>
                                    <small>{rt.wallet_count} {t("wallets")}</small>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="admin-filters">
                    <input type="text" placeholder={t("search_users")} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="admin-search-input" />
                    <select value={roleName} onChange={e => { setRoleName(e.target.value); setPage(1); }}>
                        <option value="">{t("all_roles")}</option>
                        <option value="admin">Admin</option>
                        <option value="utilisateur">Utilisateur</option>
                        <option value="livreur">Livreur</option>
                        <option value="magasinier">Magasinier</option>
                        <option value="contrôleur">Contrôleur</option>
                        <option value="payment_manager">Payment Manager</option>
                    </select>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t("user")}</th>
                                <th>{t("role")}</th>
                                <th>{t("balance")}</th>
                                <th>{t("status")}</th>
                                <th>{t("transactions")}</th>
                                <th>{t("actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wallets.map(w => (
                                <tr key={w.id}>
                                    <td>{w.users?.first_name} {w.users?.last_name}<br /><small>{w.users?.email}</small></td>
                                    <td>{w.users?.roles?.name || "-"}</td>
                                    <td><strong>{Number(w.balance).toFixed(2)} DH</strong></td>
                                    <td><span className={`admin-status-badge ${w.status}`}>{w.status}</span></td>
                                    <td>{w._count?.wallet_transactions || 0}</td>
                                    <td>
                                        <button onClick={() => handleAdjust(w.id)} className="admin-btn-sm">{t("adjust")}</button>
                                    </td>
                                </tr>
                            ))}
                            {wallets.length === 0 && (
                                <tr><td colSpan={6} className="admin-empty">{t("no_wallets_found")}</td></tr>
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

