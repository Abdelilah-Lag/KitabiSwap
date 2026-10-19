import "./PaymentMethodModal.css";

import { useTranslation } from "react-i18next";

export default function PaymentMethodModal({

    method,

    onClose

}) {

    const { t } = useTranslation();

    if (!method) return null;

    function renderField(label, value) {

        if (!value) return null;

        return (

            <div className="payment-detail">

                <span>

                    {label}

                </span>

                <strong>

                    {value}

                </strong>

            </div>

        );

    }

    return (

        <div

            className="payment-modal-overlay"

            onClick={onClose}

        >

            <div

                className="payment-modal"

                onClick={(e) => e.stopPropagation()}

            >

                {/* ===========================
                    HEADER
                =========================== */}

                <div className="payment-modal-header">

                    <div>

                        <h2>

                            {method.name}

                        </h2>

                        <p>

                            {t("payment_method_information")}

                        </p>

                    </div>

                    <button

                        className="payment-close"

                        onClick={onClose}

                    >

                        ✕

                    </button>

                </div>

                {/* ===========================
                    QR CODE
                =========================== */}

                {

                    method.qr_code_image_url &&

                    (

                        <div className="payment-qr">

                            <img

                                src={method.qr_code_image_url}

                                alt="QR Code"

                            />

                        </div>

                    )

                }

                {/* ===========================
                    INFORMATIONS
                =========================== */}

                <div className="payment-details-grid">

                    {

                        renderField(

                            t("account_name"),

                            method.account_name

                        )

                    }

                    {

                        renderField(

                            t("bank_name"),

                            method.bank_name

                        )

                    }

                    {

                        renderField(

                            t("rib"),

                            method.rib

                        )

                    }

                    {

                        renderField(

                            t("iban"),

                            method.iban

                        )

                    }

                    {

                        renderField(

                            t("swift_code"),

                            method.swift_code

                        )

                    }

                    {

                        renderField(

                            t("account_number"),

                            method.account_number

                        )

                    }

                    {

                        renderField(

                            t("payment_link"),

                            method.payment_url

                        )

                    }

                </div>

                {/* ===========================
                    INSTRUCTIONS
                =========================== */}

                {

                    method.instructions &&

                    (

                        <div className="payment-instructions">

                            <h3>

                                {t("payment_instructions")}

                            </h3>

                            <p>

                                {method.instructions}

                            </p>

                        </div>

                    )

                }

                {/* ===========================
                    FOOTER
                =========================== */}

                <div className="payment-modal-footer">

                    <button

                        className="payment-close-btn"

                        onClick={onClose}

                    >

                        {t("close")}

                    </button>

                </div>

            </div>

        </div>

    );

}