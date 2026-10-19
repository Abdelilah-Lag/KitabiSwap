import "./BookDetails.css";
import axios from "axios";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import BookGallery from "../book/BookGallery";
import BookInfo from "../book/BookInfo";

import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function BookDetails() {

    const { t } = useTranslation();

    const { type, id } = useParams();

    const [book, setBook] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadBook();

    }, [type, id]);

    async function loadBook() {

        try {

            const res = await axios.get(

                `http://localhost:5000/api/books/details/${type}/${id}`

            );

            setBook(res.data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <>

                <Header />

                <div className="book-loading">

                    {t("loading")}

                </div>

                <Footer />

            </>

        );

    }

    if (!book) {

        return (

            <>

                <Header />

                <div className="book-loading">

                    {t("book_not_found")}

                </div>

                <Footer />

            </>

        );

    }

    return (

        <>

            <Header />

            <section className="book-details-page">

                <div className="book-details-wrapper">

                    {/* ===================== Breadcrumb ===================== */}

                    <div className="breadcrumb">

                        <Link to="/">
                            {t("home")}
                        </Link>

                        <span>/</span>

                        <span>

                            {

                                type === "exchange"

                                    ? t("exchange_books_title")

                                    : t("magazine_books_title")

                            }

                        </span>

                        <span>/</span>

                        <strong>

                            {book.book.title}

                        </strong>

                    </div>

                    {/* ===================== Hero ===================== */}

                    <div className="book-hero">

                        <BookGallery

                            cover={book.book.cover}

                            images={book.book.images}

                        />

                        <BookInfo

                            data={book}

                        />

                    </div>

                    {/* ===================== Description ===================== */}

                    <div className="book-section">

                        <h2>

                            {t("description")}

                        </h2>

                        <p>

                            {book.book.description || t("no_description")}

                        </p>

                    </div>

                    {/* ===================== Summary ===================== */}

                    <div className="book-section">

                        <h2>

                            {t("summary")}

                        </h2>

                        <p>

                            {book.book.summary || t("no_summary")}

                        </p>

                    </div>

                </div>

            </section>

            <Footer />

        </>

    );

}