import "./WalletSteps.css";

import { useTranslation } from "react-i18next";

export default function WalletSteps() {

    const { t } = useTranslation();

    return (

        <section className="wallet-steps">

            <div className="wallet-steps-header">

                <h2>

                    {t("how_to_recharge_wallet")}

                </h2>

                <p>

                    {t("follow_the_steps_to_add_money")}

                </p>

            </div>

            <div className="steps-grid">

                {/* STEP 1 */}

                <div className="step-card">

                    <div className="step-number">

                        1

                    </div>

                    <h3>

                        {t("choose_payment_method")}

                    </h3>

                    <p>

                        {t("choose_payment_method_description")}

                    </p>

                </div>

                {/* STEP 2 */}

                <div className="step-card">

                    <div className="step-number">

                        2

                    </div>

                    <h3>

                        {t("make_transfer")}

                    </h3>

                    <p>

                        {t("make_transfer_description")}

                    </p>

                </div>

                {/* STEP 3 */}

                <div className="step-card">

                    <div className="step-number">

                        3

                    </div>

                    <h3>

                        {t("send_proof")}

                    </h3>

                    <p>

                        {t("send_proof_description")}

                    </p>

                </div>

                {/* STEP 4 */}

                <div className="step-card">

                    <div className="step-number">

                        4

                    </div>

                    <h3>

                        {t("wallet_validation")}

                    </h3>

                    <p>

                        {t("wallet_validation_description")}

                    </p>

                </div>

            </div>

            {/* IMPORTANT NOTICE */}

            <div className="wallet-warning">

                <div className="warning-icon">

                    ⚠️

                </div>

                <div className="warning-content">

                    <h3>

                        {t("important_information")}

                    </h3>

                    <ul>

                        <li>

                            {t("minimum_recharge_20dh")}

                        </li>

                        <li>

                            {t("only_visible_payment_methods")}

                        </li>

                        <li>

                            {t("proof_required")}

                        </li>

                        <li>

                            {t("wallet_recharge_after_validation")}

                        </li>

                    </ul>

                </div>

            </div>

        </section>

    );

}