import "./FavoriteBookDetails.css";

import { useTranslation } from "react-i18next";

export default function FavoriteBookDetails({

    book,

    onClose

}) {

    const { t } = useTranslation();

    if (!book) return null;

    const images =

        book.images?.length

            ? book.images

            : [

                {

                    image_url:

                        book.cover_image ||

                        book.coverImage ||

                        book.image_url

                }

            ];

    const catalog = book.catalog || {};

    return (

        <div

            className="favorite-details-overlay"

            onClick={onClose}

        >

            <div

                className="favorite-details-modal"

                onClick={(e) => e.stopPropagation()}

            >

                {/* =====================================
                    CLOSE
                ===================================== */}

                <button

                    className="favorite-details-close"

                    onClick={onClose}

                >

                    ✕

                </button>

                {/* =====================================
                    LEFT
                ===================================== */}

                <div className="favorite-details-gallery">

                    {

                        images.map((image, index) => (

                            <img

                                key={index}

                                src={image.image_url}

                                alt={catalog.title || book.title}

                            />

                        ))

                    }

                </div>

                {/* =====================================
                    RIGHT
                ===================================== */}

                <div className="favorite-details-content">

                    <h2>

                        {catalog.title || book.title}

                    </h2>

                    <p className="favorite-details-author">

                        {catalog.author || book.author}

                    </p>

                    <div className="favorite-details-grid">

                        <div>

                            <strong>

                                {t("isbn")}

                            </strong>

                            <span>

                                {catalog.isbn || "-"}

                            </span>

                        </div>

                        <div>

                            <strong>

                                {t("publisher")}

                            </strong>

                            <span>

                                {catalog.publisher || "-"}

                            </span>

                        </div>

                        <div>

                            <strong>

                                {t("edition")}

                            </strong>

                            <span>

                                {catalog.edition || "-"}

                            </span>

                        </div>

                        <div>

                            <strong>

                                {t("publication_year")}

                            </strong>

                            <span>

                                {

                                    catalog.publication_year ||

                                    catalog.publicationYear ||

                                    "-"

                                }

                            </span>

                        </div>

                        <div>

                            <strong>

                                {t("language")}

                            </strong>

                            <span>

                                {catalog.language || "-"}

                            </span>

                        </div>

                        <div>

                            <strong>

                                {t("category")}

                            </strong>

                            <span>

                                {catalog.category || "-"}

                            </span>

                        </div>

                        <div>

                            <strong>

                                {t("condition")}

                            </strong>

                            <span>

                                {t(book.condition || book.book_condition)}

                            </span>

                        </div>

                        <div>

                            <strong>

                                {t("price")}

                            </strong>

                            <span>

                                {

                                    book.price ??

                                    book.estimated_price

                                } DH

                            </span>

                        </div>

                        <div>

                            <strong>

                                {t("owner")}

                            </strong>

                            <span>

                                {

                                    book.owner_name ||

                                    "-"

                                }

                            </span>

                        </div>

                    </div>

                    {/* =====================================
                        SUMMARY
                    ===================================== */}

                    <div className="favorite-description">

                        <h3>

                            {t("summary")}

                        </h3>

                        <p>

                            {

                                catalog.summary ||

                                book.summary ||

                                "-"

                            }

                        </p>

                    </div>

                    {/* =====================================
                        DESCRIPTION
                    ===================================== */}

                    <div className="favorite-description">

                        <h3>

                            {t("description")}

                        </h3>

                        <p>

                            {

                                catalog.description ||

                                book.description ||

                                "-"

                            }

                        </p>

                    </div>

                    {/* =====================================
                        EXCHANGE DESCRIPTION
                    ===================================== */}

                    <div className="favorite-description">

                        <h3>

                            {t("exchange_description")}

                        </h3>

                        <p>

                            {

                                book.exchange_description ||

                                book.request_exchange_description ||

                                "-"

                            }

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}