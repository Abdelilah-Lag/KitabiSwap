import { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className={`admin-layout ${sidebarOpen ? "admin-sidebar-open" : ""}`}>
            <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="admin-body">
                {sidebarOpen && <AdminSidebar />}
                <main className="admin-content">
                    {children}
                </main>
            </div>
            <AdminFooter />
        </div>
    );
}

