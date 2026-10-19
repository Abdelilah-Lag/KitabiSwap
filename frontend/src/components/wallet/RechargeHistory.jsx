import "./RechargeHistory.css";

import { useTranslation } from "react-i18next";

export default function RechargeHistory({

    requests = []

}) {

    const { t } = useTranslation();
    
    function getStatusClass(status) {

        switch (status) {

            case "approved":
                return "approved";

            case "rejected":
                return "rejected";

            default:
                return "pending";

        }

    }

    if (!requests.length) {

        return (

            <div className="recharge-history">

                <div className="recharge-history-header">

                    <h2>

                        {t("recharge_history")}

                    </h2>

                    <p>

                        {t("track_all_your_wallet_recharge_requests")}

                    </p>

                </div>

                <div className="history-empty">

                    <div className="history-empty-icon">

                        💳

                    </div>

                    <h3>

                        {t("no_recharge_requests")}

                    </h3>

                    <p>

                        {t("you_have_not_submitted_any_recharge_request_yet")}

                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="recharge-history">

            <div className="recharge-history-header">

                <h2>

                    {t("recharge_history")}

                </h2>

                <p>

                    {t("track_all_your_wallet_recharge_requests")}

                </p>

            </div>

            <div className="history-table">

                <table>

                    <thead>

                        <tr>

                            <th>

                                {t("date")}

                            </th>

                            <th>

                                {t("amount")}

                            </th>

                            <th>

                                {t("status")}

                            </th>

                            <th>

                                {t("payment_proof")}

                            </th>

                            <th>

                                {t("validated_at")}

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            requests.map((item) => (

                                <tr key={item.id}>

                                    <td>

                                        {

                                            new Date(item.created_at)

                                                .toLocaleDateString()

                                        }

                                    </td>

                                    <td className="history-price">

                                        {item.amount} DH

                                    </td>

                                    <td>

                                        <span

                                            className={

                                                `history-status ${getStatusClass(item.status)}`

                                            }

                                        >

                                            {

                                                t(item.status)

                                            }

                                        </span>

                                    </td>

                                    <td>

                                        <a

                                            href={item.proof_image_url}

                                            target="_blank"

                                            rel="noreferrer"

                                            className="history-proof-btn"

                                        >

                                            {t("view")}

                                        </a>

                                    </td>

                                    <td>

                                        {

                                            item.validated_at

                                                ? new Date(

                                                    item.validated_at

                                                ).toLocaleDateString()

                                                : "-"

                                        }

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}