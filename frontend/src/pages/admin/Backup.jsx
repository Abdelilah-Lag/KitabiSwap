import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getBackup } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminBackup() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [exported, setExported] = useState(null);

    async function handleExport() {
        setLoading(true);
        try {
            const res = await getBackup();
            setExported(res);

            // Create downloadable JSON
            const blob = new Blob([JSON.stringify(res, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `kitabiswap-backup-${new Date().toISOString().split("T")[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert(t("backup_error"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("backup")}</h1>

                <div className="admin-backup-card">
                    <p>{t("backup_description")}</p>
                    <button onClick={handleExport} className="admin-btn" disabled={loading}>
                        {loading ? t("exporting") : "💾 " + t("export_backup")}
                    </button>
                </div>

                {exported && (
                    <div className="admin-backup-info">
                        <h3>{t("backup_summary")}</h3>
                        <p>{t("exported_at")}: {new Date(exported.exported_at).toLocaleString("fr-FR")}</p>
                        {exported.data && (
                            <div className="admin-stats-grid">
                                <div className="admin-stat-card">
                                    <span>{t("users")}</span>
                                    <span className="admin-stat-value">{exported.data.users?.length || 0}</span>
                                </div>
                                <div className="admin-stat-card">
                                    <span>{t("catalog_books")}</span>
                                    <span className="admin-stat-value">{exported.data.books_catalog?.length || 0}</span>
                                </div>
                                <div className="admin-stat-card">
                                    <span>{t("orders")}</span>
                                    <span className="admin-stat-value">{(exported.data.book_orders?.length || 0) + (exported.data.user_commandes?.length || 0)}</span>
                                </div>
                                <div className="admin-stat-card">
                                    <span>{t("transactions")}</span>
                                    <span className="admin-stat-value">{exported.data.wallet_transactions?.length || 0}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

