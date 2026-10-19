import "./ControllerDashboardStats.css";

import {
    FaExchangeAlt,
    FaHourglassHalf,
    FaCheckCircle,
    FaTimesCircle,
    FaBox,
    FaClipboardList
} from "react-icons/fa";

export default function ControllerDashboardStats({
    statistics
}) {
    const cards = [
        {
            title: "Total des échanges",
            value: statistics?.total_exchanges ?? 0,
            icon: <FaExchangeAlt />,
            color: "blue"
        },
        {
            title: "En attente",
            value: statistics?.pending ?? 0,
            icon: <FaHourglassHalf />,
            color: "orange"
        },
        {
            title: "Confirmés",
            value: statistics?.accepted ?? 0,
            icon: <FaCheckCircle />,
            color: "green"
        },
        {
            title: "Terminés",
            value: statistics?.completed ?? 0,
            icon: <FaBox />,
            color: "purple"
        },
        {
            title: "Annulés",
            value: statistics?.cancelled ?? 0,
            icon: <FaTimesCircle />,
            color: "red"
        },
        {
            title: "Livres échangés",
            value: statistics?.total_exchange_books ?? 0,
            icon: <FaClipboardList />,
            color: "teal"
        }
    ];

    const cardsDelivery = [
        {
            title: "Livraisons en attente",
            value: statistics?.delivery_pending ?? 0,
            icon: <FaHourglassHalf />,
            color: "orange"
        },
        {
            title: "Assignées",
            value: statistics?.delivery_assigned ?? 0,
            icon: <FaBox />,
            color: "blue"
        },
        {
            title: "En cours",
            value: statistics?.delivery_in_transit ?? 0,
            icon: <FaClipboardList />,
            color: "purple"
        },
        {
            title: "Livrées",
            value: statistics?.delivery_completed ?? 0,
            icon: <FaCheckCircle />,
            color: "green"
        },
        {
            title: "Annulées",
            value: statistics?.delivery_cancelled ?? 0,
            icon: <FaTimesCircle />,
            color: "red"
        }
    ];

    return (
        <div className="controller-dashboard-stats">
            <div className="controller-dashboard-stats-grid">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`controller-dashboard-stat-card ${card.color}`}
                    >
                        <div className="controller-dashboard-stat-icon">
                            {card.icon}
                        </div>

                        <div className="controller-dashboard-stat-content">
                            <span className="controller-dashboard-stat-title">
                                {card.title}
                            </span>
                            <h2>
                                {card.value}
                            </h2>
                        </div>
                    </div>
                ))}
            </div>

            <div className="controller-dashboard-stats-section">
                <h3>Statistiques de livraison</h3>

                <div className="controller-dashboard-stats-grid">
                    {cardsDelivery.map((card, index) => (
                        <div
                            key={index}
                            className={`controller-dashboard-stat-card ${card.color}`}
                        >
                            <div className="controller-dashboard-stat-icon">
                                {card.icon}
                            </div>

                            <div className="controller-dashboard-stat-content">
                                <span className="controller-dashboard-stat-title">
                                    {card.title}
                                </span>
                                <h2>
                                    {card.value}
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

