import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getUsers, toggleUserStatus, deleteUser, changeUserRole, resetUserPassword } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminUsers() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 });
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (search) params.search = search;
            if (roleFilter) params.role = roleFilter;
            if (statusFilter) params.status = statusFilter;
            const res = await getUsers(params);
            setUsers(res.users || []);
            setPagination(res.pagination || { page: 1, total_pages: 1, total: 0 });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, roleFilter, statusFilter]);

    useEffect(() => { loadUsers(); }, [loadUsers]);

    async function handleToggleStatus(id) {
        await toggleUserStatus(id);
        loadUsers();
    }

    async function handleDelete(id) {
        if (window.confirm(t("confirm_delete_user"))) {
            await deleteUser(id);
            loadUsers();
        }
    }

    async function handleChangeRole(id, role_name) {
        await changeUserRole(id, role_name);
        loadUsers();
    }

    async function handleResetPassword(id) {
        const newPwd = prompt(t("enter_new_password"));
        if (newPwd && newPwd.length >= 8) {
            await resetUserPassword(id, newPwd);
            alert(t("password_reset_success"));
        }
    }

    function viewUser(user) {
        setSelectedUser(user);
        setShowDetail(true);
    }

    const roleNames = {
        1: "Admin",
        2: "User",
        3: "Delivery",
        4: "Warehouse",
        5: "Controller",
        6: "Payment Manager"
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("user_management")}</h1>

                <div className="admin-filters">
                    <input
                        type="text"
                        placeholder={t("search_users")}
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="admin-search-input"
                    />
                    <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
                        <option value="">{t("all_roles")}</option>
                        <option value="utilisateur">Utilisateur</option>
                        <option value="livreur">Livreur</option>
                        <option value="magasinier">Magasinier</option>
                        <option value="contrôleur">Contrôleur</option>
                        <option value="payment_manager">Payment Manager</option>
                    </select>
                    <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                        <option value="">{t("all_statuses")}</option>
                        <option value="active">{t("active")}</option>
                        <option value="inactive">{t("inactive")}</option>
                        <option value="pending">{t("pending")}</option>
                        <option value="suspended">{t("suspended")}</option>
                    </select>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t("photo")}</th>
                                <th>{t("name")}</th>
                                <th>{t("email")}</th>
                                <th>{t("phone")}</th>
                                <th>{t("role")}</th>
                                <th>{t("wallet")}</th>
                                <th>{t("status")}</th>
                                <th>{t("created_at")}</th>
                                <th>{t("actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <img
                                            src={user.avatar_url || "/images/default-avatar.png"}
                                            alt=""
                                            className="admin-user-avatar"
                                        />
                                    </td>
                                    <td>{user.first_name} {user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || "-"}</td>
                                    <td>{roleNames[user.role_id] || user.roles?.name || "-"}</td>
                                    <td>{user.wallets?.balance ? `${Number(user.wallets.balance)} DH` : "0 DH"}</td>
                                    <td>
                                        <span className={`admin-status-badge ${user.status}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>{new Date(user.created_at).toLocaleDateString("fr-FR")}</td>
                                    <td>
                                        <div className="admin-actions">
                                            <button onClick={() => viewUser(user)} className="admin-btn-sm">{t("view")}</button>
                                            <button onClick={() => handleToggleStatus(user.id)} className="admin-btn-sm warning">
                                                {user.status === "suspended" ? t("unblock") : t("block")}
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} className="admin-btn-sm danger">{t("delete")}</button>
                                            <button onClick={() => handleResetPassword(user.id)} className="admin-btn-sm">{t("reset_password")}</button>
                                            <select
                                                className="admin-role-select"
                                                defaultValue=""
                                                onChange={e => e.target.value && handleChangeRole(user.id, e.target.value)}
                                            >
                                                <option value="" disabled>{t("change_role")}</option>
                                                {Object.entries(roleNames).map(([id, name]) => (
                                                    <option key={id} value={name.toLowerCase().replace(" ", "_")}>{name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="admin-empty">{t("no_users_found")}</td>
                                </tr>
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

