import "./BookCatalogSearch.css";

import { useEffect, useState } from "react";
import axios from "axios";

import {
    FaSearch,
    FaBook,
    FaUser,
    FaBarcode,
    FaCheckCircle
} from "react-icons/fa";

import { useTranslation } from "react-i18next";

export default function BookCatalogSearch({

    onSelectBook

}) {

    const { t } = useTranslation();

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);

    const [books, setBooks] = useState([]);

    const [selectedBookId, setSelectedBookId] = useState(null);

    /* ==========================================
       SEARCH BOOKS
    ========================================== */

    useEffect(() => {

        const timeout = setTimeout(() => {

            if (search.trim().length >= 2) {

                searchBooks();

            }

            else {

                setBooks([]);

            }

        }, 500);

        return () => clearTimeout(timeout);

    }, [search]);

    /* ==========================================
       API SEARCH
    ========================================== */

    async function searchBooks() {

        try {

            setLoading(true);

            const response = await axios.get(

                "http://localhost:5000/api/book-submissions/catalog/search",

                {

                    params: {

                        q: search

                    }

                }

            );
            console.log("BOOKS :", response.data);
            setBooks(

                response.data

            );

        }

        catch (error) {

            console.error(error);
            
        }

        finally {

            setLoading(false);

        }

    }
        /* ==========================================
       SELECT BOOK
    ========================================== */

    function selectBook(book) {

        setSelectedBookId(book.id);

        onSelectBook(book);

    }

    /* ==========================================
       RENDER
    ========================================== */

    return (

        <div className="book-catalog-search">

            {/* ==============================
                HEADER
            ============================== */}

            <div className="catalog-header">

                <h2>

                    {t("search_book_catalog")}

                </h2>

                <p>

                    {t("search_book_catalog_description")}

                </p>

            </div>

            {/* ==============================
                SEARCH INPUT
            ============================== */}

            <div className="catalog-search-box">

                <FaSearch className="search-icon" />

                <input

                    type="text"

                    value={search}

                    onChange={(e) =>

                        setSearch(

                            e.target.value

                        )

                    }

                    placeholder={t("search_by_title_author_isbn")}

                />

            </div>

            {/* ==============================
                LOADING
            ============================== */}

            {

                loading && (

                    <div className="catalog-loading">

                        {t("loading")}...

                    </div>

                )

            }

            {/* ==============================
                RESULTS
            ============================== */}

            {

                !loading &&

                books.length > 0 && (

                    <div className="catalog-results">
                                                {

                            books.map((book) => (

                                <div

                                    key={book.id}

                                    className={`catalog-book-card ${
                                        selectedBookId === book.id
                                            ? "selected"
                                            : ""
                                    }`}

                                >

                                    {/* ==========================
                                        COVER
                                    ========================== */}

                                    <div className="catalog-book-cover">

                                        <img
                                            src={
                                             book.book_images?.find(img => img.is_cover)?.image_url ||
                                             book.book_images?.[0]?.image_url ||
                                            "/images/book-placeholder.png"
                                            }
                                            alt={book.title}
                                    />

                                    </div>

                                    {/* ==========================
                                        INFORMATIONS
                                    ========================== */}

                                    <div className="catalog-book-content">

                                        <h3>

                                            {book.title}

                                        </h3>

                                        {

                                            book.subtitle && (

                                                <p className="catalog-subtitle">

                                                    {book.subtitle}

                                                </p>

                                            )

                                        }

                                        <div className="catalog-info">

                                            <FaUser />

                                            <span>

                                                {book.author}

                                            </span>

                                        </div>

                                        {

                                            book.publisher && (

                                                <div className="catalog-info">

                                                    <FaBook />

                                                    <span>

                                                        {book.publisher}

                                                    </span>

                                                </div>

                                            )

                                        }

                                        {

                                            book.isbn && (

                                                <div className="catalog-info">

                                                    <FaBarcode />

                                                    <span>

                                                        {book.isbn}

                                                    </span>

                                                </div>

                                            )

                                        }

                                    </div>

                                    {/* ==========================
                                        ACTION
                                    ========================== */}

                                    <div className="catalog-action">

                                        <button

                                            type="button"

                                            className={`select-book-btn ${
                                                selectedBookId === book.id
                                                    ? "selected"
                                                    : ""
                                            }`}

                                            onClick={() =>
                                                selectBook(book)
                                            }

                                        >

                                            <FaCheckCircle />

                                            {

                                                selectedBookId === book.id

                                                    ? t("selected_book")

                                                    : t("use_this_book")

                                            }

                                        </button>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }
                        {/* ==============================
                NO RESULT
            ============================== */}

            {

                !loading &&

                search.trim().length >= 2 &&

                books.length === 0 && (

                    <div className="catalog-empty">

                        <FaBook />

                        <h3>

                            {t("no_book_found")}

                        </h3>

                        <p>

                            {t("book_not_found_catalog")}

                        </p>

                    </div>

                )

            }

        </div>

    );

}
