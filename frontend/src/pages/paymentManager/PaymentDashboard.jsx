import "./PaymentDashboard.css";

import {

    useEffect,
    useState

} from "react";

import PaymentManagerLayout from "../../components/paymentManager/PaymentManagerLayout";

import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";

import {

    getPaymentDashboard

} from "../../services/paymentDashboardService";

export default function PaymentDashboard() {

    /*
    ==========================================================
    STATES
    ==========================================================
    */

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState({

        statistics: {

            total_wallets: 0,

            empty_wallets: 0,

            charged_wallets: 0,

            total_wallet_balance: 0,

            total_transactions: 0,

            total_recharge_requests: 0,

            pending_requests: 0,

            approved_requests: 0,

            rejected_requests: 0

        },

        latest_recharge_requests: [],

        latest_transactions: [],

        richest_wallets: []

    });

    /*
    ==========================================================
    LOAD DASHBOARD
    ==========================================================
    */

    async function loadDashboard() {

        setLoading(true);

        try {

            const response = await getPaymentDashboard();

            console.log(

                "[PaymentDashboard]",

                response

            );

            setDashboard(response);

        }

        catch (error) {

            console.error(

                "PAYMENT_DASHBOARD_ERROR:",

                error

            );

        }

        finally {

            setLoading(false);

        }

    }

    /*
    ==========================================================
    FIRST LOAD
    ==========================================================
    */

    useEffect(() => {

        loadDashboard();

    }, []);

    /*
    ==========================================================
    LOADING
    ==========================================================
    */

    if (loading) {

        return (

            <PaymentManagerLayout>

                <LoadingSpinner />

            </PaymentManagerLayout>

        );

    }

    const stats = dashboard.statistics;

    return (

        <PaymentManagerLayout>

            <div className="payment-dashboard">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="payment-dashboard-header">

                    <h2>

                        Payment Dashboard

                    </h2>

                    <p>

                        Tableau de bord général des paiements, wallets et transactions.

                    </p>

                </div>

                {/* Les cartes statistiques commencent dans la partie 2 */}
                                {/* =====================================================
                    STATISTICS
                ===================================================== */}

                <div className="payment-dashboard-cards">

                    <div className="payment-dashboard-card">

                        <h3>

                            Total Wallets

                        </h3>

                        <span>

                            {stats.total_wallets}

                        </span>

                    </div>

                    <div className="payment-dashboard-card">

                        <h3>

                            Wallets vides

                        </h3>

                        <span>

                            {stats.empty_wallets}

                        </span>

                    </div>

                    <div className="payment-dashboard-card">

                        <h3>

                            Wallets chargés

                        </h3>

                        <span>

                            {stats.charged_wallets}

                        </span>

                    </div>

                    <div className="payment-dashboard-card">

                        <h3>

                            Argent total

                        </h3>

                        <span>

                            {stats.total_wallet_balance} DH

                        </span>

                    </div>

                    <div className="payment-dashboard-card">

                        <h3>

                            Transactions

                        </h3>

                        <span>

                            {stats.total_transactions}

                        </span>

                    </div>

                    <div className="payment-dashboard-card">

                        <h3>

                            Recharges

                        </h3>

                        <span>

                            {stats.total_recharge_requests}

                        </span>

                    </div>

                    <div className="payment-dashboard-card pending">

                        <h3>

                            En attente

                        </h3>

                        <span>

                            {stats.pending_requests}

                        </span>

                    </div>

                    <div className="payment-dashboard-card approved">

                        <h3>

                            Validées

                        </h3>

                        <span>

                            {stats.approved_requests}

                        </span>

                    </div>

                    <div className="payment-dashboard-card rejected">

                        <h3>

                            Refusées

                        </h3>

                        <span>

                            {stats.rejected_requests}

                        </span>

                    </div>

                </div>

                {/* =====================================================
                    LATEST RECHARGE REQUESTS
                ===================================================== */}

                <div className="payment-dashboard-section">

                    <h3>

                        Dernières demandes de recharge

                    </h3>

                    <table className="payment-dashboard-table">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Utilisateur</th>

                                <th>Montant</th>

                                <th>Méthode</th>

                                <th>Statut</th>

                                <th>Date</th>

                            </tr>

                        </thead>

                        <tbody>
                                                        {

                                dashboard.latest_recharge_requests.length === 0 && (

                                    <tr>

                                        <td colSpan="6">

                                            Aucune demande trouvée.

                                        </td>

                                    </tr>

                                )

                            }

                            {

                                dashboard.latest_recharge_requests.map((request) => (

                                    <tr

                                        key={request.id}

                                    >

                                        <td>

                                            {request.id}

                                        </td>

                                        <td>

                                            {

                                                request.user.first_name

                                            }{" "}

                                            {

                                                request.user.last_name

                                            }

                                        </td>

                                        <td>

                                            {

                                                request.amount

                                            } DH

                                        </td>

                                        <td>

                                            {

                                                request.payment_method?.name ||

                                                "-"

                                            }

                                        </td>

                                        <td>

                                            <span

                                                className={

                                                    `payment-status ${request.status}`

                                                }

                                            >

                                                {

                                                    request.status

                                                }

                                            </span>

                                        </td>

                                        <td>

                                            {

                                                new Date(

                                                    request.created_at

                                                ).toLocaleDateString()

                                            }

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

                {/* =====================================================
                    LATEST TRANSACTIONS
                ===================================================== */}

                <div className="payment-dashboard-section">

                    <h3>

                        Dernières transactions

                    </h3>

                    <table className="payment-dashboard-table">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Utilisateur</th>

                                <th>Type</th>

                                <th>Montant</th>

                                <th>Date</th>

                            </tr>

                        </thead>

                        <tbody>
                                                        {

                                dashboard.latest_transactions.length === 0 && (

                                    <tr>

                                        <td colSpan="5">

                                            Aucune transaction trouvée.

                                        </td>

                                    </tr>

                                )

                            }

                            {

                                dashboard.latest_transactions.map((transaction) => (

                                    <tr

                                        key={transaction.id}

                                    >

                                        <td>

                                            {transaction.id}

                                        </td>

                                        <td>

                                            {

                                                transaction.user.first_name

                                            }{" "}

                                            {

                                                transaction.user.last_name

                                            }

                                        </td>

                                        <td>

                                            {transaction.transaction_type}

                                        </td>

                                        <td>

                                            {transaction.amount} DH

                                        </td>

                                        <td>

                                            {

                                                new Date(

                                                    transaction.created_at

                                                ).toLocaleDateString()

                                            }

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

                {/* =====================================================
                    RICHEST WALLETS
                ===================================================== */}

                <div className="payment-dashboard-section">

                    <h3>

                        Wallets les plus chargés

                    </h3>

                    <table className="payment-dashboard-table">

                        <thead>

                            <tr>

                                <th>Utilisateur</th>

                                <th>Email</th>

                                <th>Solde</th>

                            </tr>

                        </thead>

                        <tbody>
                                                        {

                                dashboard.richest_wallets.length === 0 && (

                                    <tr>

                                        <td colSpan="3">

                                            Aucun wallet trouvé.

                                        </td>

                                    </tr>

                                )

                            }

                            {

                                dashboard.richest_wallets.map((wallet) => (

                                    <tr

                                        key={wallet.id}

                                    >

                                        <td>

                                            {

                                                wallet.user.first_name

                                            }{" "}

                                            {

                                                wallet.user.last_name

                                            }

                                        </td>

                                        <td>

                                            {

                                                wallet.user.email

                                            }

                                        </td>

                                        <td>

                                            <strong>

                                                {

                                                    wallet.balance

                                                } DH

                                            </strong>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </PaymentManagerLayout>

    );

}