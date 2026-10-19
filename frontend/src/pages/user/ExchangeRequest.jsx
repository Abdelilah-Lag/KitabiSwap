import "./ExchangeRequest.css";

import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

import SelectedBookCard from "../../components/exchange/SelectedBookCard";

export default function ExchangeRequest() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const { id } = useParams();

    const [ownerBooks, setOwnerBooks] = useState([]);

    const [user, setUser] = useState(null);

    const [myBooks, setMyBooks] = useState([]);

    // Livres demandés (appartenant au propriétaire du livre cliqué)
    const [selectedRequestedBooks, setSelectedRequestedBooks] = useState([]);

    // Livres offerts (mes livres)
    const [selectedOfferedBooks, setSelectedOfferedBooks] = useState([]);

    const [message, setMessage] = useState(
        "Bonjour,\nJe souhaite échanger mes livres contre votre livre."
    );

    const [loading, setLoading] = useState(true);

    const [sending, setSending] = useState(false);

    useEffect(() => {

        loadUser();
        loadData();

    }, [id]);

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

        catch (error) {

            console.error("Failed to load user profile", error);

            try {

                const storedUser = localStorage.getItem("user");

                if (storedUser) {

                    setUser(JSON.parse(storedUser));

                }

            }

            catch (parseError) {

                console.error("Failed to parse stored user", parseError);

            }

        }

    }

    async function loadData() {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(

                `http://localhost:5000/api/exchange/request-page/${id}`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            const data = res.data;

            setOwnerBooks(Array.isArray(data.requestedBooks) ? data.requestedBooks : []);

            setMyBooks(Array.isArray(data.myBooks) ? data.myBooks : []);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    function toggleRequestedBook(bookId) {

        if (selectedRequestedBooks.includes(bookId)) {

            setSelectedRequestedBooks(

                selectedRequestedBooks.filter(id => id !== bookId)

            );

            return;

        }

        if (selectedRequestedBooks.length >= 5) {

            alert(t("maximum_5_books"));

            return;

        }

        setSelectedRequestedBooks([

            ...selectedRequestedBooks,

            bookId

        ]);

    }

    function toggleOfferedBook(bookId) {

        if (selectedOfferedBooks.includes(bookId)) {

            setSelectedOfferedBooks(

                selectedOfferedBooks.filter(id => id !== bookId)

            );

            return;

        }

        if (selectedOfferedBooks.length >= 5) {

            alert(t("maximum_5_books"));

            return;

        }

        setSelectedOfferedBooks([

            ...selectedOfferedBooks,

            bookId

        ]);

    }

    async function sendRequest() {

        if (selectedRequestedBooks.length === 0) {

            alert(t("select_at_least_one_book"));

            return;

        }

        if (selectedOfferedBooks.length === 0) {

            alert(t("select_at_least_one_book"));

            return;

        }

        try {

            setSending(true);

            const token = localStorage.getItem("token");

            await axios.post(

                "http://localhost:5000/api/exchange/request",

                {

                    requestedBooks: selectedRequestedBooks,

                    offeredBooks: selectedOfferedBooks,

                    message

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            alert(t("exchange_request_sent"));

            navigate("/user/exchange");

        }

        catch (error) {

            console.error(error);

            alert(t("unexpected_error"));

        }

        finally {

            setSending(false);

        }

    }

    if (loading) {

        return (

            <>

                <UserHeader user={user} />

                <div className="exchange-request-loading">{t("loading")}</div>

                <UserFooter />

            </>

        );

    }

    return (

        <>

            <UserHeader user={user} />

            <section className="exchange-request-page">

                <div className="exchange-request-container">

                    <div className="exchange-request-header">

                        <h1>{t("request_exchange")}</h1>

                        <p>{t("request_exchange_description")}</p>

                    </div>

                    <div className="requested-book-section">

                        <h2>{t("requested_book")}</h2>

                        <div className="selected-books-grid">

                            {ownerBooks.length === 0 ? (

                                <div className="empty-books">{t("no_books_available")}</div>

                            ) : (

                                ownerBooks.map(book => (

                                    <SelectedBookCard

                                        key={book.id}

                                        book={book}

                                        selected={selectedRequestedBooks.includes(book.id)}

                                        onSelect={toggleRequestedBook}

                                    />

                                ))

                            )}

                        </div>

                        <div className="my-books-header" style={{ marginTop: 25 }}>

                            <span>{selectedRequestedBooks.length} / 5</span>

                        </div>

                    </div>

                    <div className="my-books-section">

                        <div className="my-books-header">

                            <h2>{t("select_your_books")}</h2>

                            <span>{selectedOfferedBooks.length} / 5</span>

                        </div>

                        {myBooks.length === 0 ? (

                            <div className="empty-books">{t("no_books_available")}</div>

                        ) : (

                            <div className="selected-books-grid">

                                {myBooks.map(book => (

                                    <SelectedBookCard

                                        key={book.id}

                                        book={book}

                                        selected={selectedOfferedBooks.includes(book.id)}

                                        onSelect={toggleOfferedBook}

                                    />

                                ))}

                            </div>

                        )}

                    </div>

                    <div className="exchange-message-section">

                        <h2>{t("message_to_owner")}</h2>

                        <textarea

                            value={message}

                            onChange={(e) => setMessage(e.target.value)}

                            rows={8}

                        />

                    </div>

                    <div className="exchange-submit">

                        <button className="cancel-btn" onClick={() => navigate(-1)}>

                            {t("cancel")}

                        </button>

                        <button

                            className="send-btn"

                            disabled={sending || selectedRequestedBooks.length === 0 || selectedOfferedBooks.length === 0}

                            onClick={sendRequest}

                        >

                            {sending ? t("sending") : t("send_exchange_request")}

                        </button>

                    </div>

                </div>

            </section>

            <UserFooter />

        </>

    );

}

