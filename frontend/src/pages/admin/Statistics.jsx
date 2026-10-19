import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getStatistics } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminStatistics() {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [period, setPeriod] = useState("month");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, [period]);

    async function loadStats() {
        setLoading(true);
        try {
            const res = await getStatistics({ period });
            setStats(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // Simple aggregation by month
    function aggregateByMonth(data, field) {
        if (!data || !data.length) return [];
        const grouped = {};
        data.forEach(item => {
            const date = new Date(item.date);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            if (!grouped[key]) grouped[key] = { month: date.toLocaleString("fr-FR", { month: "short", year: "2-digit" }), count: 0, total: 0 };
            grouped[key].count++;
            grouped[key].total += item[field] || 1;
        });
        return Object.values(grouped).slice(-12);
    }

    const registrationData = aggregateByMonth(stats?.registrations, "role_id");
    const salesData = aggregateByMonth(stats?.sales, "price");
    const exchangeData = aggregateByMonth(stats?.exchanges, "status");

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("statistics")}</h1>

                <div className="admin-filters">
                    <select value={period} onChange={e => setPeriod(e.target.value)}>
                        <option value="week">{t("weekly")}</option>
                        <option value="month">{t("monthly")}</option>
                        <option value="year">{t("yearly")}</option>
                    </select>
                </div>

                <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                        <h3>{t("registrations")}</h3>
                        <p className="admin-stat-value">{stats?.registrations?.length || 0}</p>
                    </div>
                    <div className="admin-stat-card">
                        <h3>{t("sales")}</h3>
                        <p className="admin-stat-value">{stats?.sales?.length || 0}</p>
                    </div>
                    <div className="admin-stat-card">
                        <h3>{t("exchanges")}</h3>
                        <p className="admin-stat-value">{stats?.exchanges?.length || 0}</p>
                    </div>
                    <div className="admin-stat-card">
                        <h3>{t("deliveries")}</h3>
                        <p className="admin-stat-value">{stats?.deliveries?.length || 0}</p>
                    </div>
                </div>

                {/* Top Books */}
                {stats?.top_books?.length > 0 && (
                    <section className="admin-dashboard-section">
                        <h2>{t("top_books")}</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>{t("title")}</th>
                                    <th>{t("author")}</th>
                                    <th>{t("sales")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.top_books.map((b, i) => (
                                    <tr key={i}>
                                        <td>{b.title}</td>
                                        <td>{b.author}</td>
                                        <td>{b.sales_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {/* Top Users */}
                {stats?.top_users?.length > 0 && (
                    <section className="admin-dashboard-section">
                        <h2>{t("top_users")}</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>{t("name")}</th>
                                    <th>{t("email")}</th>
                                    <th>{t("exchanges")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.top_users.map((u, i) => (
                                    <tr key={i}>
                                        <td>{u.first_name} {u.last_name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.exchange_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {/* Top Cities */}
                {stats?.top_cities?.length > 0 && (
                    <section className="admin-dashboard-section">
                        <h2>{t("top_cities")}</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>{t("city")}</th>
                                    <th>{t("users")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.top_cities.map((c, i) => (
                                    <tr key={i}>
                                        <td>{c.city}</td>
                                        <td>{c.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {/* Charts by month */}
                <section className="admin-dashboard-section">
                    <h2>{t("monthly_charts")}</h2>
                    <div className="admin-chart-table">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>{t("month")}</th>
                                    <th>{t("registrations")}</th>
                                    <th>{t("sales")} (DH)</th>
                                    <th>{t("exchanges")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrationData.map((r, i) => (
                                    <tr key={i}>
                                        <td>{r.month}</td>
                                        <td>{r.count}</td>
                                        <td>{salesData[i]?.total?.toFixed(2) || "0.00"}</td>
                                        <td>{exchangeData[i]?.count || 0}</td>
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

