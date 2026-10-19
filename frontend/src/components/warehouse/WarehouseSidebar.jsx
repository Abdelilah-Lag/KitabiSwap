import "./WarehouseSidebar.css";

import {

    NavLink,
    useNavigate

} from "react-router-dom";

import {

    FaChartPie,
    FaBook,
    FaWarehouse,
    FaClipboardList,
    FaStore,
    FaShoppingCart,
    FaSignOutAlt

} from "react-icons/fa";

import {

    useTranslation

} from "react-i18next";

export default function WarehouseSidebar() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    function logout() {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");

    }

    return (

        <aside className="warehouse-sidebar">

            {/* =====================================
                DASHBOARD
            ===================================== */}

            <NavLink
                to="/warehouse"
                end
            >

                <FaChartPie />

                <span>

                    {t("dashboard")}

                </span>

            </NavLink>

            {/* =====================================
                CATALOGUE
            ===================================== */}

            <NavLink
                to="/warehouse/catalog"
            >

                <FaBook />

                <span>

                    {t("catalog")}

                </span>

            </NavLink>

            {/* =====================================
                INVENTORY
            ===================================== */}

            <NavLink
                to="/warehouse/inventory"
            >

                <FaWarehouse />

                <span>

                    {t("inventory")}

                </span>

            </NavLink>

            {/* =====================================
                USER SELL SUBMISSIONS
            ===================================== */}

            <NavLink
                to="/warehouse/sell-submissions"
            >

                <FaClipboardList />

                <span>

                    Propositions

                </span>

            </NavLink>

            {/* =====================================
                USER BOOKS TO SELL
            ===================================== */}

            <NavLink
                to="/warehouse/user-books-to-sell"
            >

                <FaStore />

                <span>

                    Livres à vendre

                </span>

            </NavLink>

            {/* =====================================
                SALES
            ===================================== */}

            <NavLink
                to="/warehouse/sales"
            >

                <FaShoppingCart />

                <span>

                    {t("sales")}

                </span>

            </NavLink>

            {/* =====================================
                LOGOUT
            ===================================== */}

            <div className="warehouse-sidebar-bottom">

                <button
                    onClick={logout}
                >

                    <FaSignOutAlt />

                    <span>

                        {t("logout")}

                    </span>

                </button>

            </div>

        </aside>

    );

}