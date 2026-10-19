import "./MyBooks.css";

import axios from "axios";

import {

    useEffect,
    useState

} from "react";

import {

    useTranslation

} from "react-i18next";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

import MyBooksTabs from "../../components/MyBook/MyBooksTabs";
import SubmissionBookCard from "../../components/MyBook/SubmissionBookCard";
import UserBookCard from "../../components/MyBook/UserBookCard";
import EmptyBooks from "../../components/MyBook/EmptyBooks";

export default function MyBooks() {

    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState("submissions");

    const [submissions, setSubmissions] = useState([]);

    const [exchangeBooks, setExchangeBooks] = useState([]);

    const [saleBooks, setSaleBooks] = useState([]);

    /* ==========================================
       Charger les livres
    ========================================== */

    useEffect(() => {

        loadBooks();

    }, []);

    async function loadBooks() {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(

                "http://localhost:5000/api/my-books",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setSubmissions(

                response.data.submissions || []

            );

            setExchangeBooks(

                response.data.library || []

            );

            setSaleBooks(

                response.data.selling || []

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
       Loading
    ========================================== */

    if (loading) {

        return (

            <>

                <UserHeader />

                <div className="my-books-loading">

                    {t("loading")}...

                </div>

                <UserFooter />

            </>

        );

    }

    /* ==========================================
       Render
    ========================================== */

    return (

        <>

            <UserHeader />

            <main className="my-books-page">

                <div className="my-books-container">

                    {/* ==========================
                        HERO
                    ========================== */}

                    <div className="my-books-hero">

                        <div>

                            <h1>

                                {t("my_books")}

                            </h1>

                            <p>

                                {t("manage_your_books_description")}

                            </p>

                        </div>

                    </div>

                    {/* ==========================
                        Tabs
                    ========================== */}

                    <MyBooksTabs

                        activeTab={activeTab}

                        setActiveTab={setActiveTab}

                        submissionsCount={submissions.length}

                        exchangeCount={exchangeBooks.length}

                        saleCount={saleBooks.length}

                    />

                    {/* ==========================
                        CONTENT
                    ========================== */}

                    <div className="my-books-grid">

                        {

                            activeTab === "submissions" &&

                            (

                                submissions.length === 0

                                    ?

                                    <EmptyBooks

                                        title={t("no_book_submission")}

                                    />

                                    :

                                    submissions.map(book => (

                                        <SubmissionBookCard

                                            key={book.id}

                                            book={book}

                                        />

                                    ))

                            )

                        }

                        {

                            activeTab === "exchange" &&

                            (

                                exchangeBooks.length === 0

                                    ?

                                    <EmptyBooks

                                        title={t("no_exchange_books")}

                                    />

                                    :

                                    exchangeBooks.map(book => (

                                        <UserBookCard

                                            key={book.id}

                                            book={book}

                                            type="exchange"

                                        />

                                    ))

                            )

                        }

                        {

                            activeTab === "sale" &&

                            (

                                saleBooks.length === 0

                                    ?

                                    <EmptyBooks

                                        title={t("no_sale_books")}

                                    />

                                    :

                                    saleBooks.map(book => (

                                        <UserBookCard

                                            key={book.id}

                                            book={book}

                                            type="sale"

                                        />

                                    ))

                            )

                        }

                    </div>

                </div>

            </main>

            <UserFooter />

        </>

    );

}