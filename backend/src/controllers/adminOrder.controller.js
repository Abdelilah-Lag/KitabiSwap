import {
    getBookOrders,
    getUserCommandes,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getExchanges,
    getExchangeById,
    updateExchangeStatus,
    getDeliveries,
    getDeliveryPersons
} from "../services/adminOrder.service.js";

export async function listBookOrders(req, res) {
    try {
        const { page, limit, status, payment_method, search, sort, order } = req.query;
        const data = await getBookOrders({
            page: Number(page) || 1, limit: Number(limit) || 20,
            status, payment_method, search, sort, order
        });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminOrders] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function listUserCommandes(req, res) {
    try {
        const { page, limit, order_status, payment_status, search, sort, order } = req.query;
        const data = await getUserCommandes({
            page: Number(page) || 1, limit: Number(limit) || 20,
            order_status, payment_status, search, sort, order
        });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminOrders] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getOrder(req, res) {
    try {
        const order = await getOrderById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: "Commande introuvable" });
        res.json({ success: true, order });
    } catch (error) {
        console.error("[AdminOrders] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function editOrderStatus(req, res) {
    try {
        const { status } = req.body;
        const order = await updateOrderStatus(req.params.id, status);
        res.json({ success: true, order });
    } catch (error) {
        console.error("[AdminOrders] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function cancelBookOrder(req, res) {
    try {
        const order = await cancelOrder(req.params.id);
        res.json({ success: true, order, message: "Commande annulée" });
    } catch (error) {
        console.error("[AdminOrders] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function listExchanges(req, res) {
    try {
        const { page, limit, status, search, sort, order } = req.query;
        const data = await getExchanges({
            page: Number(page) || 1, limit: Number(limit) || 20,
            status, search, sort, order
        });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminExchanges] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getExchange(req, res) {
    try {
        const exchange = await getExchangeById(req.params.id);
        if (!exchange) return res.status(404).json({ success: false, message: "Échange introuvable" });
        res.json({ success: true, exchange });
    } catch (error) {
        console.error("[AdminExchanges] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function editExchangeStatus(req, res) {
    try {
        const { status } = req.body;
        const exchange = await updateExchangeStatus(req.params.id, status);
        res.json({ success: true, exchange });
    } catch (error) {
        console.error("[AdminExchanges] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function listDeliveries(req, res) {
    try {
        const { page, limit, status, delivery_person_id, search, sort, order } = req.query;
        const data = await getDeliveries({
            page: Number(page) || 1, limit: Number(limit) || 20,
            status, delivery_person_id, search, sort, order
        });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminDeliveries] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function listDeliveryPersons(req, res) {
    try {
        const persons = await getDeliveryPersons();
        res.json({ success: true, persons });
    } catch (error) {
        console.error("[AdminDeliveries] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

