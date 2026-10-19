import "./Explore.css";

import axios from "axios";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Header from "../header/Header";
import Footer from "../footer/Footer";

import ExchangeSection from "../book/ExchangeSection";

import heroImage from "../images/exchange.png";

export default function Explore() {

    const { t } = useTranslation();

    const [books, setBooks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [language, setLanguage] = useState("");

    const [condition, setCondition] = useState("");

    const [availability, setAvailability] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {

        loadBooks();

    }, [
        page,
        search,
        category,
        language,
        condition,
        availability
    ]);

    async function loadBooks() {

        setLoading(true);

        try {

            const res = await axios.get(

                "http://localhost:5000/api/explore",

                {

                    params: {

                        page,

                        search,

                        category,

                        language,

                        condition,

                        availability

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

            <section className="explore-hero">

                <div className="explore-container">

                    <div className="explore-left">

                        <span className="explore-tag">
                            {t("explore_tag")}
                        </span>

                        <h1>
                            {t("explore_title")}
                        </h1>

                        <p>
                            {t("explore_description")}
                        </p>

                        <div className="search-box">

                            <input

                                type="text"

                                placeholder={t("search_books")}

                                value={search}

                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }

                            />

                        </div>

                    </div>

                    <div className="explore-right">

                        <img

                            src={heroImage}

                            alt="Explore Books"

                        />

                    </div>

                </div>

            </section>

            {/* ======================================================
                            FILTERS
            ======================================================= */}

            <section className="filters-section">

                <div className="explore-container">

                    <div className="filters">

                        {/* CATEGORY */}

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

                            <option value="Education">
                                Education
                            </option>

                        </select>

                        {/* LANGUAGE */}

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

                        {/* CONDITION */}

                        <select

                            value={condition}

                            onChange={(e) =>
                                setCondition(e.target.value)
                            }

                        >

                            <option value="">
                                {t("all_conditions")}
                            </option>

                            <option value="New">
                                {t("new")}
                            </option>

                            <option value="Like New">
                                {t("like_new")}
                            </option>

                            <option value="Very Good">
                                {t("very_good")}
                            </option>

                            <option value="Good">
                                {t("good")}
                            </option>

                            <option value="Acceptable">
                                {t("acceptable")}
                            </option>

                        </select>

                        {/* AVAILABILITY */}

                        <select

                            value={availability}

                            onChange={(e) =>
                                setAvailability(e.target.value)
                            }

                        >

                            <option value="">
                                {t("all_books")}
                            </option>

                            <option value="available">
                                {t("available")}
                            </option>

                            <option value="reserved">
                                {t("reserved")}
                            </option>

                        </select>

                    </div>

                </div>

            </section>

            {/* ======================================================
                    PARTIE 3 :
                    BOOKS GRID
            ======================================================= */}
                        {/* ======================================================
                            BOOKS
            ======================================================= */}

            <section className="explore-books">

                <div className="explore-container">

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

                            <ExchangeSection
                                books={books}
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

                        onClick={() =>
                            setPage(page - 1)
                        }

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

                        onClick={() =>
                            setPage(page + 1)
                        }

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