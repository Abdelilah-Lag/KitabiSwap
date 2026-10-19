import "./BookPreview.css";

import { useTranslation } from "react-i18next";

import { FaBook, FaBuilding, FaExchangeAlt, FaGlobe, FaMoneyBillWave, FaStar, FaTag, FaUser } from "react-icons/fa";

export default function BookPreview({ formData, images, coverIndex }) {

    const { t } = useTranslation();

    const coverImage =

        images.length > 0

            ? images[coverIndex]?.preview

            : "/images/book-placeholder.png";

    return (

        <section className="submission-section">

            <div className="section-header">

                <h2>{t("preview")}</h2>

                <p>{t("preview_before_submit")}</p>

            </div>

            <div className="preview-card">

                <div className="preview-image">

                    <img src={coverImage} alt={formData.title || "book"} />

                </div>

                <div className="preview-content">

                    <h2 className="preview-title">{formData.title || t("book_title")}</h2>

                    {formData.subtitle && <h4 className="preview-subtitle">{formData.subtitle}</h4>}

                    <div className="preview-item">

                        <FaUser />

                        <span>{formData.author || t("author")}</span>

                    </div>

                    {formData.publisher && (

                        <div className="preview-item">

                            <FaBuilding />

                            <span>{formData.publisher}</span>

                        </div>

                    )}

                    {formData.language && (

                        <div className="preview-item">

                            <FaGlobe />

                            <span>{formData.language}</span>

                        </div>

                    )}

                    {formData.category && (

                        <div className="preview-item">

                            <FaTag />

                            <span>{formData.category}</span>

                        </div>

                    )}

                    {formData.targetAudience && (

                        <div className="preview-item">

                            <FaBook />

                            <span>{t(formData.targetAudience)}</span>

                        </div>

                    )}

                    {formData.condition && (

                        <div className="preview-item">

                            <FaStar />

                            <span>{t(formData.condition)}</span>

                        </div>

                    )}

                    {formData.publicationYear && (

                        <div className="preview-item">

                            <FaBook />

                            <span>{formData.publicationYear}</span>

                        </div>

                    )}

                    <div className="preview-item">

                        <FaExchangeAlt />

                        <span>

                            {formData.requestType === "sell" ? t("sell") : t("exchange")}

                        </span>

                    </div>

                    {formData.requestType === "sell" && formData.price && (

                        <div className="preview-item">

                            <FaMoneyBillWave />

                            <span>{formData.price} DH</span>

                        </div>

                    )}

                    {formData.requestType === "exchange" && formData.estimatedPrice && (

                        <div className="preview-item">

                            <FaMoneyBillWave />

                            <span>{formData.estimatedPrice} DH</span>

                        </div>

                    )}

                    {formData.isbn && (

                        <div className="preview-item">

                            <strong>{t("isbn")} : </strong>

                            <span>{formData.isbn}</span>

                        </div>

                    )}

                    {formData.pages && (

                        <div className="preview-item">

                            <strong>{t("pages")} : </strong>

                            <span>{formData.pages}</span>

                        </div>

                    )}

                    {formData.description && (

                        <div className="preview-section">

                            <h4>{t("description")}</h4>

                            <p>{formData.description}</p>

                        </div>

                    )}

                    {formData.summary && (

                        <div className="preview-section">

                            <h4>{t("summary")}</h4>

                            <p>{formData.summary}</p>

                        </div>

                    )}

                </div>

            </div>

        </section>

    );

}

