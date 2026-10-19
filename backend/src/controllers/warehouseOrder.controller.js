import {
    getWarehouseOrdersService,
    approveWarehouseOrderService,
    rejectWarehouseOrderService
} from "../services/warehouseOrder.service.js";

/* ==========================================================
   GET ALL PENDING ORDERS
========================================================== */

export async function getWarehouseOrdersController(req, res) {

    try {

        const orders = await getWarehouseOrdersService();

        return res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {

        console.error("GET_WAREHOUSE_ORDERS_ERROR:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Erreur lors du chargement des commandes."
        });

    }

}

/* ==========================================================
   APPROVE ORDER
========================================================== */

export async function approveWarehouseOrderController(req, res) {

    try {

        const { source, id } = req.params;

        if (!source || !id) {

            return res.status(400).json({
                success: false,
                message:
                    "Paramètres invalides. Route attendue : /warehouse/orders/:source/:id/approve"
            });

        }

        const result =
            await approveWarehouseOrderService(source, id);

        return res.status(200).json(result);

    } catch (error) {

        console.error("APPROVE_WAREHOUSE_ORDER_ERROR:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Erreur lors de la validation de la commande."
        });

    }

}

/* ==========================================================
   REJECT ORDER
========================================================== */

export async function rejectWarehouseOrderController(req, res) {

    try {

        const { source, id } = req.params;

        if (!source || !id) {

            return res.status(400).json({
                success: false,
                message:
                    "Paramètres invalides. Route attendue : /warehouse/orders/:source/:id/reject"
            });

        }

        const result =
            await rejectWarehouseOrderService(source, id);

        return res.status(200).json(result);

    } catch (error) {

        console.error("REJECT_WAREHOUSE_ORDER_ERROR:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Erreur lors du refus de la commande."
        });

    }

}