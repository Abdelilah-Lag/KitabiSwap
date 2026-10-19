import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
    listBookOrders,
    listUserCommandes,
    getOrder,
    editOrderStatus,
    cancelBookOrder,
    listExchanges,
    getExchange,
    editExchangeStatus,
    listDeliveries,
    listDeliveryPersons
} from "../controllers/adminOrder.controller.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

// Book Orders
router.get("/book-orders", listBookOrders);
router.get("/book-orders/:id", getOrder);
router.patch("/book-orders/:id/status", editOrderStatus);
router.post("/book-orders/:id/cancel", cancelBookOrder);

// User Commandes
router.get("/user-commandes", listUserCommandes);

// Exchanges
router.get("/exchanges", listExchanges);
router.get("/exchanges/:id", getExchange);
router.patch("/exchanges/:id/status", editExchangeStatus);

// Deliveries
router.get("/deliveries", listDeliveries);
router.get("/delivery-persons", listDeliveryPersons);

export default router;

