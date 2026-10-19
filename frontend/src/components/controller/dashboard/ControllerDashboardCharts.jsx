import "./ControllerDashboardCharts.css";

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

export default function ControllerDashboardCharts({
    charts,
    statistics
}) {
    const safeCharts = charts ?? {};

    const exchangesByMonth = safeCharts.exchanges_by_month ??
        Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 0 }));

    const exchangeStatusDistribution = safeCharts.exchange_status_distribution ?? {
        pending: 0,
        accepted: 0,
        rejected: 0,
        completed: 0,
        cancelled: 0
    };

    const monthsLabels = exchangesByMonth.map(x => {
        const m = x?.month ?? 1;
        return `M${m}`;
    });

    const barData = {
        labels: monthsLabels,
        datasets: [
            {
                label: "Échanges créés",
                data: exchangesByMonth.map(x => x?.value ?? 0),
                backgroundColor: "#2563eb",
                borderRadius: 8
            }
        ]
    };

    const doughnutData = {
        labels: Object.keys(exchangeStatusDistribution),
        datasets: [
            {
                data: Object.values(exchangeStatusDistribution),
                backgroundColor: [
                    "#f59e0b",
                    "#10b981",
                    "#ef4444",
                    "#8b5cf6",
                    "#14b8a6"
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
        <div className="controller-dashboard-charts">
            <div className="controller-dashboard-chart-card">
                <div className="controller-dashboard-chart-header">
                    <h3>Évolution des échanges</h3>
                </div>

                <div className="controller-dashboard-chart">
                    <Bar data={barData} options={options} />
                </div>
            </div>

            <div className="controller-dashboard-chart-card">
                <div className="controller-dashboard-chart-header">
                    <h3>Répartition des échanges</h3>
                </div>

                <div className="controller-dashboard-chart">
                    <Doughnut data={doughnutData} options={options} />
                </div>
            </div>
        </div>
    );
}

