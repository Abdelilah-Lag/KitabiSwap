import "./WarehouseOrderDetailsModal.css";

export default function WarehouseOrderDetailsModal({
  isOpen,
  onClose,
  order
}) {
  if (!isOpen || !order) return null;

  const isShop = order.type === "shop";

  return (
    <div className="warehouse-order-modal-overlay">

      <div className="warehouse-order-modal">

        <button
          className="warehouse-order-modal-close"
          onClick={onClose}
        >
          ✕
        </button>

        <h2>Détails de la commande</h2>

        {/* ==========================================
            BOOK
        ========================================== */}

        <div className="warehouse-order-details-book">

          <img
            src={
              order.book.cover ||
              "https://placehold.co/180x250?text=No+Image"
            }
            alt={order.book.title}
          />

          <div>

            <h3>{order.book.title}</h3>

            <p>
              <strong>Auteur :</strong> {order.book.author}
            </p>

            {!isShop && (
              <p>
                <strong>État :</strong> {order.book.condition}
              </p>
            )}

            {isShop && (
              <p>
                <strong>Quantité :</strong> {order.quantity}
              </p>
            )}

            <p>
              <strong>Prix :</strong> {order.price} DH
            </p>

            <p>
              <strong>Livraison :</strong>{" "}
              {order.delivery_price} DH
            </p>

            <p className="warehouse-order-modal-total">
              Total : {order.total} DH
            </p>

          </div>

        </div>

        {/* ==========================================
            BUYER
        ========================================== */}

        <div className="warehouse-order-modal-section">

          <h3>Acheteur</h3>

          <p>
            <strong>Nom :</strong>{" "}
            {order.buyer.first_name} {order.buyer.last_name}
          </p>

          <p>
            <strong>Téléphone :</strong>{" "}
            {order.buyer.phone}
          </p>

          {order.buyer.address && (
            <>
              <p>
                <strong>Destinataire :</strong>{" "}
                {order.buyer.address.recipient_name}
              </p>

              <p>
                <strong>Adresse :</strong>{" "}
                {order.buyer.address.street}
              </p>

              <p>
                <strong>Quartier :</strong>{" "}
                {order.buyer.address.district}
              </p>

              <p>
                <strong>Ville :</strong>{" "}
                {order.buyer.address.city}
              </p>

              <p>
                <strong>Région :</strong>{" "}
                {order.buyer.address.region}
              </p>

              <p>
                <strong>Code postal :</strong>{" "}
                {order.buyer.address.postal_code}
              </p>
            </>
          )}

        </div>

        {/* ==========================================
            SELLER
        ========================================== */}

        {!isShop && order.seller && (

          <div className="warehouse-order-modal-section">

            <h3>Vendeur</h3>

            <p>
              <strong>Nom :</strong>{" "}
              {order.seller.first_name}{" "}
              {order.seller.last_name}
            </p>

            <p>
              <strong>Téléphone :</strong>{" "}
              {order.seller.phone}
            </p>

          </div>

        )}

        {/* ==========================================
            PAYMENT
        ========================================== */}

        <div className="warehouse-order-modal-section">

          <h3>Paiement</h3>

          <p>

            <strong>Méthode :</strong>{" "}

            {order.payment_method === "wallet"
              ? "Wallet"
              : "Cash on Delivery"}

          </p>

          <p>

            <strong>Statut :</strong>{" "}

            {order.status}

          </p>

        </div>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <div className="warehouse-order-modal-footer">

          <button
            className="warehouse-order-close-btn"
            onClick={onClose}
          >
            Fermer
          </button>

        </div>

      </div>

    </div>
  );
}