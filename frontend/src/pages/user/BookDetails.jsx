import "./BookDetails.css";

import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    FaArrowLeft,
    FaHeart,
    FaRegHeart,
    FaShoppingCart,
    FaBook,
    FaUser,
    FaStore,
    FaLanguage,
    FaCalendarAlt,
    FaTag
} from "react-icons/fa";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

export default function BookDetails() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const { type, id } = useParams();

    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(true);

    const [book, setBook] = useState(null);

    const [selectedImage, setSelectedImage] = useState("");

    const [favorite, setFavorite] = useState(false);

    /* ==========================================
       Charger le livre
    ========================================== */

    useEffect(() => {

        loadBook();

    }, [id, type]);

    async function loadBook() {

        try {

            setLoading(true);

            const res = await axios.get(

                `http://localhost:5000/api/magazine-user/book/${type}/${id}`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            console.log(res.data);

            setBook(res.data.book);

            setFavorite(

                res.data.book.favorite || false

            );

            if (

                res.data.book.images &&

                res.data.book.images.length > 0

            ) {

                setSelectedImage(

                    res.data.book.images[0].image_url

                );

            }

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    /* ==========================================
       Favoris
    ========================================== */

    async function toggleFavorite() {

        try {

            const body = {};

            if (type === "shop") {

                body.shop_inventory_id = id;

            }

            else {

                body.user_books_to_sell_id = id;


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

        }

        catch (error) {

            console.error(error);

        }

    }

    /* ==========================================
       Acheter
    ========================================== */

    function buyBook() {

        // Doit rediriger vers la page de checkout comme dans Magazine (bouton "Buy")
        // Exemple attendu: http://localhost:5173/user/magazine/checkout/shop/1
        navigate(`/user/magazine/checkout/${type}/${id}`);

    }

    /* ==========================================
       Retour
    ========================================== */

    function goBack() {

        navigate(-1);

    }

    /* ==========================================
       Loading
    ========================================== */

    if (loading) {

        return (

            <>

                <UserHeader />

                <div className="book-loading">

                    {t("loading")}...

                </div>

                <UserFooter />

            </>

        );

    }

    /* ==========================================
       Livre introuvable
    ========================================== */

    if (!book) {

        return (

            <>

                <UserHeader />

                <div className="book-loading">

                    {t("book_not_found")}

                </div>

                <UserFooter />

            </>

        );

    }
        return (

        <>

            <UserHeader />

            <section className="book-details-page">

                <div className="book-details-container">

                    {/* ===========================
                        Bouton retour
                    ============================ */}

                    <button

                        className="back-button"

                        onClick={goBack}

                    >

                        <FaArrowLeft />

                        {t("back")}

                    </button>

                    {/* ===========================
                        Contenu principal
                    ============================ */}

                    <div className="book-details-card">

                        {/* ===========================
                            Galerie images
                        ============================ */}

                        <div className="book-gallery">

                            <div className="main-image">

                                <img

                                    src={

                                        selectedImage ||

                                        "/images/book-placeholder.png"

                                    }

                                    alt={book.title}

                                />

                            </div>

                            {

                                book.images &&

                                book.images.length > 1 &&

                                <div className="thumbnail-list">

                                    {

                                        book.images.map((image) => (

                                            <img

                                                key={image.id}

                                                src={image.image_url}

                                                alt={book.title}

                                                className={

                                                    selectedImage === image.image_url

                                                        ? "active"

                                                        : ""

                                                }

                                                onClick={() =>

                                                    setSelectedImage(

                                                        image.image_url

                                                    )

                                                }

                                            />

                                        ))

                                    }

                                </div>

                            }

                        </div>

                        {/* ===========================
                            Informations
                        ============================ */}

                        <div className="book-info">

                            <div className="book-type">

                                {

                                    type === "shop"

                                        ?

                                        <>

                                            <FaStore />

                                            {t("store_book")}

                                        </>

                                        :

                                        <>

                                            <FaUser />

                                            {t("user_book")}

                                        </>

                                }

                            </div>

                            <h1>

                                {book.title}

                            </h1>

                            {

                                book.subtitle &&

                                <h3>

                                    {book.subtitle}

                                </h3>

                            }

                            <div className="book-meta">

                                <div>

                                    <FaBook />

                                    <span>

                                        {book.author}

                                    </span>

                                </div>

                                {

                                    book.publisher &&

                                    <div>

                                        <FaTag />

                                        <span>

                                            {book.publisher}

                                        </span>

                                    </div>

                                }

                                {

                                    book.language &&

                                    <div>

                                        <FaLanguage />

                                        <span>

                                            {book.language}

                                        </span>

                                    </div>

                                }

                                {

                                    book.publication_year &&

                                    <div>

                                        <FaCalendarAlt />

                                        <span>

                                            {book.publication_year}

                                        </span>

                                    </div>

                                }

                            </div>

                            <div className="price-box">

                                {

                                    (book.old_price || book.oldPrice) &&

                                    <span className="old-price">

                                        {(book.old_price || book.oldPrice)} DH

                                    </span>

                                }

                                <span className="current-price">

                                    {(book.price || book.selling_price || book.sellingPrice)} DH

                                </span>

                            </div>

                            {

                                type === "shop"

                                    ?

                                    <div className="stock-box">

                                        {

                                            book.stock > 0

                                                ?

                                                <span className="stock-available">

                                                    📦 {t("stock")} :

                                                    {" "}

                                                    {book.stock}

                                                </span>

                                                :

                                                <span className="stock-unavailable">

                                                    {t("out_of_stock")}

                                                </span>

                                        }

                                    </div>

                                    :

                                    <div className="seller-box">

                                        👤

                                        {" "}

                                        {book.seller.name}

                                    </div>

                            }
                                                        {/* ==========================================
                                Description
                            ========================================== */}

                            {

                                book.description &&

                                <div className="book-description">

                                    <h2>

                                        {t("description")}

                                    </h2>

                                    <p>

                                        {book.description}

                                    </p>

                                </div>

                            }

                            {/* ==========================================
                                Caractéristiques
                            ========================================== */}

                            <div className="book-features">

                                <h2>

                                    {t("book_information")}

                                </h2>

                                <div className="features-grid">

                                    {

                                        book.isbn &&

                                        <div className="feature-item">

                                            <strong>

                                                ISBN

                                            </strong>

                                            <span>

                                                {book.isbn}

                                            </span>

                                        </div>

                                    }

                                    {

                                        book.category &&

                                        <div className="feature-item">

                                            <strong>

                                                {t("category")}

                                            </strong>

                                            <span>

                                                {book.category}

                                            </span>

                                        </div>

                                    }

                                    {

                                        book.edition &&

                                        <div className="feature-item">

                                            <strong>

                                                {t("edition")}

                                            </strong>

                                            <span>

                                                {book.edition}

                                            </span>

                                        </div>

                                    }

                                    {

                                        book.cover_type &&

                                        <div className="feature-item">

                                            <strong>

                                                {t("cover_type")}

                                            </strong>

                                            <span>

                                                {book.cover_type}

                                            </span>

                                        </div>

                                    }

                                    {

                                        book.book_type &&

                                        <div className="feature-item">

                                            <strong>

                                                {t("book_type")}

                                            </strong>

                                            <span>

                                                {book.book_type}

                                            </span>

                                        </div>

                                    }

                                    {

                                        book.target_audience &&

                                        <div className="feature-item">

                                            <strong>

                                                {t("target_audience")}

                                            </strong>

                                            <span>

                                                {book.target_audience}

                                            </span>

                                        </div>

                                    }

                                    {

                                        book.condition &&

                                        <div className="feature-item">

                                            <strong>

                                                {t("condition")}

                                            </strong>

                                            <span>

                                                {book.condition}

                                            </span>

                                        </div>

                                    }

                                </div>

                            </div>

                            {/* ==========================================
                                Actions
                            ========================================== */}

                            <div className="book-actions">

                                <button

                                    className="favorite-btn"

                                    onClick={toggleFavorite}

                                >

                                    {

                                        favorite

                                            ?

                                            <FaHeart />

                                            :

                                            <FaRegHeart />

                                    }

                                    {

                                        favorite

                                            ?

                                            t("remove_favorite")

                                            :

                                            t("add_favorite")

                                    }

                                </button>

                                <button

                                    className="buy-btn"

                                    onClick={buyBook}

                                    disabled={

                                        type === "shop"

                                        &&

                                        book.stock <= 0

                                    }

                                >

                                    <FaShoppingCart />

                                    {t("buy_book")}

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <UserFooter />

        </>

    );

}