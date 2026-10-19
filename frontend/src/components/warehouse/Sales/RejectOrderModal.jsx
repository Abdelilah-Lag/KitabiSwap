import { useState } from "react";

import "./RejectOrderModal.css";

import {
  refuseWarehouseOrder
} from "../../../services/warehouseOrderService";

export default function RejectOrderModal({
  isOpen,
  onClose,
  orderId,
  onRejected
}) {

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleReject() {

    try {

      setLoading(true);
      setError("");

      await refuseWarehouseOrder(orderId);

      onRejected();

      onClose();

    } catch (err) {

      console.error(err);

      setError(

        err?.response?.data?.message ||

        err?.message ||

        "Impossible de refuser cette commande."

      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="reject-order-modal-overlay">

      <div className="reject-order-modal">

        <h2>Refuser la commande</h2>

        <p>

          Êtes-vous sûr de vouloir refuser cette commande ?

        </p>

        <p className="reject-order-warning">

          Si le paiement a été effectué par <strong>Wallet</strong>,
          le montant sera automatiquement remboursé au client.

        </p>

        {error && (

          <div className="reject-order-error">

            {error}

          </div>

        )}

        <div className="reject-order-actions">

          <button
            className="reject-order-cancel"
            disabled={loading}
            onClick={onClose}
          >
            Annuler
          </button>

          <button
            className="reject-order-confirm"
            disabled={loading}
            onClick={handleReject}
          >
            {loading
              ? "Refus..."
              : "Refuser"}
          </button>

        </div>

      </div>

    </div>

  );

}