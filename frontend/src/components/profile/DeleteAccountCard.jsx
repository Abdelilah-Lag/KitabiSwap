import "./DeleteAccountCard.css";

import {

    useState

} from "react";

import {

    useTranslation

} from "react-i18next";

export default function DeleteAccountCard({

    onDelete

}) {

    const { t } = useTranslation();

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleDelete() {

        if (!password) {

            alert(

                t("please_enter_your_password")

            );

            return;

        }

        const confirmed = window.confirm(

            t("delete_account_confirmation")

        );

        if (!confirmed) return;

        try {

            setLoading(true);

            await onDelete({

                password

            });

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="profile-card delete-account-card">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="profile-card-header">

                <h2>

                    {t("delete_account")}

                </h2>

                <p>

                    {t("delete_account_description")}

                </p>

            </div>

            {/* =====================================
                WARNING
            ===================================== */}

            <div className="delete-warning">

                <h3>

                    ⚠ {t("warning")}

                </h3>

                <ul>

                    <li>

                        {t("delete_account_warning_1")}

                    </li>

                    <li>

                        {t("delete_account_warning_2")}

                    </li>

                    <li>

                        {t("delete_account_warning_3")}

                    </li>

                    <li>

                        {t("delete_account_warning_4")}

                    </li>

                </ul>

            </div>

            {/* =====================================
                PASSWORD
            ===================================== */}

            <div className="profile-input-group">

                <label>

                    {t("confirm_password")}

                </label>

                <input

                    type="password"

                    value={password}

                    onChange={(event) =>

                        setPassword(

                            event.target.value

                        )

                    }

                    placeholder={t("enter_password")}

                />

            </div>

            {/* =====================================
                BUTTON
            ===================================== */}

            <button

                type="button"

                className="delete-account-btn"

                disabled={loading}

                onClick={handleDelete}

            >

                {

                    loading

                        ? t("deleting")

                        : t("delete_my_account")

                }

            </button>

        </div>

    );

}