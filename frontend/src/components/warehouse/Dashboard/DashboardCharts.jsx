import "./DashboardCharts.css";

import {

    Bar,
    Doughnut

} from "react-chartjs-2";

import {

    Chart as ChartJS,

    CategoryScale,
    LinearScale,

    BarElement,

    ArcElement,

    Tooltip,

    Legend

} from "chart.js";

ChartJS.register(

    CategoryScale,
    LinearScale,

    BarElement,

    ArcElement,

    Tooltip,

    Legend

);

export default function DashboardCharts({

    statistics

}) {

    const safeStatistics = statistics ?? {

        catalog_books: 0,

        inventory_books: 0,

        sell_requests: 0,

        validated_sales: 0

    };

    /*
    ==========================================
    BAR CHART
    ==========================================
    */

    const barData = {

        labels: [

            "Catalog",

            "Inventory",

            "Sell Requests",

            "Sales"

        ],

        datasets: [

            {

                label: "Books",

                data: [

                    safeStatistics.catalog_books,

                    safeStatistics.inventory_books,

                    safeStatistics.sell_requests,

                    safeStatistics.validated_sales

                ],

                backgroundColor: [

                    "#2563eb",

                    "#10b981",

                    "#f59e0b",

                    "#8b5cf6"

                ],

                borderRadius: 8

            }

        ]

    };

    /*
    ==========================================
    DOUGHNUT
    ==========================================
    */

    const doughnutData = {

        labels: [

            "Catalog",

            "Inventory"

        ],

        datasets: [

            {

                data: [

                    safeStatistics.catalog_books,

                    safeStatistics.inventory_books

                ],

                backgroundColor: [

                    "#2563eb",

                    "#10b981"

                ],

                borderWidth: 0

            }

        ]

    };

    const options = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                position: "bottom"

            }

        }

    };

    return (

        <div className="dashboard-charts">

            {/* BAR */}

            <div className="dashboard-chart-card">

                <div className="dashboard-chart-header">

                    <h3>

                        Platform Statistics

                    </h3>

                </div>

                <div className="dashboard-chart">

                    <Bar

                        data={barData}

                        options={options}

                    />

                </div>

            </div>

            {/* PIE */}

            <div className="dashboard-chart-card">

                <div className="dashboard-chart-header">

                    <h3>

                        Catalog vs Inventory

                    </h3>

                </div>

                <div className="dashboard-chart">

                    <Doughnut

                        data={doughnutData}

                        options={options}

                    />

                </div>

            </div>

        </div>

    );

}