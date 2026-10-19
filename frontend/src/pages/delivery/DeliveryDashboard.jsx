import {

    useEffect,
    useState

} from "react";

import "./DeliveryDashboard.css";

import DeliveryHeader
    from "../../components/delivery/DeliveryHeader";

import DeliverySidebar
    from "../../components/delivery/DeliverySidebar";

import DeliveryFooter
    from "../../components/delivery/DeliveryFooter";

import {

    getDeliveryDashboard

} from "../../services/deliveryDashboardService";

export default function DeliveryDashboard() {

    const [

        dashboard,

        setDashboard

    ] = useState({

        statistics: {

            wallet_balance: 0,

            total_deliveries: 0,

            magazine_deliveries: 0,

            user_deliveries: 0,

            exchange_deliveries: 0

        },

        latest_deliveries: []

    });

    const [

        loading,

        setLoading

    ] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        try {

            const data =
                await getDeliveryDashboard();

            setDashboard(data);

        }

        catch (error) {

            console.error(

                "Erreur dashboard :",

                error

            );

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <div className="delivery-dashboard-loading">

                Chargement...

            </div>

        );

    }

    const stats =
        dashboard.statistics;

    return (

        <div className="delivery-dashboard">

            <DeliveryHeader />

            <div className="delivery-dashboard-container">

                <DeliverySidebar />

                <main className="delivery-dashboard-content">

                    <h1>

                        Tableau de bord Livreur

                    </h1>

                    <div className="delivery-dashboard-cards">

                        <div className="delivery-dashboard-card">

                            <span>

                                Solde Wallet

                            </span>

                            <h2>

                                {

                                    Number(

                                        stats.wallet_balance

                                    ).toFixed(2)

                                } DH

                            </h2>

                        </div>

                        <div className="delivery-dashboard-card">

                            <span>

                                Livraisons Totales

                            </span>

                            <h2>

                                {

                                    stats.total_deliveries

                                }

                            </h2>

                        </div>

                        <div className="delivery-dashboard-card">

                            <span>

                                Magazine

                            </span>

                            <h2>

                                {

                                    stats.magazine_deliveries

                                }

                            </h2>

                        </div>

                        <div className="delivery-dashboard-card">

                            <span>

                                Entre utilisateurs

                            </span>

                            <h2>

                                {

                                    stats.user_deliveries

                                }

                            </h2>

                        </div>

                        <div className="delivery-dashboard-card">

                            <span>

                                Échanges

                            </span>

                            <h2>

                                {

                                    stats.exchange_deliveries

                                }

                            </h2>

                        </div>

                    </div>

                    <div className="delivery-dashboard-table">

                        <h2>

                            Dernières livraisons

                        </h2>

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>Type</th>

                                    <th>Statut</th>

                                    <th>Paiement</th>

                                    <th>Total</th>

                                    <th>Date</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    dashboard.latest_deliveries.length === 0 ?

                                    (

                                        <tr>

                                            <td

                                                colSpan="6"

                                                style={{

                                                    textAlign:

                                                        "center"

                                                }}

                                            >

                                                Aucune livraison.

                                            </td>

                                        </tr>

                                    )

                                    :

                                    (

                                        dashboard.latest_deliveries.map(

                                            (delivery) => (

                                                <tr

                                                    key={delivery.id}

                                                >

                                                    <td>

                                                        {

                                                            delivery.id

                                                        }

                                                    </td>

                                                    <td>

                                                        {

                                                            delivery.type

                                                        }

                                                    </td>

                                                    <td>

                                                        {

                                                            delivery.status

                                                        }

                                                    </td>

                                                    <td>

                                                        {

                                                            delivery.payment

                                                        }

                                                    </td>

                                                    <td>

                                                        {

                                                            Number(

                                                                delivery.total

                                                            ).toFixed(2)

                                                        } DH

                                                    </td>

                                                    <td>

                                                        {

                                                            new Date(

                                                                delivery.created_at

                                                            ).toLocaleDateString(

                                                                "fr-FR"

                                                            )

                                                        }

                                                    </td>

                                                </tr>

                                            )

                                        )

                                    )

                                }

                            </tbody>

                        </table>

                    </div>

                </main>

            </div>

            <DeliveryFooter />

        </div>

    );

}