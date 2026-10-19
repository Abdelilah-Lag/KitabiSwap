import "./SecurityCard.css";

import {

    useState

} from "react";

import {

    useTranslation

} from "react-i18next";

export default function SecurityCard({

    onSave

}) {

    const { t } = useTranslation();

    const [formData, setFormData] = useState({

        currentPassword: "",

        newPassword: "",

        confirmPassword: ""

    });

    const [errors, setErrors] = useState({});

    function handleChange(event) {

        const {

            name,

            value

        } = event.target;

        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));

    }

    function validate() {

        const newErrors = {};

        if (!formData.currentPassword) {

            newErrors.currentPassword = t("required_field");

        }

        if (!formData.newPassword) {

            newErrors.newPassword = t("required_field");

        }

        else if (formData.newPassword.length < 8) {

            newErrors.newPassword = t("password_minimum_8_characters");

        }

        if (!formData.confirmPassword) {

            newErrors.confirmPassword = t("required_field");

        }

        else if (

            formData.newPassword !==

            formData.confirmPassword

        ) {

            newErrors.confirmPassword =

                t("passwords_do_not_match");

        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    }

    async function handleSubmit(event) {

        event.preventDefault();

        if (!validate()) return;

        try {

            await onSave(formData);

            setFormData({

                currentPassword: "",

                newPassword: "",

                confirmPassword: ""

            });

            setErrors({});

        }

        catch (error) {

            console.error(error);

        }

    }

    return (

        <div className="profile-card security-card">

            {/* ===================================
                HEADER
            =================================== */}

            <div className="profile-card-header">

                <h2>

                    {t("security")}

                </h2>

                <p>

                    {t("change_your_password_securely")}

                </p>

            </div>

            {/* ===================================
                FORM
            =================================== */}

            <form

                className="profile-form"

                onSubmit={handleSubmit}

            >

                {/* ========================= */}

                <div className="profile-input-group">

                    <label>

                        {t("current_password")}

                    </label>

                    <input

                        type="password"

                        name="currentPassword"

                        value={formData.currentPassword}

                        onChange={handleChange}

                    />

                    {

                        errors.currentPassword &&

                        <span className="profile-error">

                            {errors.currentPassword}

                        </span>

                    }

                </div>

                {/* ========================= */}

                <div className="profile-input-group">

                    <label>

                        {t("new_password")}

                    </label>

                    <input

                        type="password"

                        name="newPassword"

                        value={formData.newPassword}

                        onChange={handleChange}

                    />

                    {

                        errors.newPassword &&

                        <span className="profile-error">

                            {errors.newPassword}

                        </span>

                    }

                </div>

                {/* ========================= */}

                <div className="profile-input-group">

                    <label>

                        {t("confirm_new_password")}

                    </label>

                    <input

                        type="password"

                        name="confirmPassword"

                        value={formData.confirmPassword}

                        onChange={handleChange}

                    />

                    {

                        errors.confirmPassword &&

                        <span className="profile-error">

                            {errors.confirmPassword}

                        </span>

                    }

                </div>

                {/* ========================= */}

                <button

                    type="submit"

                    className="profile-save-btn"

                >

                    {t("change_password")}

                </button>

            </form>

        </div>

    );

}