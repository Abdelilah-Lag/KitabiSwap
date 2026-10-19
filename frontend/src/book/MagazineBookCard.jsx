import "./MagazineBookCard.css";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    FaArrowRight,
    FaBoxes,
    FaMoneyBillWave
} from "react-icons/fa";

export default function MagazineBookCard({ book }) {

    const { t } = useTranslation();

    const stock =
        typeof book.stock === "number"
            ? book.stock
            : Number(book.stock ?? 0);

    const isAvailable = stock > 0;

    const hasOldPrice =
        book.oldPrice !== null &&
        book.oldPrice !== undefined &&
        book.oldPrice !== "";

    return (

        <div className="magazine-card">

            {/* ==========================================================
                BOOK IMAGE
            ========================================================== */}

            <div className="magazine-image">

                <img
                    src={book.cover}
                    alt={book.title}
                />

                <span
                    className={`stock-badge ${
                        isAvailable ? "available" : "unavailable"
                    }`}
                >
                    {
                        isAvailable
                            ? t("available")
                            : t("out_of_stock")
                    }
                </span>

            </div>

            {/* ==========================================================
                BOOK CONTENT
            ========================================================== */}

            <div className="magazine-content">

                {/* ======================================================
                    HEADER
                ====================================================== */}

                <div className="book-header-card">

                    <h3 className="book-title">
                        {book.title}
                    </h3>

                    <p className="book-author">
                        {book.author}
                    </p>

                </div>

                {/* ======================================================
                    PRICE
                ====================================================== */}

                <div className="book-price-card">

                    <div className="price-left">

                        <div className="info-icon">
                            <FaMoneyBillWave />
                        </div>

                        <div>

                            <span className="price-label">
                                {t("price")}
                            </span>

                            <h5 className="price-value">
                                {book.sellingPrice} DH
                            </h5>

                            {
                                hasOldPrice && (
                                    <span className="old-price">
                                        {book.oldPrice} DH
                                    </span>
                                )
                            }

                        </div>

                    </div>

                </div>

                {/* ======================================================
                    STOCK INFORMATION
                ====================================================== */}

                <div className="book-info-card">

                    <div className="info-left">

                        <div className="info-icon">
                            <FaBoxes />
                        </div>

                        <div>

                            <span className="info-label">
                                {t("stock")}
                            </span>

                            <h4 className="info-value">
                                {stock}
                            </h4>

                        </div>

                    </div>

                </div>

                {/* ======================================================
                    ACTION BUTTON
                ====================================================== */}

                <Link
                    to={`/book/magazine/${book.id}`}
                    className={`buy-btn ${!isAvailable ? "disabled" : ""}`}
                >

                    <span>

                        {
                            isAvailable
                                ? t("buy_now")
                                : t("unavailable")
                        }

                    </span>

                    {
                        isAvailable && (
                            <FaArrowRight />
                        )
                    }

                </Link>

            </div>

        </div>

    );

}