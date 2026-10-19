import "./BookCard.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    FaArrowRight,
    FaBookOpen,
    FaMoneyBillWave,
    FaUser
} from "react-icons/fa";

export default function BookCard({ book }) {

    const { t } = useTranslation();

    const condition = book.condition
        ? book.condition.toString().toLowerCase().replace(/\s+/g, "_")
        : "";

    const hasEstimatedPrice =
        book.estimatedPrice !== null &&
        book.estimatedPrice !== undefined;

    return (

        <div className="exchange-card">

            {/* IMAGE */}

            <div className="exchange-card-image">

                <img
                    src={book.book.cover}
                    alt={book.book.title}
                />

                {condition && (

                    <span className={`exchange-card-condition ${condition}`}>

                        {t(condition)}

                    </span>

                )}

            </div>

            {/* CONTENT */}

            <div className="exchange-card-content">

                <div className="exchange-card-header">

                    <h3 className="exchange-card-title">

                        {book.book.title}

                    </h3>

                    <p className="exchange-card-author">

                        {book.book.author}

                    </p>

                </div>

                <div className="exchange-card-details">

                    <div className="exchange-detail-item">

                        <div className="exchange-detail-icon">

                            <FaUser />

                        </div>

                        <div className="exchange-detail-text">

                            <span className="exchange-detail-label">

                                {t("proposed_by")}

                            </span>

                            <span className="exchange-detail-value">

                                {book.user.name}

                            </span>

                        </div>

                    </div>

                    <div className="exchange-detail-item">

                        <div className="exchange-detail-icon">

                            <FaBookOpen />

                        </div>

                        <div className="exchange-detail-text">

                            <span className="exchange-detail-label">

                                {t("condition")}

                            </span>

                            <span className="exchange-detail-value">

                                {t(book.condition.toLowerCase())}

                            </span>

                        </div>

                    </div>

                    {hasEstimatedPrice && (

                        <div className="exchange-detail-item exchange-price-item">

                            <div className="exchange-detail-icon exchange-price-icon">

                                <FaMoneyBillWave />

                            </div>

                            <div className="exchange-detail-text">

                                <span className="exchange-detail-label">

                                    {t("estimated_price")}

                                </span>

                                <span className="exchange-detail-value exchange-price-value">

                                    {book.estimatedPrice} DH

                                </span>

                            </div>

                        </div>

                    )}

                </div>

                <Link

                    to={`/book/exchange/${book.userBookId}`}

                    className="exchange-card-button"

                >

                    <span>

                        {t("view_book")}

                    </span>

                    <FaArrowRight />

                </Link>

            </div>

        </div>

    );

}