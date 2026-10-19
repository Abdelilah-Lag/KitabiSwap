import "./Magazine.css";

import axios from "axios";

import {

    useEffect,
    useMemo,
    useState

} from "react";

import {

    useNavigate

} from "react-router-dom";

import {

    useTranslation

} from "react-i18next";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

import MagazineBookCard from "../../components/magazine/MagazineBookCard";

export default function Magazine() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    /* ==========================================
       States
    ========================================== */

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [books, setBooks] = useState([]);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [bookType, setBookType] = useState("");

    const [condition, setCondition] = useState("");

    const [priceMin, setPriceMin] = useState("");

    const [priceMax, setPriceMax] = useState("");

    const [sortBy, setSortBy] = useState("newest");

    /* ==========================================
       Chargement initial
    ========================================== */

    useEffect(() => {

        loadUser();

        loadBooks();

    }, []);

    /* ==========================================
       Charger utilisateur
    ========================================== */

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

            setUser(res.data.user);

        }

        catch (error) {

            console.error(error);

        }

    }

    /* ==========================================
       Charger les livres
    ========================================== */

    async function loadBooks() {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(

                "http://localhost:5000/api/magazine-user/books",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setBooks([...(res.data.shopBooks || []), ...(res.data.userBooks || [])]);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    /* ==========================================
       Filtrage
    ========================================== */

    const filteredBooks = useMemo(() => {

        let data = [...books];

        /* ==========================
           Recherche
        ========================== */

        if (search.trim() !== "") {

            const keyword = search.toLowerCase();

            data = data.filter(book =>

                book.title?.toLowerCase().includes(keyword)

                ||

                book.author?.toLowerCase().includes(keyword)

                ||

                book.publisher?.toLowerCase().includes(keyword)

            );

        }

        /* ==========================
           Catégorie
        ========================== */

        if (category !== "") {

            data = data.filter(

                book =>

                    book.category === category

            );

        }

        /* ==========================
           Type
        ========================== */

        if (bookType !== "") {

            data = data.filter(

                book =>

                    book.type === bookType

            );

        }

        /* ==========================
           Etat
        ========================== */

        if (condition !== "") {

            data = data.filter(

                book =>

                    book.book_condition === condition

            );

        }

        /* ==========================
           Prix minimum
        ========================== */

        if (priceMin !== "") {

            data = data.filter(

                book =>

                    Number(book.price) >= Number(priceMin)

            );

        }

        /* ==========================
           Prix maximum
        ========================== */

        if (priceMax !== "") {

            data = data.filter(

                book =>

                    Number(book.price) <= Number(priceMax)

            );

        }
                /* ==========================
           Tri
        ========================== */

        switch (sortBy) {

            case "price_asc":

                data.sort(

                    (a, b) => Number(a.price) - Number(b.price)

                );

                break;

            case "price_desc":

                data.sort(

                    (a, b) => Number(b.price) - Number(a.price)

                );

                break;

            case "title_asc":

                data.sort(

                    (a, b) =>

                        a.title.localeCompare(b.title)

                );

                break;

            case "title_desc":

                data.sort(

                    (a, b) =>

                        b.title.localeCompare(a.title)

                );

                break;

            case "oldest":

                data.sort(

                    (a, b) =>

                        new Date(a.created_at)

                        -

                        new Date(b.created_at)

                );

                break;

            default:

                data.sort(

                    (a, b) =>

                        new Date(b.created_at)

                        -

                        new Date(a.created_at)

                );

        }

        return data;

    }, [

        books,

        search,

        category,

        bookType,

        condition,

        priceMin,

        priceMax,

        sortBy

    ]);

    /* ==========================================
       Chargement
    ========================================== */

    if (loading) {

        return (

            <>

                <UserHeader user={user} />

                <div className="magazine-loading">

                    {t("loading")}

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

            <UserHeader user={user} />

            <section className="magazine-page">

                <div className="magazine-container">

                    <div className="magazine-header">

                    <div className="magazine-header-top">

                            <div>

                                <h1>
                                    {t("magazine")}
                                </h1>

                                <p>
                                    {t("discover_books_from_store_and_users")}
                                </p>

                            </div>

                            <button
                                className="create-order-btn"
                                onClick={() => navigate("/user/commande")}
                            >
                                {t("create_order")}
                            </button>

                        </div>

                    </div>

                    {/* ==============================
                        Barre de recherche
                    ============================== */}

                    <div className="magazine-search">

                        <input

                            type="text"

                            placeholder={

                                t("search_book")

                            }

                            value={search}

                            onChange={(e)=>

                                setSearch(

                                    e.target.value

                                )

                            }

                        />

                    </div>

                    {/* ==============================
                        Filtres
                    ============================== */}

                    <div className="magazine-filters">

                        <select

                            value={category}

                            onChange={(e)=>

                                setCategory(

                                    e.target.value

                                )

                            }

                        >

                            <option value="">

                                {t("all_categories")}

                            </option>

                            <option value="Roman">

                                Roman

                            </option>

                            <option value="Science">

                                Science

                            </option>

                            <option value="Informatique">

                                Informatique

                            </option>

                            <option value="Business">

                                Business

                            </option>

                            <option value="Développement Personnel">

                                Développement Personnel

                            </option>

                        </select>

                        <select

                            value={bookType}

                            onChange={(e)=>

                                setBookType(

                                    e.target.value

                                )

                            }

                        >

                            <option value="">

                                {t("all_books")}

                            </option>

                            <option value="shop">

                                {t("store_books")}

                            </option>

                            <option value="user">

                                {t("user_books")}

                            </option>

                        </select>

                        <select

                            value={condition}

                            onChange={(e)=>

                                setCondition(

                                    e.target.value

                                )

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
                                                <input

                            type="number"

                            placeholder={

                                t("min_price")

                            }

                            value={priceMin}

                            onChange={(e)=>

                                setPriceMin(

                                    e.target.value

                                )

                            }

                        />

                        <input

                            type="number"

                            placeholder={

                                t("max_price")

                            }

                            value={priceMax}

                            onChange={(e)=>

                                setPriceMax(

                                    e.target.value

                                )

                            }

                        />

                        <select

                            value={sortBy}

                            onChange={(e)=>

                                setSortBy(

                                    e.target.value

                                )

                            }

                        >

                            <option value="newest">

                                {t("newest")}

                            </option>

                            <option value="oldest">

                                {t("oldest")}

                            </option>

                            <option value="price_asc">

                                {t("price_low_high")}

                            </option>

                            <option value="price_desc">

                                {t("price_high_low")}

                            </option>

                            <option value="title_asc">

                                {t("title_a_z")}

                            </option>

                            <option value="title_desc">

                                {t("title_z_a")}

                            </option>

                        </select>

                    </div>

                    {/* ==============================
                        Résultat
                    ============================== */}

                    <div className="magazine-result">

                        <span>

                            {filteredBooks.length} {t("books_found")}

                        </span>

                    </div>

                    {/* ==============================
                        Liste des livres
                    ============================== */}

                    {

                        filteredBooks.length === 0 ?

                        (

                            <div className="magazine-empty">

                                <h3>

                                    {t("no_books_found")}

                                </h3>

                                <p>

                                    {t("try_other_filters")}

                                </p>

                            </div>

                        )

                        :

                        (

                            <div className="magazine-grid">

                                {

                                    filteredBooks.map(book => (

                                        <MagazineBookCard

                                            key={`${book.type}-${book.id}`}

                                            book={book}

                                            onDetails={() =>

                                                navigate(

                                                    `/user/magazine/book/${book.type}/${book.id}`

                                                )

                                            }

                                            onBuy={() =>

                                                navigate(

                                                    `/user/magazine/checkout/${book.type}/${book.id}`

                                                )

                                            }

                                        />

                                    ))

                                }

                            </div>

                        )

                    }

                </div>

            </section>

            <UserFooter />

        </>

    );

}