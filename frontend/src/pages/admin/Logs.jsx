import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getLogs } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminLogs() {
    const { t } = useTranslation();
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [action, setAction] = useState("");
    const [entityType, setEntityType] = useState("");
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 50 };
            if (search) params.search = search;
            if (action) params.action = action;
            if (entityType) params.entity_type = entityType;
            const res = await getLogs(params);
            setLogs(res.logs || []);
            setPagination(res.pagination || {});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, action, entityType]);

    useEffect(() => { load(); }, [load]);

    function getActionBadge(action) {
        if (action.includes("delete") || action.includes("rejected")) return "danger";
        if (action.includes("create") || action.includes("approved")) return "success";
        if (action.includes("update") || action.includes("edit")) return "warning";
        return "info";
    }

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("activity_logs")}</h1>

                <div className="admin-filters">
                    <input type="text" placeholder={t("search_logs")} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="admin-search-input" />
                    <input type="text" placeholder={t("action")} value={action} onChange={e => { setAction(e.target.value); setPage(1); }} />
                    <input type="text" placeholder={t("entity_type")} value={entityType} onChange={e => { setEntityType(e.target.value); setPage(1); }} />
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t("admin")}</th>
                                <th>{t("action")}</th>
                                <th>{t("entity")}</th>
                                <th>{t("entity_id")}</th>
                                <th>{t("details")}</th>
                                <th>{t("ip_address")}</th>
                                <th>{t("created_at")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td>{log.users?.first_name} {log.users?.last_name}</td>
                                    <td><span className={`admin-badge ${getActionBadge(log.action)}`}>{log.action}</span></td>
                                    <td>{log.entity_type}</td>
                                    <td>{log.entity_id || "-"}</td>
                                    <td className="admin-log-details">{log.details || "-"}</td>
                                    <td>{log.ip_address || "-"}</td>
                                    <td>{new Date(log.created_at).toLocaleString("fr-FR")}</td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr><td colSpan={7} className="admin-empty">{t("no_logs_found")}</td></tr>
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

