import "./Wallet.css";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

import WalletSteps from "../../components/wallet/WalletSteps";
import PaymentMethodCard from "../../components/wallet/PaymentMethodCard";
import PaymentMethodModal from "../../components/wallet/PaymentMethodModal";
import RechargeRequestForm from "../../components/wallet/RechargeRequestForm";
import RechargeHistory from "../../components/wallet/RechargeHistory";

import {

    getWalletBalance,
    getPaymentMethods,
    getRechargeHistory,
    createRechargeRequest

} from "../../services/walletService";

export default function Wallet() {

    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);

    const [wallet, setWallet] = useState({

        balance: "0.00"

    });

    const [paymentMethods, setPaymentMethods] = useState([]);

    const [history, setHistory] = useState([]);

    const [selectedMethod, setSelectedMethod] = useState(null);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

        loadWallet();

    }, []);

    async function loadWallet() {

        try {

            setLoading(true);

            const [

                walletResponse,
                methodsResponse,
                historyResponse

            ] = await Promise.all([

                getWalletBalance(),
                getPaymentMethods(),
                getRechargeHistory()

            ]);

            console.log("Wallet :", walletResponse);
            console.log("Payment Methods :", methodsResponse);
            console.log("History :", historyResponse);

            /*
            ==========================================
            WALLET
            ==========================================
            */

            if (walletResponse?.wallet) {

                setWallet(walletResponse.wallet);

            }

            else if (walletResponse?.balance !== undefined) {

                setWallet({

                    balance: walletResponse.balance

                });

            }

            /*
            ==========================================
            PAYMENT METHODS
            ==========================================
            */

            if (Array.isArray(methodsResponse)) {

                setPaymentMethods(methodsResponse);

            }

            else if (Array.isArray(methodsResponse?.methods)) {

                setPaymentMethods(methodsResponse.methods);

            }

            else {

                setPaymentMethods([]);

            }

            /*
            ==========================================
            HISTORY
            ==========================================
            */

            if (Array.isArray(historyResponse)) {

                setHistory(historyResponse);

            }

            else if (Array.isArray(historyResponse?.history)) {

                setHistory(historyResponse.history);

            }

            else {

                setHistory([]);

            }

        }

        catch (error) {

            console.error("Wallet Error :", error);

        }

        finally {

            setLoading(false);

        }

    }

    async function handleRechargeSubmit({

        amount,
        proof

    }) {

        try {

            await createRechargeRequest({

                amount,
                proof

            });

            alert(

                t("request_sent_successfully")

            );

            await loadWallet();

        }

        catch (error) {

            console.error(error);

            alert(

                t("something_went_wrong")

            );

        }

    }

    function openMethod(method) {

        setSelectedMethod(method);

        setShowModal(true);

    }

    function closeMethod() {

        setSelectedMethod(null);

        setShowModal(false);

    }

    return (

        <>

            <UserHeader />

            <div className="wallet-page">

                <div className="wallet-container">

                    <div className="wallet-header">

                        <h1>

                            {t("wallet")}

                        </h1>

                        <p>

                            {t("wallet_description")}

                        </p>

                    </div>

                    <div className="wallet-balance-card">

                        <span>

                            {t("current_balance")}

                        </span>

                        <h2>

                            {wallet.balance} DH

                        </h2>

                    </div>

                    <WalletSteps />

                    <section className="wallet-section">

                        <div className="section-title">

                            <h2>

                                {t("payment_methods")}

                            </h2>

                            <p>

                                {t("choose_payment_method")}

                            </p>

                        </div>

                        <div className="payment-grid">

                            {

                                paymentMethods.map((method) => (

                                    <PaymentMethodCard

                                        key={method.id}

                                        method={method}

                                        onView={openMethod}

                                    />

                                ))

                            }

                        </div>

                    </section>

                    <section className="wallet-section">

                        <RechargeRequestForm

                            onSubmit={handleRechargeSubmit}

                        />

                    </section>

                    <section className="wallet-section">

                        <RechargeHistory

                            requests={history}

                        />

                    </section>

                </div>

            </div>

            {

                showModal && (

                    <PaymentMethodModal

                        method={selectedMethod}

                        onClose={closeMethod}

                    />

                )

            }

            <UserFooter />

        </>

    );

}