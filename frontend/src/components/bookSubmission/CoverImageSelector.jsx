import "./CoverImageSelector.css";

import { useTranslation } from "react-i18next";

import { FaCheckCircle, FaRegImage } from "react-icons/fa";

export default function CoverImageSelector({ images, coverIndex, setCoverIndex }) {

    const { t } = useTranslation();

    function selectCover(index) {

        setCoverIndex(index);

    }

    return (

        <section className="submission-section">

            <div className="section-header">

                <h2>{t("cover_image")}</h2>

                <p>{t("select_cover_image")}</p>

            </div>

            {images.length === 0 && (

                <div className="cover-empty">

                    <FaRegImage />

                    <h3>{t("no_images_selected")}</h3>

                    <p>{t("upload_images_first")}</p>

                </div>

            )}

            {images.length > 0 && (

                <div className="cover-grid">

                    {images.map((image, index) => (

                        <div

                            key={index}

                            className={`cover-card ${coverIndex === index ? "selected" : ""}`}

                            onClick={() => selectCover(index)}

                        >

                            <img src={image.preview} alt={`cover-${index}`} />

                            <div className="cover-overlay">

                                {coverIndex === index ? (

                                    <div className="selected-cover">

                                        <FaCheckCircle />

                                        <span>{t("cover_image")}</span>

                                    </div>

                                ) : (

                                    <button

                                        type="button"

                                        className="select-cover-button"

                                    >

                                        {t("select_cover")}

                                    </button>

                                )}

                            </div>

                            <span className="cover-number">

                                #{index + 1}

                            </span>

                        </div>

                    ))}

                </div>

            )}

            {images.length > 0 && (

                <div className="cover-information">

                    <h4>{t("important")}</h4>

                    <p>{t("cover_image_information")}</p>

                    <ul>

                        <li>✓ {t("cover_image_visible_everywhere")}</li>

                        <li>✓ {t("users_see_cover_first")}</li>

                        <li>✓ {t("cover_can_be_changed_before_submit")}</li>

                    </ul>

                </div>

            )}

        </section>

    );

}

