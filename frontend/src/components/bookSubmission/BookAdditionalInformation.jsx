import "./BookAdditionalInformation.css";

import { useTranslation } from "react-i18next";

export default function BookAdditionalInformation() {

    // Placeholder: this project structure currently uses BookInformationForm

    // for both basic and additional information.

    const { t } = useTranslation();

    return (

        <section className="submission-section">

            <div className="section-header">

                <h2>{t("additional_information")}</h2>

                <p>{t("complete_book_details")}</p>

            </div>

            <p style={{ opacity: 0.7 }}>

                {t("not_implemented") || "Not implemented"}

            </p>

        </section>

    );

}

