import "./ExchangeDeliveryChat.css";

import axios from "axios";

import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    useTranslation
} from "react-i18next";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

export default function ExchangeDeliveryChat() {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { exchangeRequestId } = useParams();
    const bottomRef = useRef(null);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [exchange, setExchange] = useState(null);
    const [requesterAddress, setRequesterAddress] = useState(null);
    const [receiverAddress, setReceiverAddress] = useState(null);
    const [deliveryInfo, setDeliveryInfo] = useState(null);
    const [paymentMethodChoice, setPaymentMethodChoice] = useState(null);
    const [sendingPayment, setSendingPayment] = useState(false);
    const [paymentLocked, setPaymentLocked] = useState(false);

    async function confirmPayment() {
        if (!paymentMethodChoice) {
            alert(t("choose_payment_method"));
            return;
        }
        try {
            setSendingPayment(true);
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:5000/api/exchange-chat/${exchangeRequestId}/payment`,
                {
                    payment_method: paymentMethodChoice
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await loadChat();
            setPaymentLocked(true);
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || t("unexpected_error"));
        } finally {
            setSendingPayment(false);
        }
    }

    useEffect(() => {
        loadUser();
        loadChat();

        const interval = setInterval(() => {
            loadChat();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    async function loadUser() {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "http://localhost:5000/api/user",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setUser(res.data.user);
        } catch (error) {
            console.error(error);
        }
    }

    async function loadChat() {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `http://localhost:5000/api/exchange-chat/${exchangeRequestId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessages(res.data.messages);
            setExchange(res.data.exchange);
            setRequesterAddress(res.data.requesterAddress);
            setReceiverAddress(res.data.receiverAddress);
            setDeliveryInfo(res.data.delivery);

            const alreadySelected = !!res.data?.delivery?.current_user_payment_method;
            setPaymentLocked(alreadySelected);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    /* ==========================================
       Envoyer un message
    ========================================== */
    async function sendMessage() {
        if (!message.trim()) return;

        try {
            setSending(true);
            const token = localStorage.getItem("token");

            await axios.post(
                `http://localhost:5000/api/exchange-chat/${exchangeRequestId}/message`,
                {
                    message
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("");
            await loadChat();
        } catch (error) {
            console.error(error);
            alert(
                error?.response?.data?.message ||
                t("unexpected_error")
            );
        } finally {
            setSending(false);
        }
    }

    /* ==========================================
       Choisir la livraison
    ========================================== */
    async function chooseDeliveryMethod(method) {
        const confirmation = window.confirm(
            method === "kitabiswap_delivery"
                ? t("confirm_kitabiswap_delivery")
                : t("confirm_self_delivery")
        );

        if (!confirmation) return;

        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:5000/api/exchange-chat/${exchangeRequestId}/delivery`,
                {
                    delivery_method: method
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await loadChat();
            alert(t("delivery_method_saved"));
        } catch (error) {
            console.error(error);
            alert(
                error?.response?.data?.message ||
                t("unexpected_error")
            );
        }
    }

    if (loading) {
        return (
            <>
                <UserHeader user={user} />
                <div className="exchange-chat-loading">
                    {t("loading")}
                </div>
                <UserFooter />
            </>
        );
    }

    const chatClosed = !!exchange?.delivery_method;

    return (
        <>
            <UserHeader user={user} />

            <section className="exchange-chat-page">
                <div className="exchange-chat-container">
                    <div className="exchange-chat-header">
                        <h2>{t("delivery_chat")}</h2>
                        <p>{t("communicate_delivery_decision")}</p>
                    </div>

                    {!chatClosed && (
                        <div className="delivery-buttons">
                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    chooseDeliveryMethod("admin_delivery")
                                }
                            >
                                🚚 {t("kitabiswap_delivery")}
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={() =>
                                    chooseDeliveryMethod("self_delivery")
                                }
                            >
                                🤝 {t("self_delivery")}
                            </button>
                        </div>
                    )}

                    {chatClosed && (
                        <div className="chat-closed-box">
                            ✅ {exchange?.delivery_method === "admin_delivery"
                                ? t("kitabiswap_delivery")
                                : t("self_delivery")}
                        </div>
                    )}

                    {(requesterAddress || receiverAddress) && (
                        <div className="delivery-address-card">
                            <div className="address-box">
                                <h3>{t("sender_address")}</h3>
                                {requesterAddress && (
                                    <>
                                        <p>{requesterAddress.recipient_name}</p>
                                        <p>{requesterAddress.phone}</p>
                                        <p>{requesterAddress.street}</p>
                                        <p>
                                            {requesterAddress.district} {requesterAddress.city}
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="delivery-arrow">➜</div>

                            <div className="address-box">
                                <h3>{t("receiver_address")}</h3>
                                {receiverAddress && (
                                    <>
                                        <p>{receiverAddress.recipient_name}</p>
                                        <p>{receiverAddress.phone}</p>
                                        <p>{receiverAddress.street}</p>
                                        <p>
                                            {receiverAddress.district} {receiverAddress.city}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {exchange?.delivery_method === "admin_delivery" &&
                        deliveryInfo &&
                        deliveryInfo.total_price !== null && (
                            <div className="delivery-price-card">
                                <h3>{t("delivery_price")}</h3>
                                <p>
                                    {t("distance")} : <strong>{deliveryInfo.distance} km</strong>
                                </p>
                                <p>
                                    {t("total_delivery_price")} : <strong>{deliveryInfo.total_price} DH</strong>
                                </p>
                                <p>
                                    {t("each_user_pays")} :
                                    <strong>
                                        {deliveryInfo.requester_share} DH
                                    </strong>
                                </p>
                            </div>
                        )}

                    {chatClosed &&
                        exchange?.delivery_method === "admin_delivery" &&
                        deliveryInfo &&
                        deliveryInfo.current_user_share != null && (
                            <div className="delivery-payment-card">
                                <h3>💳 {t("payment")}</h3>
                                <p className="payment-your-part">
                                    {t("your_share")} : <strong>{deliveryInfo.current_user_share} DH</strong>
                                </p>

                                <div className="payment-method-section">
                                    <p className="payment-method-title">{t("payment_method")}</p>
                                    <div className="payment-method-options">
                                        <label className={`payment-option ${paymentLocked ? "is-disabled" : ""}`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                disabled={paymentLocked || sendingPayment}
                                                checked={
                                                    (paymentMethodChoice ?? deliveryInfo.current_user_payment_method) === "wallet"
                                                }
                                                onChange={() => setPaymentMethodChoice("wallet")}
                                            />
                                            <span>{t("payment_wallet")}</span>
                                        </label>

                                        <label className={`payment-option ${paymentLocked ? "is-disabled" : ""}`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                disabled={paymentLocked || sendingPayment}
                                                checked={
                                                    (paymentMethodChoice ?? deliveryInfo.current_user_payment_method) === "cash_on_delivery"
                                                }
                                                onChange={() => setPaymentMethodChoice("cash_on_delivery")}
                                            />
                                            <span>{t("payment_cash_on_delivery")}</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="payment-status">
                                    <p className="payment-status-title">{t("status")}</p>
                                    <p className="payment-status-value">
                                        {deliveryInfo.current_user_paid === "oui"
                                            ? t("already_paid")
                                            : t("pay_on_delivery")}
                                    </p>
                                </div>

                                <button
                                    className="btn btn-primary"
                                    disabled={sendingPayment || paymentLocked}
                                    onClick={confirmPayment}
                                >
                                    {sendingPayment ? t("sending") : t("confirm")}
                                </button>
                            </div>
                        )}

                    <div className="exchange-chat-messages">
                        {messages.map(msg => (
                            <div
                                key={msg?.id}
                                className={
                                    msg.sender_id === user?.id
                                        ? "chat-message mine"
                                        : "chat-message other"
                                }
                            >
                                <div className="chat-avatar">
                                    <img
                                        src={
                                            msg.sender?.avatar_url ||
                                            "/images/default-avatar.png"
                                        }
                                        alt="avatar"
                                    />
                                </div>

                                <div className="chat-content">
                                    <div className="chat-user">
                                        {msg.sender?.first_name}{" "}
                                        {msg.sender?.last_name}
                                    </div>

                                    {msg.message && (
                                        <div className="chat-text">
                                            {msg.message}
                                        </div>
                                    )}

                                    {msg.attachment_url && (
                                        <img
                                            src={msg.attachment_url}
                                            alt="chat"
                                            className="chat-image"
                                        />
                                    )}

                                    <div className="chat-date">
                                        {new Date(msg.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef}></div>
                    </div>

                    {!chatClosed && (
                        <div className="exchange-chat-input">
                            <textarea
                                placeholder={t("write_message")}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />

                            <div className="chat-actions">
                                <button
                                    className="btn btn-primary"
                                    disabled={sending || message.trim() === ""}
                                    onClick={sendMessage}
                                >
                                    {sending ? t("sending") : t("send")}
                                </button>
                            </div>
                        </div>
                    )}

                    {chatClosed && (
                        <div className="chat-closed-footer">
                            <p>{t("chat_closed_after_delivery_choice")}</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate("/user")}
                            >
                                {t("back_dashboard")}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <UserFooter />
        </>
    );
}