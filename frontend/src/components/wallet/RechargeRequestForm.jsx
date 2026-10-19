import "./RechargeRequestForm.css";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function RechargeRequestForm({

    onSubmit,
    loading = false

}) {

    const { t } = useTranslation();

    const fileInputRef = useRef(null);

    const [amount, setAmount] = useState("");

    const [proof, setProof] = useState(null);

    const [preview, setPreview] = useState("");

    const [errors, setErrors] = useState({});

    function handleImage(e) {

        const file = e.target.files[0];

        if (!file) return;

        setProof(file);

        setPreview(URL.createObjectURL(file));

    }

    function validate() {

        const newErrors = {};

        if (!amount) {

            newErrors.amount = t("required_field");

        }
        else if (Number(amount) < 20) {

            newErrors.amount = t("minimum_amount_20");

        }

        if (!proof) {

            newErrors.proof = t("payment_proof_required");

        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    }

    function submitForm(e) {

        e.preventDefault();

        if (!validate()) return;

        onSubmit({

            amount,

            proof

        });


    }

    return (

        <form

            className="wallet-form"

            onSubmit={submitForm}

        >

            <div className="wallet-form-header">

                <h2>

                    {t("submit_recharge_request")}

                </h2>

                <p>

                    {t("upload_payment_proof_description")}

                </p>

            </div>

            {/* ===========================
                AMOUNT
            =========================== */}

            <div className="wallet-input-group">

                <label>

                    {t("amount")} (MAD)

                </label>

                <input

                    type="number"

                    min="20"

                    step="0.01"

                    value={amount}

                    onChange={(e) => setAmount(e.target.value)}

                    placeholder="20"

                />

                {

                    errors.amount &&

                    <span className="wallet-error">

                        {errors.amount}

                    </span>

                }

            </div>

            {/* ===========================
                IMAGE
            =========================== */}

            <div className="wallet-input-group">

                <label>

                    {t("payment_proof")}

                </label>

                <input

                    hidden

                    type="file"

                    accept="image/*"

                    ref={fileInputRef}

                    onChange={handleImage}

                />

                <button

                    type="button"

                    className="wallet-upload-btn"

                    onClick={() => fileInputRef.current.click()}

                >

                    📷 {t("choose_image")}

                </button>

                {

                    preview &&

                    <div className="wallet-preview">

                        <img

                            src={preview}

                            alt="proof"

                        />

                    </div>

                }

                {

                    errors.proof &&

                    <span className="wallet-error">

                        {errors.proof}

                    </span>

                }

            </div>

            {/* ===========================
                INFO
            =========================== */}

            <div className="wallet-info-box">

                <strong>

                    ℹ {t("important")}

                </strong>

                <ul>

                    <li>

                        {t("minimum_recharge_is_20_mad")}

                    </li>

                    <li>

                        {t("proof_must_be_clear")}

                    </li>

                    <li>

                        {t("request_processed_after_validation")}

                    </li>

                </ul>

            </div>

            {/* ===========================
                BUTTON
            =========================== */}

            <button

                className="wallet-submit-btn"

                type="submit"

                disabled={loading}

            >

                {

                    loading

                        ? t("sending")

                        : t("submit_request")

                }

            </button>

        </form>

    );

}