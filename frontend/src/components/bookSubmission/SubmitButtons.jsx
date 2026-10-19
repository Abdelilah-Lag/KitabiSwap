import "./SubmitButtons.css";

import {
    FaArrowLeft,
    FaPaperPlane,
    FaSpinner
} from "react-icons/fa";

import { useTranslation } from "react-i18next";

export default function SubmitButtons({

    loading = false,

    onSubmit,

    onCancel

}) {

    const { t } = useTranslation();

    return (

        <div className="submit-buttons">

            {/* ==========================
                CANCEL
            ========================== */}

            <button

                type="button"

                className="cancel-button"

                onClick={onCancel}

                disabled={loading}

            >

                <FaArrowLeft />

                <span>

                    {t("cancel")}

                </span>

            </button>

            {/* ==========================
                SUBMIT
            ========================== */}

            <button

                type="button"

                className="submit-button"

                onClick={onSubmit}

                disabled={loading}

            >

                {

                    loading

                        ? (

                            <>

                                <FaSpinner className="spin" />

                                <span>

                                    {t("sending")}

                                </span>

                            </>

                        )

                        : (

                            <>

                                <FaPaperPlane />

                                <span>

                                    {t("submit_book")}

                                </span>

                            </>

                        )

                }

            </button>

        </div>

    );

}