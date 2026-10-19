import "./DashboardStats.css";

import {

    FaBook,
    FaWarehouse,
    FaClipboardList,
    FaShoppingCart

} from "react-icons/fa";

export default function DashboardStats({

    statistics

}) {

    const cards = [

        {

            title: "Books Catalog",

            value: statistics?.catalog_books ?? 0,

            icon: <FaBook />,

            color: "blue"

        },

        {

            title: "Store Inventory",

            value: statistics?.inventory_books ?? 0,

            icon: <FaWarehouse />,

            color: "green"

        },

        {

            title: "Sell Requests",

            value: statistics?.sell_requests ?? 0,

            icon: <FaClipboardList />,

            color: "orange"

        },

        {

            title: "Validated Sales",

            value: statistics?.validated_sales ?? 0,

            icon: <FaShoppingCart />,

            color: "purple"

        }

    ];

    return (

        <div className="dashboard-stats">

            {

                cards.map((card,index)=>(

                    <div

                        key={index}

                        className={`dashboard-stat-card ${card.color}`}

                    >

                        <div className="dashboard-stat-icon">

                            {card.icon}

                        </div>

                        <div className="dashboard-stat-content">

                            <span className="dashboard-stat-title">

                                {card.title}

                            </span>

                            <h2>

                                {card.value}

                            </h2>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}