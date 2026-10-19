import "./MagazineBookCard.css";

import axios from "axios";
import { useState } from "react";
import {
    FaHeart,
    FaRegHeart,
    FaBook,
    FaUser,
    FaStore
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function MagazineBookCard({
    book,
    onDetails,
    onBuy
}) {

    const { t } = useTranslation();

    const [favorite, setFavorite] = useState(book.favorite || false);
    const [loadingFavorite, setLoadingFavorite] = useState(false);

    async function toggleFavorite() {

        try {

            setLoadingFavorite(true);

            const token = localStorage.getItem("token");

            const body = {};

            if (book.type === "shop") {
                body.shop_inventory_id = book.id;
            } else {
                body.user_books_to_sell_id = book.id;
            }

            await axios.post(
                "http://localhost:5000/api/favorites/toggle",
                body,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setFavorite(!favorite);

        } catch (error) {

            console.error(error);

        } finally {

            setLoadingFavorite(false);

        }

    }

    return (

        <div className="magazine-book-card">

            {/* IMAGE */}

            <div className="book-image-container">

                <img
                    className="book-image"
                    src={book.cover || "/images/book-placeholder.png"}
                    alt={book.title}
                />

                <div
                    className={`book-badge ${
                        book.type === "shop"
                            ? "shop-badge"
                            : "user-badge"
                    }`}
                >


                    {
                        book.type === "shop"

                            ? (
                                <>
                                    <FaStore />
                                    {t("store")}
                                </>
                            )

                            : (
                                <>
                                    <FaUser />
                                    {t("proposed_by")} {book.seller}
                                </>
                            )

                    }

                </div>

                {/* FAVORITE */}

                <button
                    className={`favorite-button ${
                        favorite ? "active" : ""
                    }`}
                    disabled={loadingFavorite}
                    onClick={toggleFavorite}
                >

                    {
                        favorite
                            ? <FaHeart />
                            : <FaRegHeart />
                    }

                </button>

            </div>

            {/* CONTENT */}

            <div className="book-content">

                <h5 className="book-title">
                    {book.title}
                </h5>

                <p className="book-author">
                    <FaBook />
                    {book.author}
                </p>

                {
                    book.publisher &&
                    <p className="book-publisher">
                        {book.publisher}
                    </p>
                }

                {
                    book.condition &&
                    <div className="book-condition">
                        {book.condition}
                    </div>
                }

                <div className="book-price">

                    {
                        book.old_price &&
                        <span className="old-price">
                            {book.old_price} DH
                        </span>
                    }

                    <span className="current-price">
                        {(book.price ??
                            book.sellingPrice ??
                            book.selling_price ??
                            "")} DH
                    </span>

                </div>

                {

                    book.type === "shop"

                        ? (

                            <div className="book-stock">

                                {

                                    book.stock > 0

                                        ? (

                                            <span className="stock-available">
                                                📦 {t("stock")} : {book.stock}
                                            </span>

                                        )

                                        : (

                                            <span className="stock-unavailable">
                                                {t("out_of_stock")}
                                            </span>

                                        )

                                }

                            </div>

                        )

                        : (

                            <div className="book-seller">
                                👤 {book.seller}
                            </div>

                        )

                }

            </div>

            {/* ACTIONS */}

            <div className="magazine-book-actions">

                <button
                    className="btn btn-details"
                    onClick={onDetails}
                >
                    {t("view_details")}
                </button>

                <button
                    className="btn btn-buy"
                    onClick={onBuy}
                    disabled={
                        book.type === "shop" &&
                        book.stock <= 0
                    }
                >
                    {t("buy_book")}
                </button>

            </div>

        </div>

    );

}