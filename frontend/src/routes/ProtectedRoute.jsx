import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
    children,
    allowedRoles = []
}) {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // Pas connecté
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Rôle non autorisé
    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role)
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
}