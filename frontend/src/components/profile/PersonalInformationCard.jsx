import "./PersonalInformationCard.css";

import {

    useEffect,
    useState

} from "react";

import {

    useTranslation

} from "react-i18next";

export default function PersonalInformationCard({

    user,

    onSave

}) {

    const { t } = useTranslation();

    const [formData, setFormData] = useState({

        first_name: "",

        last_name: "",

        email: "",

        phone: ""

    });


    useEffect(() => {

        if (!user) return;

        setFormData({

            first_name: user.first_name || "",

            last_name: user.last_name || "",

            email: user.email || "",

            phone: user.phone || ""

        });


    }, [user]);

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

    function handleSubmit(event) {

        event.preventDefault();

        onSave(formData);

    }

    return (

        <div className="profile-card">

            {/* ===================================
                HEADER
            =================================== */}

            <div className="profile-card-header">

                <h2>

                    {t("personal_information")}

                </h2>

                <p>

                    {t("update_your_personal_information")}

                </p>

            </div>

            {/* ===================================
                FORM
            =================================== */}

            <form

                className="profile-form"

                onSubmit={handleSubmit}

            >

                <div className="profile-grid">

                    <div className="profile-input-group">

                        <label>

                            {t("first_name")}

                        </label>

                        <input

                            type="text"

                            name="first_name"

                            value={formData.first_name}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="profile-input-group">

                        <label>

                            {t("last_name")}

                        </label>

                        <input

                            type="text"

                            name="last_name"

                            value={formData.last_name}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="profile-input-group">

                        <label>

                            {t("email")}

                        </label>

                        <input

                            type="email"

                            name="email"

                            value={formData.email}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="profile-input-group">

                        <label>

                            {t("phone")}

                        </label>

                        <input

                            type="text"

                            name="phone"

                            value={formData.phone}

                            onChange={handleChange}

                        />

                    </div>



                </div>

                <button

                    type="submit"

                    className="profile-save-btn"

                >

                    {t("save_changes")}

                </button>

            </form>

        </div>

    );

}