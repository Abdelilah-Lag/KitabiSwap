import "./PaymentMethodCard.css";

import { useTranslation } from "react-i18next";

export default function PaymentMethodCard({

    method,

    onView

}) {

    const { t } = useTranslation();

    function getIcon(type) {

        switch (type) {

            case "CIH_bank":
                return "🏦";

            case "barid_bank":
                return "🏛️";

            case "bank_transfer":
                return "💳";

            case "paypal":
                return "🅿️";

            case "payoneer":
                return "💰";

            case "stripe":
                return "💠";

            default:
                return "💼";

        }

    }

    function getTypeName(type) {

        switch (type) {

            case "CIH_bank":
                return "CIH Bank";

            case "barid_bank":
                return "Barid Bank";

            case "bank_transfer":
                return t("bank_transfer");

            case "paypal":
                return "PayPal";

            case "payoneer":
                return "Payoneer";

            case "stripe":
                return "Stripe";

            default:
                return t("other");

        }

    }

    return (

        <div className="payment-card">

            {/* ===========================
                ICON
            =========================== */}

            <div className="payment-icon">

                {getIcon(method.type)}

            </div>

            {/* ===========================
                CONTENT
            =========================== */}

            <div className="payment-content">

                <h3>

                    {method.name}

                </h3>

                <p>

                    {getTypeName(method.type)}

                </p>

            </div>

            {/* ===========================
                BADGE
            =========================== */}

            <div className="payment-status">

                {t("active")}

            </div>

            {/* ===========================
                BUTTON
            =========================== */}

            <button

                className="payment-view-btn"

                onClick={() => onView(method)}

            >

                {t("view_details")}

            </button>

        </div>

    );

}