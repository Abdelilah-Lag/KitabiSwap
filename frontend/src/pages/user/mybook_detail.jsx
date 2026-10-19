import "./mybook_detail.css";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

export default function MyBookDetail() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const { type, id } = useParams();

    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(true);

    const [book, setBook] = useState(null);

    const apiBase = "http://localhost:5000";

    const fetchUrl = useMemo(() => {

        if (type === "submission") return `${apiBase}/api/mybook-detail/submission/${id}`;

        if (type === "exchange") return `${apiBase}/api/mybook-detail/exchange/${id}`;

        if (type === "sale") return `${apiBase}/api/mybook-detail/sale/${id}`;


        return "";

    }, [type, id]);

    useEffect(() => {

        async function load() {

            try {

                setLoading(true);

                const res = await axios.get(fetchUrl, {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                });

                setBook(res.data.book || res.data.data || res.data || null);

            }

            catch (err) {

                console.error(err);

                setBook(null);

            }

            finally {

                setLoading(false);

            }

        }

        if (fetchUrl) load();

    }, [fetchUrl]);

    async function handleDelete() {

        if (!type || !id) return;

        if (!window.confirm(t("confirm_delete") || "Are you sure you want to delete this book?")) return;

        try {

            setLoading(true);

            await axios.delete(`${apiBase}/api/mybook-detail/${type}/${id}`, {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });

            navigate("/user/my-books");

        }

        catch (err) {

            console.error(err);

            alert(err?.response?.data?.message || "Delete failed");

        }

        finally {

            setLoading(false);

        }

    }

    function goBack() {

        navigate(-1);

    }

    if (loading) {

        return (

            <>

                <UserHeader />

                <div className="mybook-detail-loading">{t("loading")}...</div>

                <UserFooter />

            </>

        );

    }

    if (!book) {

        return (

            <>

                <UserHeader />

                <div className="mybook-detail-loading">{t("book_not_found") || "Not found"}</div>

                <UserFooter />

            </>

        );

    }

    const cover = book.cover || book?.catalog?.cover || book?.catalog?.images?.[0]?.image_url || "/images/book-placeholder.png";

    return (

        <>

            <UserHeader />

            <section className="mybook-detail-page">

                <div className="mybook-detail-container">

                    <button className="mybook-detail-back" onClick={goBack}>

                        {t("back")}

                    </button>

                    <div className="mybook-detail-card">

                        <div className="mybook-detail-cover">

                            <img src={cover} alt={book.title} />

                        </div>

                        <div className="mybook-detail-info">

                            <h1>{book.title}</h1>

                            {book.author && <p className="mybook-detail-author">{book.author}</p>}

                            {book.book_condition && (

                                <p className="mybook-detail-line">

                                    <b>{t("condition")}: </b>

                                    {book.book_condition}

                                </p>

                            )}

                            {!book.book_condition && book?.condition && (

                                <p className="mybook-detail-line">

                                    <b>{t("condition")}: </b>

                                    {book.condition}

                                </p>

                            )}

                            {book.price && (

                                <p className="mybook-detail-line">

                                    <b>{t("selling_price") || "Price"}: </b>

                                    {book.price} DH

                                </p>

                            )}

                            <div className="mybook-detail-actions">

                                <button className="mybook-detail-delete" onClick={handleDelete}>

                                    {t("delete") || "Supprimer"}

                                </button>

                                <button className="mybook-detail-cancel" onClick={() => navigate("/user/my-books")}>

                                    {t("cancel") || "Retour"}

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

