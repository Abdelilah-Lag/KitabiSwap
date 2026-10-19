import "./BuyBook.css";

import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

export default function BuyBook() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const { type, id } = useParams();

    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(true);

    const [book, setBook] = useState(null);

    const [wallet, setWallet] = useState(null);

    const [address, setAddress] = useState(null);

    const [delivery, setDelivery] = useState(null);

    const [summary, setSummary] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const [paymentMethod, setPaymentMethod] = useState("wallet");

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {

        loadPage();

    }, [type, id]);

    async function loadPage() {

        try {

            setLoading(true);

            const res = await axios.get(

                `http://localhost:5000/api/magazine-user/buy/${type}/${id}`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            console.log(res.data);

            setBook(res.data.book);

            setWallet(res.data.wallet);

            setAddress(res.data.address);

            setDelivery(res.data.delivery);

            setSummary(res.data.summary);

        }

        catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Impossible de charger cette page."

            );

            navigate("/user/magazine");

        }

        finally {

            setLoading(false);

        }

    }
        /* ==========================================
       Mise à jour quantité
    ========================================== */

    useEffect(() => {

        if (!book || !delivery) return;

        const bookPrice = Number(book.price) * quantity;

        const deliveryPrice = Number(delivery.price);

        setSummary({

            book_price: bookPrice,

            delivery_price: deliveryPrice,

            total: bookPrice + deliveryPrice

        });

    }, [quantity, book, delivery]);

    /* ==========================================
       Modifier quantité
    ========================================== */

    function increaseQuantity() {

        if (book?.type === "shop") {

            if (quantity < book.stock) {

                setQuantity(quantity + 1);

            }

        }

    }

    function decreaseQuantity() {

        if (quantity > 1) {

            setQuantity(quantity - 1);

        }

    }

    /* ==========================================
       Confirmation commande
    ========================================== */

    async function confirmOrder() {

        try {

            setSubmitting(true);

            const body = {

                id: Number(id),

                type,

                quantity,

                payment_method: paymentMethod

            };

            const res = await axios.post(

                "http://localhost:5000/api/magazine-user/order",

                body,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            alert(

                res.data.message ||

                t("order_created")

            );

            navigate("/user/magazine", {
    state: {
        success: "Votre commande a été enregistrée avec succès."
    }
});
        }

        catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                t("something_went_wrong")

            );

        }

        finally {

            setSubmitting(false);

        }

    }

    /* ==========================================
       Loading
    ========================================== */

    if (loading) {

        return (

            <>

                <UserHeader />

                <div className="buy-loading">

                    {t("loading")}

                </div>

                <UserFooter />

            </>

        );

    }
        return (

        <>

            <UserHeader />

            <div className="buy-book-page">

                <div className="buy-book-container">

                    <h1>

                        {t("buy_book")}

                    </h1>

                    {/* ===============================
                        Livre sélectionné
                    =============================== */}

                    <div className="buy-card">

                        <h2>

                            📚 {t("selected_book")}

                        </h2>

                        <div className="selected-book">

                            <img

                                src={
                                    book?.cover ||
                                    "/images/book-placeholder.png"
                                }

                                alt={book?.title}

                            />

                            <div className="selected-book-info">

                                <h3>

                                    {book?.title}

                                </h3>

                                <p>

                                    {book?.author}

                                </p>

                                {

                                    book?.publisher &&

                                    <p>

                                        {book.publisher}

                                    </p>

                                }

                                {

                                    book?.condition &&

                                    <span className="condition">

                                        {book.condition}

                                    </span>

                                }

                                <div className="price">

                                    {Number(book?.price).toFixed(2)} DH

                                </div>

                                {

                                    book?.type === "shop"

                                    &&

                                    <p>

                                        📦 {t("stock")} : {book.stock}

                                    </p>

                                }

                            </div>

                        </div>

                    </div>

                    {/* ===============================
                        Adresse
                    =============================== */}

                    <div className="buy-card">

                        <h2>

                             {t("delivery_address")}

                        </h2>

                        {

                            address ?

                            <>

                                <p>

                                    <strong>

                                        {address.recipient_name}

                                    </strong>

                                </p>

                                <p>

                                    {address.phone}

                                </p>

                                <p>

                                    {address.street}

                                </p>

                                <p>

                                    {address.district}

                                </p>

                                <p>

                                    {address.city}

                                    {" - "}

                                    {address.region}

                                </p>

                                {

                                    address.postal_code &&

                                    <p>

                                        {address.postal_code}

                                    </p>

                                }

                            </>

                            :

                            <p>

                                {t("no_default_address")}

                            </p>

                        }

                    </div>

                    {/* ===============================
                        Livraison
                    =============================== */}

                    <div className="buy-card">

                        <h2>

                            🚚 {t("delivery")}

                        </h2>

                        <div className="delivery-row">

                            <span>

                                {t("distance")}

                            </span>

                            <strong>

                                {Number(delivery?.distance || 0).toFixed(2)} km

                            </strong>

                        </div>

                        <div className="delivery-row">

                            <span>

                                {t("delivery_price")}

                            </span>

                            <strong>

                                {Number(delivery?.price || 0).toFixed(2)} DH

                            </strong>

                        </div>

                    </div>
                                        {/* ===============================
                        Paiement
                    =============================== */}

                    <div className="buy-card">

                        <h2>

                            💳 {t("payment_method")}

                        </h2>

                        <label className="payment-option">

                            <input

                                type="radio"

                                value="wallet"

                                checked={paymentMethod === "wallet"}

                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }

                            />

                            {t("wallet")}

                            {

                                wallet &&

                                <span className="wallet-balance">

                                    {" "}
                                    ({Number(wallet.balance).toFixed(2)} DH)

                                </span>

                            }

                        </label>

                        <label className="payment-option">

                            <input

                                type="radio"

                                value="cash_on_delivery"

                                checked={paymentMethod === "cash_on_delivery"}

                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }

                            />

                            {t("cash_on_delivery")}

                        </label>

                    </div>

                    {/* ===============================
                        Quantité
                    =============================== */}

                    {

                        book?.type === "shop" &&

                        <div className="buy-card">

                            <h2>

                                {t("quantity")}

                            </h2>

                            <div className="quantity-selector">

                                <button

                                    onClick={decreaseQuantity}

                                    disabled={quantity <= 1}

                                >

                                    -

                                </button>

                                <span>

                                    {quantity}

                                </span>

                                <button

                                    onClick={increaseQuantity}

                                    disabled={quantity >= book.stock}

                                >

                                    +

                                </button>

                            </div>

                        </div>

                    }

                    {/* ===============================
                        Résumé
                    =============================== */}

                    <div className="buy-card">

                        <h2>

                            🧾 {t("order_summary")}

                        </h2>

                        <div className="summary-row">

                            <span>

                                {t("book_price")}

                            </span>

                            <strong>

                                {Number(summary?.book_price || 0).toFixed(2)} DH

                            </strong>

                        </div>

                        <div className="summary-row">

                            <span>

                                {t("delivery_price")}

                            </span>

                            <strong>

                                {Number(summary?.delivery_price || 0).toFixed(2)} DH

                            </strong>

                        </div>

                        <div className="summary-row total">

                            <span>

                                {t("total")}

                            </span>

                            <strong>

                                {Number(summary?.total || 0).toFixed(2)} DH

                            </strong>

                        </div>

                        <button

                            className="confirm-order-btn"

                            onClick={confirmOrder}

                            disabled={

                                submitting ||

                                !address ||

                                !book

                            }

                        >

                            {

                                submitting

                                ?

                                t("processing")

                                :

                                t("confirm_order")

                            }

                        </button>

                    </div>

                </div>

            </div>

            <UserFooter />

        </>

    );

}