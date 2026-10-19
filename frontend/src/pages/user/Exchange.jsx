import "./Exchange.css";
import axios from "axios";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

import ExchangeFilters from "../../components/exchange/ExchangeFilters";
import ExchangeCard from "../../components/exchange/ExchangeCard";

export default function Exchange() {

    const { t } = useTranslation();

    const [books, setBooks] = useState([]);

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({

        search: "",

        category: "",

        language: "",

        condition: "",

        city: "",

        sort: "newest"

    });

    useEffect(() => {

        loadUser();
        loadBooks();

    }, [filters]);

    async function loadUser() {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(

                "http://localhost:5000/api/user/dashboard",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setUser(res.data.user || null);

        }

        catch (err) {

            console.error(err);

        }

    }

    async function loadBooks() {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(

                "http://localhost:5000/api/exchange/books",

                {

                    params: filters,

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setBooks(res.data.books);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <>

            <UserHeader user={user} />

            <div className="exchange-page">

                <div className="exchange-container">

                    <div className="exchange-title">

                        <h1>

                            {t("exchange_books")}

                        </h1>

                        <p>

                            {t("exchange_books_description")}

                        </p>

                    </div>

                    <ExchangeFilters

                        filters={filters}

                        setFilters={setFilters}

                    />

                    {

                        loading ?

                        (

                            <div className="exchange-loading">

                                {t("loading")}

                            </div>

                        )

                        :

                        books.length === 0 ?

                        (

                            <div className="exchange-empty">

                                {t("no_books_found")}

                            </div>

                        )

                        :

                        (

                            <div className="exchange-grid">

                                {

                                    books.map(book => (

                                        <ExchangeCard

                                            key={book.id}

                                            book={book}

                                        />

                                    ))

                                }

                            </div>

                        )

                    }

                </div>

            </div>

            <UserFooter />

        </>

    );

}