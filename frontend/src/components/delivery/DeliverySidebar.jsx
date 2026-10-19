import { NavLink } from "react-router-dom";

import "./DeliverySidebar.css";

export default function DeliverySidebar() {

    const menu = [

        {
            label: "Dashboard",
            path: "/delivery",
            icon: "🏠"
        },
        {
            label: "Mes livraisons",
            path: "/delivery/my-deliveries",
            icon: "🚚"
        },
        {
            label: "Commandes Magazine",
            path: "/delivery/magazine-orders",
            icon: "📚"
        },

        {
            label: "Commandes Utilisateurs",
            path: "/delivery/user-orders",
            icon: "👤"
        },

        {
            label: "Échanges",
            path: "/delivery/exchanges",
            icon: "🔄"
        }

    ];

    return (

        <aside className="delivery-sidebar">

            <div className="delivery-sidebar-title">

                <h3>

                    Menu

                </h3>

            </div>

            <nav className="delivery-sidebar-menu">

                {

                    menu.map((item) => (

                        <NavLink

                            key={item.path}

                            to={item.path}

                            className={({ isActive }) =>

                                isActive

                                    ? "delivery-sidebar-link active"

                                    : "delivery-sidebar-link"

                            }

                        >

                            <span className="delivery-sidebar-icon">

                                {item.icon}

                            </span>

                            <span>

                                {item.label}

                            </span>

                        </NavLink>

                    ))

                }

            </nav>

        </aside>

    );

}