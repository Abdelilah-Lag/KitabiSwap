import "./ControllerSidebar.css";

import {
    NavLink,
    useNavigate
} from "react-router-dom";

import {
    FaChartPie,
    FaBook,
    FaExchangeAlt,
    FaBoxes,
    FaShoppingCart,
    FaSignOutAlt
} from "react-icons/fa";

import { useTranslation } from "react-i18next";

export default function ControllerSidebar() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <aside className="controller-sidebar">
            <NavLink
                to="/controller"
                end
            >
                <FaChartPie />
                <span>
                    {t("dashboard")}
                </span>
            </NavLink>

            <NavLink
                to="/controller/catalog"
            >
                <FaBook />
                <span>
                    {t("catalog")}
                </span>
            </NavLink>

            <NavLink
                to="/controller/book-submissions"
            >
                <FaExchangeAlt />
                <span>
                    {t("book_submissions")}
                </span>
            </NavLink>

            <NavLink
                to="/controller/exchange-requests"
            >
                <FaBoxes />
                <span>
                    {t("exchange_requests")}
                </span>
            </NavLink>

            <NavLink
                to="/controller/exchange-books"
            >
                <FaShoppingCart />
                <span>
                    {t("books_to_exchange")}
                </span>
            </NavLink>

            <div className="controller-sidebar-bottom">
                <button onClick={logout}>
                    <FaSignOutAlt />
                    <span>
                        {t("logout")}
                    </span>
                </button>
            </div>
        </aside>
    );
}

