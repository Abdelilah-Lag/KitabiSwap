import "./BookBasicInformation.css";

import { useTranslation } from "react-i18next";

export default function BookBasicInformation({ formData, setFormData, errors }) {

    const { t } = useTranslation();

    function handleChange(e) {

        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

    }

    return (

        <section className="submission-section">

            <div className="section-header">

                <h2>{t("basic_information")}</h2>

                <p>{t("fill_book_main_information")}</p>

            </div>

            <div className="submission-grid">

                <div className="input-group full">

                    <label>{t("title")}</label>

                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder={t("title")} />

                    {errors?.title && <span className="error">{errors.title}</span>}

                </div>

                <div className="input-group full">

                    <label>{t("subtitle")}</label>

                    <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder={t("subtitle")} />

                </div>

                <div className="input-group">

                    <label>{t("author")}</label>

                    <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder={t("author")} />

                </div>

                <div className="input-group">

                    <label>{t("publisher")}</label>

                    <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} placeholder={t("publisher")} />

                </div>

                <div className="input-group">

                    <label>{t("isbn")}</label>

                    <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} placeholder="978..." />

                </div>

            </div>

        </section>

    );

}

