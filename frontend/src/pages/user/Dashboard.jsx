import "./Dashboard.css";
import axios from "axios";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

export default function Dashboard() {

    const navigate = useNavigate();


    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState({

        user: {},

        wallet: {},

        stats: {},

        recentBooks: [],

        notifications: [],
        exchangeRequests: []

    });

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

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

            setDashboard(res.data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    function canOpenChat(req) {

        return (

            req.receiver_confirmed &&

            dashboard.user &&

            (

                req.requester_id === dashboard.user.id ||

                req.receiver_id === dashboard.user.id

            )

        );

    }

    return (


        <>

            <UserHeader user={dashboard.user} />

            <main className="dashboard-page">

                {

                    loading ?

                    (

                        <div className="dashboard-loading">

                            {t("loading")}

                        </div>

                    )

                    :

                    (

                        <>


                            {/* ================= HERO ================= */}

                            <section className="dashboard-hero">

                                <div>

                                    <h1>

                                        {t("hello")} {dashboard.user.first_name} 👋

                                    </h1>

                                    <p>

                                        {t("welcome_back")}

                                    </p>

                                </div>

                            </section>

                            {/* ================= STATS ================= */}

                            <section className="dashboard-stats">

                                <div className="stat-card">

                                    <h4>

                                        {t("wallet")}

                                    </h4>

                                    <h2>

                                        {dashboard.wallet.balance ?? 0} DH

                                    </h2>

                                </div>

                                <div className="stat-card">

                                    <h4>

                                        {t("my_books")}

                                    </h4>

                                    <h2>

                                        {dashboard.stats.books ?? 0}

                                    </h2>

                                </div>

                                <div className="stat-card">

                                    <h4>

                                        {t("exchange")}

                                    </h4>

                                    <h2>

                                        {dashboard.stats.exchanges ?? 0}

                                    </h2>

                                </div>

                                <div className="stat-card">

                                    <h4>

                                        {t("orders")}

                                    </h4>

                                    <h2>

                                        {dashboard.stats.orders ?? 0}

                                    </h2>

                                </div>

                            </section>

                            {/* ================= CONTENT ================= */}

                            <section className="dashboard-content">

                                {/* ================= EXCHANGE REQUESTS ================= */}

                                <div className="dashboard-box exchange-requests-box">

                                    <div className="box-title">

                                        <h2>{t("exchange_requests") || "Demandes d'échange"}</h2>

                                    </div>

                                    {dashboard.exchangeRequests && dashboard.exchangeRequests.length > 0 ? (

                                        dashboard.exchangeRequests.map(req => (

                                            <div key={req.id} className="exchange-request-item">

                                                <div className="exchange-request-meta">

                                                    <div className="exchange-request-header-row">

                                                        <span className={`exchange-request-status ${req.receiver_confirmed ? "accepted" : "pending"}`}>

                                                            {req.receiver_confirmed ? "Confirmé" : "En attente"}

                                                        </span>

                                                    </div>

                                                    <p className="exchange-request-message">

                                                        {req.requester_message || ""}

                                                    </p>

                                                    <div className="exchange-request-books">

                                                        <div>
                                                            <strong>Demandés:</strong> {Array.isArray(req.receiver_books_titles) && req.receiver_books_titles.length > 0 ? req.receiver_books_titles.join(", ") : (Array.isArray(req.receiver_books) ? req.receiver_books.join(", ") : "")}
                                                        </div>

                                                        <div>
                                                            <strong>Offerts:</strong> {Array.isArray(req.requester_books_titles) && req.requester_books_titles.length > 0 ? req.requester_books_titles.join(", ") : (Array.isArray(req.requester_books) ? req.requester_books.join(", ") : "")}
                                                        </div>


                                                    </div>

                                                </div>



                                                {canOpenChat(req) && (
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() => navigate(`/user/exchange/chat-delivery/${req.id}`)}
                                                    >
                                                        {t("delivery_chat") || "Communiquer sur la livraison"}
                                                    </button>
                                                )}

                                                {!req.receiver_confirmed && dashboard.user && req.receiver_id === dashboard.user.id && (


                                                    <button

                                                        className="btn btn-primary"

                                                        onClick={async () => {

                                                            try {

                                                                const token = localStorage.getItem("token");

                                                                await axios.post(

                                                                    `http://localhost:5000/api/exchange/request/${req.id}/accept`,

                                                                    {},

                                                                    {

                                                                        headers: { Authorization: `Bearer ${token}` }

                                                                    }

                                                                );

                                                                const refresh = await axios.get(

                                                                    "http://localhost:5000/api/user/dashboard",

                                                                    { headers: { Authorization: `Bearer ${token}` } }

                                                                );

                                                                setDashboard(refresh.data);

                                                            }

                                                            catch (e) {

                                                                console.error(e);

                                                                alert(e?.response?.data?.message || "Erreur");

                                                            }

                                                        }}

                                                    >

                                                        {t("accept") || "Accepter"}

                                                    </button>

                                                )}


                                            </div>

                                        ))

                                    ) : (

                                        <div className="empty">Aucune demande.</div>

                                    )}

                                </div>

                                {/* ================= end exchange requests ================= */}

                                <div className="dashboard-left">

                                    <div className="dashboard-box">

                                        <div className="box-title">

                                            <h2>

                                                {t("latest_books")}

                                            </h2>

                                        </div>

                                        {

                                            dashboard.recentBooks.length === 0 ?

                                            (

                                                <div className="empty">

                                                    {t("no_books_available")}

                                                </div>

                                            )

                                            :

                                            (

                                                dashboard.recentBooks.map(book => (

                                                    <div

                                                        key={book.id}

                                                        className="recent-book"

                                                    >

                                                        <img

                                                            src={book.cover}

                                                            alt={book.title}

                                                        />

                                                        <div>

                                                            <h4>

                                                                {book.title}

                                                            </h4>

                                                            <p>

                                                                {book.author}

                                                            </p>

                                                        </div>

                                                    </div>

                                                ))

                                            )

                                        }

                                    </div>

                                </div>

                                <div className="dashboard-right">

                                    <div className="dashboard-box">

                                        <div className="box-title">

                                            <h2>

                                                {t("recent_notifications")}

                                            </h2>

                                        </div>

                                        {

                                            dashboard.notifications.length === 0 ?

                                            (

                                                <div className="empty">

                                                    {t("no_notifications")}

                                                </div>

                                            )

                                            :

                                            (

                                                dashboard.notifications.map(notification => (

                                                    <div

                                                        key={notification.id}

                                                        className="notification"

                                                    >

                                                        <strong>

                                                            {notification.sender?.name || "Utilisateur"}

                                                        </strong>

                                                        <p>

                                                            {notification.message}

                                                        </p>

                                                        {

                                                            notification.image_url && (

                                                                <img

                                                                    src={notification.image_url}

                                                                    alt="message attachment"

                                                                    style={{

                                                                        width: "100%",

                                                                        maxHeight: "180px",

                                                                        objectFit: "cover",

                                                                        borderRadius: "10px",

                                                                        marginTop: "8px"

                                                                    }}

                                                                />

                                                            )

                                                        }

                                                    </div>

                                                ))

                                            )

                                        }

                                    </div>

                                </div>

                            </section>

                        </>

                    )

                }

            </main>

            <UserFooter />

        </>

    );

}