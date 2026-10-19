import "./Magazine.css";

import axios from "axios";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import Header from "../header/Header";

import Footer from "../footer/Footer";

import MagazineSection from "../book/MagazineSection";

import heroImage from "../images/magazine.png";

export default function Magazine() {

    const { t } = useTranslation();

    const [books, setBooks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [language, setLanguage] = useState("");

    const [minPrice, setMinPrice] = useState("");

    const [maxPrice, setMaxPrice] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {

        loadBooks();

    }, [

        page,

        search,

        category,

        language,

        minPrice,

        maxPrice

    ]);

    async function loadBooks() {

        setLoading(true);

        try {

            const res = await axios.get(

                "http://localhost:5000/api/shop",

                {

                    params: {

                        page,

                        search,

                        category,

                        language,

                        minPrice,

                        maxPrice

                    }

                }

            );

            setBooks(res.data.books);

            setTotalPages(res.data.totalPages);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }
        return (

        <>

            <Header />

            {/* ======================================================
                            HERO
            ======================================================= */}

            <section className="magazine-hero">

                <div className="magazine-container">

                    <div className="magazine-left">

                        <span className="magazine-tag">

                            {t("magazine_tag")}

                        </span>

                        <h1>

                            {t("magazine_title")}

                        </h1>

                        <p>

                            {t("magazine_description")}

                        </p>

                        <div className="search-box">

                            <input

                                type="text"

                                placeholder={t("search_magazine")}

                                value={search}

                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }

                            />

                        </div>

                    </div>

                    <div className="magazine-right">

                        <img

                            src={heroImage}

                            alt="Magazine"

                        />

                    </div>

                </div>

            </section>

            {/* ======================================================
                            FILTERS
            ======================================================= */}

            <section className="filters-section">

                <div className="magazine-container">

                    <div className="filters">

                        {/* CATEGORY */}

                        <div className="filter-group">

                            <label className="filter-title">

                                {t("category")}

                            </label>

                            <select

                                value={category}

                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }

                            >

                                <option value="">

                                    {t("all_categories")}

                                </option>

                                <option value="Novel">

                                    Novel

                                </option>

                                <option value="Science">

                                    Science

                                </option>

                                <option value="History">

                                    History

                                </option>

                                <option value="Programming">

                                    Programming

                                </option>

                                <option value="Business">

                                    Business

                                </option>

                            </select>

                        </div>

                        {/* LANGUAGE */}

                        <div className="filter-group">

                            <label className="filter-title">

                                {t("language")}

                            </label>

                            <select

                                value={language}

                                onChange={(e) =>
                                    setLanguage(e.target.value)
                                }

                            >

                                <option value="">

                                    {t("all_languages")}

                                </option>

                                <option value="English">

                                    English

                                </option>

                                <option value="French">

                                    French

                                </option>

                                <option value="Arabic">

                                    Arabic

                                </option>

                            </select>

                        </div>

                        {/* MIN PRICE */}

                        <div className="filter-group">

                            <label className="filter-title">

                                {t("min_price")}

                            </label>

                            <input

                                type="number"

                                placeholder="0"

                                value={minPrice}

                                onChange={(e) =>
                                    setMinPrice(e.target.value)
                                }

                            />

                        </div>

                        {/* MAX PRICE */}

                        <div className="filter-group">

                            <label className="filter-title">

                                {t("max_price")}

                            </label>

                            <input

                                type="number"

                                placeholder="1000"

                                value={maxPrice}

                                onChange={(e) =>
                                    setMaxPrice(e.target.value)
                                }

                            />

                        </div>

                    </div>

                </div>

            </section>

            {/* ======================================================
                    PARTIE 3 :
                    MAGAZINE BOOKS
            ======================================================= */}
                        {/* ======================================================
                            MAGAZINE BOOKS
            ======================================================= */}

            <section className="magazine-books">

                <div className="magazine-container">

                    {

                        loading ?

                        (

                            <div className="loading">

                                {t("loading")}

                            </div>

                        )

                        :

                        books.length > 0 ?

                        (

                            <MagazineSection

                            books={books}

                            showAll={false}

                            showTitle={false}

                        />

                        )

                        :

                        (

                            <div className="no-books">

                                <h2>

                                    {t("no_books_found")}

                                </h2>

                                <p>

                                    {t("try_another_search")}

                                </p>

                            </div>

                        )

                    }

                </div>

            </section>

            {/* ======================================================
                            PAGINATION
            ======================================================= */}

            <section className="pagination-section">

                <div className="pagination">

                    <button

                        disabled={page === 1}

                        onClick={() => setPage(page - 1)}

                    >

                        {t("previous")}

                    </button>

                    <span>

                        {t("page")}

                        {" "}

                        {page}

                        {" / "}

                        {totalPages}

                    </span>

                    <button

                        disabled={page === totalPages}

                        onClick={() => setPage(page + 1)}

                    >

                        {t("next")}

                    </button>

                </div>

            </section>

            {/* ======================================================
                    PARTIE 4 :
                    FOOTER
            ======================================================= */}
                        <Footer />

        </>

    );

}