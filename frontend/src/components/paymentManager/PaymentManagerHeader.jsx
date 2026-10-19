import "./PaymentManagerHeader.css";

import { useTranslation } from "react-i18next";
import { FaUserCircle } from "react-icons/fa";

export default function PaymentManagerHeader() {

    const { t } = useTranslation();

    const user = JSON.parse(

        localStorage.getItem("user") || "{}"

    );

    return (

        <header className="payment-header">

            <div className="payment-header-left">

                <h1>

                    {t("payment_manager", "Payment Manager")}

                </h1>

                <p>

                    {t(
                        "payment_manager_description",
                        "Gestion des paiements, des wallets et des transactions."
                    )}

                </p>

            </div>

            <div className="payment-header-right">

                {user.avatar_url ? (

                    <img
                        src={user.avatar_url}
                        alt="avatar"
                        className="payment-header-avatar"
                    />

                ) : (

                    <FaUserCircle className="payment-header-avatar-icon" />

                )}

                <div className="payment-header-user">

                    <strong>

                        {user.first_name} {user.last_name}

                    </strong>

                    <span>

                        {user.email}

                    </span>

                </div>

            </div>

        </header>

    );

}