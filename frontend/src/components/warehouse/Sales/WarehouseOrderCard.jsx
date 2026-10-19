import "./WarehouseOrderCard.css";

export default function WarehouseOrderCard({
  order,
  onApprove,
  onRefuse,
  loading
}) {
  const isShop = order.type === "shop";
  const sourceLabel = order.source === "user_commandes" ? "Commande" : "Commande";

  return (
    <div className="warehouse-order-card">
      {/* ===========================
          BOOK
      =========================== */}

      <div className="warehouse-order-book">
        <div className="warehouse-order-books">
          {(order.books && order.books.length ? order.books : [order.book]).map((b, idx) => (
            <div key={idx} className="warehouse-order-book-item">
              <img
                src={b.cover || "https://placehold.co/120x170?text=No+Image"}
                alt={b.title}
              />
              <div className="warehouse-order-book-info">
                <h3>{b.title}</h3>
                <p>
                  <strong>Auteur :</strong> {b.author}
                </p>
                {b.condition ? (
                  <p>
                    <strong>Etat :</strong> {b.condition}
                  </p>
                ) : null}
                <p>
                  <strong>Prix :</strong> {idx === 0 ? order.price : b.unit_price || 0} DH
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="warehouse-order-book-summary">
          <p>
            <strong>Livraison :</strong> {order.delivery_price} DH
          </p>

          <p className="warehouse-order-total">
            Total : {order.total} DH
          </p>
        </div>

      </div>


      {/* ===========================
          BUYER
      =========================== */}

      <div className="warehouse-order-section">

        <h4>Acheteur</h4>

        <p>
          {order.buyer.first_name} {order.buyer.last_name}
        </p>

        <p>{order.buyer.phone}</p>

        {order.buyer.address && (
          <>
            <p>{order.buyer.address.street}</p>

            <p>{order.buyer.address.district}</p>

            <p>
              {order.buyer.address.city} -{" "}
              {order.buyer.address.region}
            </p>

            <p>{order.buyer.address.postal_code}</p>
          </>
        )}

      </div>

      {/* ===========================
          SELLER
      =========================== */}

      {!isShop && order.seller && (

        <div className="warehouse-order-section">

          <h4>Vendeur</h4>

          <p>
            {order.seller.first_name} {order.seller.last_name}
          </p>

          <p>{order.seller.phone}</p>

        </div>

      )}

      {/* ===========================
          PAYMENT
      =========================== */}

      <div className="warehouse-order-payment">

        <span>

          Paiement :

          <strong>

            {order.payment_method === "wallet"
              ? " Wallet"
              : " Cash"}

          </strong>

        </span>

      </div>

      {/* ===========================
          ACTIONS
      =========================== */}

      <div className="warehouse-order-actions">

        <button
          className="warehouse-btn-refuse"
          disabled={loading}
          onClick={() => {
            console.log("ORDER =", order);
            onRefuse(order);
          }}
        >
          Refuser
        </button>

        <button
          className="warehouse-btn-approve"
          disabled={loading}
          onClick={() => {
            console.log("ORDER =", order);
            onApprove(order);
          }}
        >
          Accepter
        </button>

      </div>

    </div>
  );
}