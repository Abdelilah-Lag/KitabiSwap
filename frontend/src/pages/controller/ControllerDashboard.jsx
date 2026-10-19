import "./ControllerDashboard.css";

import {
    useEffect,
    useState
} from "react";

import ControllerLayout from "../../components/controller/ControllerLayout";

import ControllerDashboardStats from "../../components/controller/dashboard/ControllerDashboardStats";
import ControllerDashboardCharts from "../../components/controller/dashboard/ControllerDashboardCharts";

import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";

import {
    getControllerDashboard
} from "../../services/controllerDashboardService";


export default function ControllerDashboard() {

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState(null);


    useEffect(() => {

        loadDashboard();

    }, []);



    async function loadDashboard() {

        try {

            const response = await getControllerDashboard();

            setDashboard(response);

        } 
        catch (error) {

            console.error(error);

        } 
        finally {

            setLoading(false);

        }

    }



    if (loading) {

        return (

            <ControllerLayout>

                <div className="controller-dashboard-loading">

                    <LoadingSpinner />

                </div>

            </ControllerLayout>

        );

    }



    const statistics = dashboard?.statistics ?? {

        total_exchanges: 0,

        pending: 0,

        accepted: 0,

        completed: 0,

        cancelled: 0,

        total_exchange_books: 0,


        exchange_submissions: 0,

        exchange_submissions_pending: 0,

        exchange_submissions_accepted: 0,

        exchange_submissions_rejected: 0,


        delivery_pending: 0,

        delivery_assigned: 0,

        delivery_in_transit: 0,

        delivery_completed: 0,

        delivery_cancelled: 0

    };



    const charts = dashboard?.charts ?? {

        exchanges_by_month:

            Array.from(

                { length: 12 },

                (_, i) => ({

                    month: i + 1,

                    value: 0

                })

            ),


        exchange_status_distribution: {

            pending: 0,

            accepted: 0,

            rejected: 0,

            completed: 0,

            cancelled: 0

        }

    };



    return (

        <ControllerLayout>

            <main className="controller-dashboard">


                <section className="controller-dashboard-header">

                    <h1>

                        Tableau de bord contrôle

                    </h1>

                    <p>

                        Suivi des échanges, validations et livraisons.

                    </p>

                </section>



                <section className="controller-dashboard-content">


                    <div className="controller-dashboard-stat-section">

                        <ControllerDashboardStats

                            statistics={statistics}

                        />

                    </div>



                    <div className="controller-dashboard-chart-section">

                        <ControllerDashboardCharts

                            charts={charts}

                            statistics={statistics}

                        />

                    </div>


                </section>


            </main>

        </ControllerLayout>

    );

}