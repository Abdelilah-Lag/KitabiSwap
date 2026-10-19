import "./BookDescription.css";

import { useTranslation } from "react-i18next";

export default function BookDescription({ formData, setFormData, errors }) {

    const { t } = useTranslation();

    function handleChange(e) {

        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

    }

    return (

        <section className="submission-section">

            <div className="section-header">

                <h2>{t("book_description")}</h2>

                <p>{t("describe_your_book")}</p>

            </div>

            <div className="submission-grid">

                <div className="input-group">

                    <label>{t("request_type")}</label>

                    <select name="requestType" value={formData.requestType} onChange={handleChange}>

                        <option value="exchange">{t("exchange")}</option>

                        <option value="sell">{t("sell")}</option>

                    </select>

                </div>

                <div className="input-group">

                    <label>{t("condition")}</label>

                    <select name="condition" value={formData.condition} onChange={handleChange}>

                        <option value="new">{t("new")}</option>

                        <option value="like_new">{t("like_new")}</option>

                        <option value="very_good">{t("very_good")}</option>

                        <option value="good">{t("good")}</option>

                        <option value="acceptable">{t("acceptable")}</option>

                        <option value="poor">{t("poor")}</option>

                    </select>

                </div>

                {formData.requestType === "exchange" && (

                    <div className="input-group">

                        <label>{t("estimated_price")}</label>

                        <input type="number" name="estimatedPrice" value={formData.estimatedPrice} onChange={handleChange} />

                    </div>

                )}

                {formData.requestType === "sell" && (

                    <div className="input-group">

                        <label>{t("price")}</label>

                        <input type="number" name="price" value={formData.price} onChange={handleChange} />

                    </div>

                )}

                <div className="input-group full">

                    <label>{t("summary")}</label>

                    <textarea name="summary" rows={4} value={formData.summary} onChange={handleChange} />

                </div>

                <div className="input-group full">

                    <label>{t("description")}</label>

                    <textarea name="description" rows={6} value={formData.description} onChange={handleChange} />

                    {errors?.description && <span className="error">{errors.description}</span>}

                </div>

            </div>

        </section>

    );

}

