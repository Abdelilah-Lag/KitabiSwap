import "./PaymentManagerSidebar.css";

import {

    NavLink,
    useNavigate

} from "react-router-dom";

import {

    FaChartPie,
    FaWallet,
    FaMoneyCheckAlt,
    FaCreditCard,
    FaExchangeAlt,
    FaSignOutAlt

} from "react-icons/fa";

import {

    useTranslation

} from "react-i18next";

export default function PaymentManagerSidebar() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    function logout() {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");

    }

    return (

        <aside className="payment-sidebar">

            <NavLink

                to="/payment"

                end

            >

                <FaChartPie />

                <span>

                    {t("dashboard")}

                </span>

            </NavLink>

            <NavLink

                to="/payment/recharge-requests"

            >

                <FaMoneyCheckAlt />

                <span>

                    Recharge Requests

                </span>

            </NavLink>

            <NavLink

                to="/payment/payment-methods"

            >

                <FaCreditCard />

                <span>

                    Payment Methods

                </span>

            </NavLink>

            <NavLink

                to="/payment/transactions"

            >

                <FaExchangeAlt />

                <span>

                    Transactions

                </span>

            </NavLink>

            <NavLink

                to="/payment/user-wallets"

            >

                <FaWallet />

                <span>

                    Users Wallets

                </span>

            </NavLink>

            <div className="payment-sidebar-bottom">

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