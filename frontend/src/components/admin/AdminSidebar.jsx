import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminSidebar() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    }

    const menuItems = [
        { to: "/admin", end: true, icon: "📊", label: t("dashboard") },
        {
            label: t("users"),
            icon: "👥",
            children: [
                { to: "/admin/users", label: t("all_users") },
                { to: "/admin/wallets", label: t("wallets") },
                { to: "/admin/transactions", label: t("transactions") }
            ]
        },
        {
            label: t("catalog"),
            icon: "📚",
            children: [
                { to: "/admin/catalog", label: t("books_catalog") },
                { to: "/admin/user-books", label: t("user_books") },
                { to: "/admin/inventory", label: t("inventory") }
            ]
        },
        {
            label: t("orders"),
            icon: "📦",
            children: [
                { to: "/admin/orders", label: t("magazine_orders") },
                { to: "/admin/user-orders", label: t("user_orders") }
            ]
        },
        { to: "/admin/exchanges", icon: "🔄", label: t("exchanges") },
        { to: "/admin/deliveries", icon: "🚚", label: t("deliveries") },
        { to: "/admin/payments", icon: "💳", label: t("payments") },
        { to: "/admin/messages", icon: "✉️", label: t("messages") },
        { to: "/admin/backup", icon: "💾", label: t("backup") }
    ];

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
                <h2>KitabiSwap</h2>
                <span>{t("admin_panel")}</span>
            </div>

            <nav className="admin-sidebar-nav">
                {menuItems.map((item, idx) => (
                    item.children ? (
                        <div key={idx} className="admin-sidebar-group">
                            <span className="admin-sidebar-group-label">
                                {item.icon} {item.label}
                            </span>
                            {item.children.map((child, cidx) => (
                                <NavLink
                                    key={cidx}
                                    to={child.to}
                                    className={({ isActive }) =>
                                        `admin-sidebar-link ${isActive ? "active" : ""}`
                                    }
                                >
                                    {child.label}
                                </NavLink>
                            ))}
                        </div>
                    ) : (
                        <NavLink
                            key={idx}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `admin-sidebar-link ${isActive ? "active" : ""}`
                            }
                        >
                            {item.icon} {item.label}
                        </NavLink>
                    )
                ))}
            </nav>

            <div className="admin-sidebar-footer">
                <button onClick={logout} className="admin-logout-btn">
                    🚪 {t("logout")}
                </button>
            </div>
        </aside>
    );
}

