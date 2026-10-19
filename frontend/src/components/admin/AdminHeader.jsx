import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function AdminHeader({ onToggleSidebar }) {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch { /* */ }
        }
    }, []);

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                <button className="admin-menu-toggle" onClick={onToggleSidebar}>
                    ☰
                </button>
                <h1 className="admin-header-title">KitabiSwap {t("admin_panel")}</h1>
            </div>

            <div className="admin-header-right">
                <div className="admin-search-shortcut">
                    <a href="/admin/search" className="admin-search-link">
                        🔍 {t("global_search")}
                    </a>
                </div>

                <div className="admin-user-info">
                    <span className="admin-user-name">
                        {user?.first_name} {user?.last_name}
                    </span>
                    <span className="admin-user-role">Admin</span>
                </div>
            </div>
        </header>
    );
}

