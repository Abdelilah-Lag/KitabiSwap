import "./BookDetails.css";

import axios from "axios";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    useTranslation
} from "react-i18next";

import UserHeader from "../user/UserHeader";
import UserFooter from "../user/UserFooter";

export default function BookDetails() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const { type, id } = useParams();
    // type = shop | user

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [book, setBook] = useState(null);

    const [images, setImages] = useState([]);

    const [selectedImage, setSelectedImage] = useState("");

    const [favorite, setFavorite] = useState(false);

    useEffect(() => {

        loadUser();

        loadBook();

    }, [id]);

    /* ==========================================
       Charger utilisateur connecté
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
       Charger livre
    ========================================== */

    async function loadBook() {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.get(

                `http://localhost:5000/api/magazine-user/book/${type}/${id}`,

                {
                    headers: {
                         Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }

            );

            setBook(res.data.book);

            setImages(res.data.images || []);

            if (res.data.images?.length > 0) {

                setSelectedImage(

                    res.data.images[0].image_url

                );

            }

            setFavorite(

                res.data.favorite

            );

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

            {/* ==========================================
                    Informations du livre
                ========================================== */}

            <div className="book-details-information">


                    <div className="book-main-info">

                        <h1>
                            {book.title}
                        </h1>

                        {
                            book.subtitle && (
                                <h3>
                                    {book.subtitle}
                                </h3>
                            )
                        }

                        <div className="book-author">
                            {t("author")} :
                            <strong> {book.author}</strong>
                        </div>

                        <div className="book-publisher">
                            {t("publisher")} :
                            <strong> {book.publisher}</strong>
                        </div>

                        <div className="book-year">
                            {t("publication_year")} :
                            <strong> {book.publication_year}</strong>
                        </div>

                        <div className="book-language">
                            {t("language")} :
                            <strong> {book.language}</strong>
                        </div>

                        <div className="book-category">
                            {t("category")} :
                            <strong> {book.category}</strong>
                        </div>

                        <div className="book-isbn">
                            ISBN :
                            <strong> {book.isbn}</strong>
                        </div>

                    </div>


                    {/* ===========================
                        Prix
                    ============================ */}

                    <div className="book-price-card">

                        {
                            book.shop_inventory ? (

                                <>

                                    <div className="price">

                                        {book.shop_inventory.selling_price} DH

                                    </div>

                                    {

                                        book.shop_inventory.old_price && (

                                            <div className="old-price">

                                                {book.shop_inventory.old_price} DH

                                            </div>

                                        )

                                    }

                                    <div className="stock">

                                        {t("stock")} :

                                        <strong>

                                            {book.shop_inventory.stock_quantity}

                                        </strong>

                                    </div>

                                </>

                            ) : (

                                <>

                                    <div className="price">

                                        {book.user_books_to_sell.price} DH

                                    </div>

                                    <div className="condition">

                                        {t("condition")} :

                                        <strong>

                                            {book.user_books_to_sell.book_condition}

                                        </strong>

                                    </div>

                                    <div className="seller">

                                        {t("proposed_by")} :

                                        <strong>

                                            {book.user_books_to_sell.user.first_name}

                                            {" "}

                                            {book.user_books_to_sell.user.last_name}

                                        </strong>

                                    </div>

                                </>

                            )

                        }

                        <button

                            className="buy-button"

                            onClick={goToOrder}

                        >

                            🛒 {t("buy_book")}

                        </button>

                    </div>

                </div>


                {/* ==========================================
                    Description
                ========================================== */}

                <div className="book-description-card">

                    <h2>

                        {t("description")}

                    </h2>

                    <p>

                        {

                            book.description ||

                            t("no_description")

                        }

                    </p>

                </div>
                {/* ==========================================
    ADRESSE DE LIVRAISON
========================================== */}

<div className="book-details-card">

    <h3>{t("delivery_address")}</h3>

    {
        address ? (

            <div className="delivery-address">

                <p>
                    <strong>{address.recipient_name}</strong>
                </p>

                <p>{address.phone}</p>

                <p>
                    {address.street} {address.building}
                </p>

                <p>
                    {address.district}
                </p>

                <p>
                    {address.city}
                </p>

                <p>
                    {address.region}
                </p>

                <p>
                    {address.country}
                </p>

            </div>

        ) : (

            <div className="no-address">

                {t("no_default_address")}

            </div>

        )
    }

</div>

{/* ==========================================
    LIVRAISON
========================================== */}

<div className="book-details-card">

    <h3>{t("delivery_information")}</h3>

    <div className="delivery-price-card">

        <div className="delivery-row">

            <span>{t("distance")}</span>

            <strong>

                {delivery.distance_km} km

            </strong>

        </div>

        <div className="delivery-row">

            <span>{t("delivery_price")}</span>

            <strong>

                {delivery.price} DH

            </strong>

        </div>

    </div>

</div>

{/* ==========================================
    PAIEMENT
========================================== */}

<div className="book-details-card">

    <h3>

        {t("payment")}

    </h3>

    <div className="payment-methods">

        <label>

            <input

                type="radio"

                value="wallet"

                checked={paymentMethod === "wallet"}

                onChange={(e)=>

                    setPaymentMethod(

                        e.target.value

                    )

                }

            />

            💳 {t("wallet")}

        </label>

        <label>

            <input

                type="radio"

                value="cash_on_delivery"

                checked={

                    paymentMethod ===

                    "cash_on_delivery"

                }

                onChange={(e)=>

                    setPaymentMethod(

                        e.target.value

                    )

                }

            />

            💵 {t("cash_on_delivery")}

        </label>

    </div>

</div>

{/* ==========================================
    TOTAL
========================================== */}

<div className="book-details-card order-summary">

    <div className="summary-row">

        <span>

            {t("book_price")}

        </span>

        <strong>

            {book.price} DH

        </strong>

    </div>

    <div className="summary-row">

        <span>

            {t("delivery_price")}

        </span>

        <strong>

            {delivery.price} DH

        </strong>

    </div>

    <div className="summary-row total">

        <span>

            {t("total")}

        </span>

        <strong>

            {Number(book.price) +

                Number(delivery.price)} DH

        </strong>

    </div>

    <button

        className="buy-button"

        disabled={ordering}

        onClick={createOrder}

    >

        {

            ordering

                ? t("loading")

                : t("confirm_order")

        }

    </button>

    </div>


<UserFooter />


</>

);

}