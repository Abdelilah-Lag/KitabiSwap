import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getDashboard } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
    const { t } = useTranslation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        try {
            const res = await getDashboard();
            setData(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <AdminLayout><div className="admin-loading">{t("loading")}</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="admin-dashboard">
                <h1 className="admin-page-title">{t("dashboard")}</h1>

                {/* Users Section */}
                <section className="admin-dashboard-section">
                    <h2>{t("users")}</h2>
                    <div className="admin-stats-grid">
                        <div className="admin-stat-card blue">
                            <span className="admin-stat-label">{t("total")}</span>
                            <span className="admin-stat-value">{data?.users?.total || 0}</span>
                        </div>
                        <div className="admin-stat-card green">
                            <span className="admin-stat-label">{t("new_today")}</span>
                            <span className="admin-stat-value">{data?.users?.new_today || 0}</span>
                        </div>
                        <div className="admin-stat-card cyan">
                            <span className="admin-stat-label">{t("new_this_week")}</span>
                            <span className="admin-stat-value">{data?.users?.new_this_week || 0}</span>
                        </div>
                        <div className="admin-stat-card teal">
                            <span className="admin-stat-label">{t("active")}</span>
                            <span className="admin-stat-value">{data?.users?.active || 0}</span>
                        </div>
                        <div className="admin-stat-card red">
                            <span className="admin-stat-label">{t("blocked")}</span>
                            <span className="admin-stat-value">{data?.users?.blocked || 0}</span>
                        </div>
                    </div>

                    <h3>{t("by_role")}</h3>
                    <div className="admin-role-list">
                        {data?.users?.by_role && Object.entries(data.users.by_role).map(([role, count]) => (
                            <div key={role} className="admin-role-item">
                                <span className="admin-role-name">{role}</span>
                                <span className="admin-role-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Books Section */}
                <section className="admin-dashboard-section">
                    <h2>{t("books")}</h2>
                    <div className="admin-stats-grid">
                        <div className="admin-stat-card purple">
                            <span className="admin-stat-label">{t("catalog")}</span>
                            <span className="admin-stat-value">{data?.books?.catalog || 0}</span>
                        </div>
                        <div className="admin-stat-card orange">
                            <span className="admin-stat-label">{t("submitted")}</span>
                            <span className="admin-stat-value">{data?.books?.submitted || 0}</span>
                        </div>
                        <div className="admin-stat-card pink">
                            <span className="admin-stat-label">{t("user_books")}</span>
                            <span className="admin-stat-value">{data?.books?.user_books || 0}</span>
                        </div>
                        <div className="admin-stat-card indigo">
                            <span className="admin-stat-label">{t("sold")}</span>
                            <span className="admin-stat-value">{data?.books?.sold_shop || 0}</span>
                        </div>
                        <div className="admin-stat-card brown">
                            <span className="admin-stat-label">{t("exchanged")}</span>
                            <span className="admin-stat-value">{data?.books?.exchanged || 0}</span>
                        </div>
                    </div>
                </section>

                {/* Orders & Exchanges */}
                <section className="admin-dashboard-section">
                    <h2>{t("orders")}</h2>
                    <div className="admin-stats-grid">
                        <div className="admin-stat-card dark">
                            <span className="admin-stat-label">{t("magazine")}</span>
                            <span className="admin-stat-value">{data?.orders?.magazine || 0}</span>
                        </div>
                        <div className="admin-stat-card dark">
                            <span className="admin-stat-label">{t("user_orders")}</span>
                            <span className="admin-stat-value">{data?.orders?.user_orders || 0}</span>
                        </div>
                        <div className="admin-stat-card dark">
                            <span className="admin-stat-label">{t("exchanges")}</span>
                            <span className="admin-stat-value">{data?.exchanges || 0}</span>
                        </div>
                    </div>
                </section>

                {/* Deliveries */}
                <section className="admin-dashboard-section">
                    <h2>{t("deliveries")}</h2>
                    <div className="admin-stats-grid">
                        <div className="admin-stat-card yellow">
                            <span className="admin-stat-label">{t("ongoing")}</span>
                            <span className="admin-stat-value">{data?.deliveries?.ongoing || 0}</span>
                        </div>
                        <div className="admin-stat-card green">
                            <span className="admin-stat-label">{t("completed")}</span>
                            <span className="admin-stat-value">{data?.deliveries?.completed || 0}</span>
                        </div>
                    </div>
                </section>

                {/* Wallet & Revenue */}
                <section className="admin-dashboard-section admin-finance">
                    <h2>{t("finances")}</h2>
                    <div className="admin-wallet-summary">
                        <div className="admin-wallet-card">
                            <h3>{t("user_wallet_balance")}</h3>
                            <span className="admin-wallet-amount">
                                {new Intl.NumberFormat("fr-FR").format(data?.wallet?.total_user_balance || 0)} DH
                            </span>
                            <span className="admin-wallet-sub">
                                {data?.wallet?.total_wallets || 0} {t("wallets")}
                            </span>
                        </div>

                        <div className="admin-revenue-card">
                            <h3>{t("platform_revenue")}</h3>
                            <div className="admin-revenue-item">
                                <span>{t("exchange_commission")}</span>
                                <span>{new Intl.NumberFormat("fr-FR").format(data?.revenue?.exchange_commission || 0)} DH</span>
                            </div>
                            <div className="admin-revenue-item">
                                <span>{t("delivery_fees")}</span>
                                <span>{new Intl.NumberFormat("fr-FR").format(data?.revenue?.delivery_fees || 0)} DH</span>
                            </div>
                            <div className="admin-revenue-item">
                                <span>{t("withdrawal_fees")}</span>
                                <span>{new Intl.NumberFormat("fr-FR").format(data?.revenue?.withdrawal_fees || 0)} DH</span>
                            </div>
                            <div className="admin-revenue-total">
                                <span>{t("total_revenue")}</span>
                                <span>{new Intl.NumberFormat("fr-FR").format(data?.revenue?.total || 0)} DH</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Monthly Charts */}
                <section className="admin-dashboard-section">
                    <h2>{t("monthly_stats")}</h2>
                    <div className="admin-chart-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t("month")}</th>
                                    <th>{t("registrations")}</th>
                                    <th>{t("orders")}</th>
                                    <th>{t("wallet_deposits")}</th>
                                    <th>{t("deliveries")}</th>
                                    <th>{t("exchanges")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.monthly_charts?.map((m, i) => (
                                    <tr key={i}>
                                        <td>{m.month} {m.year}</td>
                                        <td>{m.registrations}</td>
                                        <td>{m.orders}</td>
                                        <td>{m.wallet_deposits}</td>
                                        <td>{m.deliveries}</td>
                                        <td>{m.exchanges}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

