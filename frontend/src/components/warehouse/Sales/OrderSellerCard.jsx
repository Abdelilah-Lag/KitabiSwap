import "./OrderSellerCard.css";

import { FaUser, FaPhone, FaStore } from "react-icons/fa";

export default function OrderSellerCard({ seller }) {
    if (!seller) return null;

    return (
        <div className="order-seller-card">

            <h3 className="order-seller-card-title">
                <FaStore />
                Vendeur
            </h3>

            <div className="order-seller-grid">

                <div className="order-seller-item">
                    <span className="order-seller-label">
                        Prénom
                    </span>

                    <span className="order-seller-value">
                        {seller.first_name}
                    </span>
                </div>

                <div className="order-seller-item">
                    <span className="order-seller-label">
                        Nom
                    </span>

                    <span className="order-seller-value">
                        {seller.last_name}
                    </span>
                </div>

                <div className="order-seller-item">
                    <span className="order-seller-label">
                        Téléphone
                    </span>

                    <span className="order-seller-value order-seller-phone">
                        <FaPhone />
                        {seller.phone || "-"}
                    </span>
                </div>

                <div className="order-seller-item">
                    <span className="order-seller-label">
                        Type
                    </span>

                    <span className="order-seller-value">
                        <FaUser />
                        Utilisateur vendeur
                    </span>
                </div>

            </div>

        </div>
    );
}