import { useState } from "react";

import "./ApproveOrderModal.css";

import {
  approveWarehouseOrder
} from "../../../services/warehouseOrderService";

export default function ApproveOrderModal({
  isOpen,
  onClose,
  orderId,
  onApproved
}) {

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleApprove() {

    try {

      setLoading(true);
      setError("");

      await approveWarehouseOrder(orderId);

      onApproved();

      onClose();

    } catch (err) {

      console.error(err);

      setError(

        err?.response?.data?.message ||

        err?.message ||

        "Impossible de valider cette commande."

      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="approve-order-modal-overlay">

      <div className="approve-order-modal">

        <h2>Validation de la commande</h2>

        <p>

          Êtes-vous sûr de vouloir accepter cette commande ?

        </p>

        {error && (

          <div className="approve-order-error">

            {error}

          </div>

        )}

        <div className="approve-order-actions">

          <button
            className="approve-order-cancel"
            disabled={loading}
            onClick={onClose}
          >
            Annuler
          </button>

          <button
            className="approve-order-confirm"
            disabled={loading}
            onClick={handleApprove}
          >
            {loading
              ? "Validation..."
              : "Accepter"}
          </button>

        </div>

      </div>

    </div>

  );

}