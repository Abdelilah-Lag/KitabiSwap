import "./OrderBuyerCard.css";

export default function OrderBuyerCard({ buyer }) {

  if (!buyer) return null;

  const address = buyer.address;

  return (

    <div className="order-buyer-card">

      <h3>Acheteur</h3>

      <div className="order-buyer-content">

        <div className="order-buyer-row">

          <span>Nom</span>

          <strong>
            {buyer.first_name} {buyer.last_name}
          </strong>

        </div>

        <div className="order-buyer-row">

          <span>Téléphone</span>

          <strong>
            {buyer.phone || "-"}
          </strong>

        </div>

        {address && (

          <>

            <div className="order-buyer-row">

              <span>Destinataire</span>

              <strong>
                {address.recipient_name}
              </strong>

            </div>

            <div className="order-buyer-row">

              <span>Adresse</span>

              <strong>
                {address.street || "-"}
              </strong>

            </div>

            <div className="order-buyer-row">

              <span>Quartier</span>

              <strong>
                {address.district || "-"}
              </strong>

            </div>

            <div className="order-buyer-row">

              <span>Ville</span>

              <strong>
                {address.city}
              </strong>

            </div>

            <div className="order-buyer-row">

              <span>Région</span>

              <strong>
                {address.region || "-"}
              </strong>

            </div>

            <div className="order-buyer-row">

              <span>Code postal</span>

              <strong>
                {address.postal_code || "-"}
              </strong>

            </div>

          </>

        )}

      </div>

    </div>

  );

}