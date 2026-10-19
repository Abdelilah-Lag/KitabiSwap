import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
    overview,
    listTransactions,
    listWallets,
    listPayments,
    approvePayment,
    rejectPayment,
    adjustBalance
} from "../controllers/adminWallet.controller.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/overview", overview);
router.get("/transactions", listTransactions);
router.get("/wallets", listWallets);
router.get("/payments", listPayments);
router.post("/payments/:id/approve", approvePayment);
router.post("/payments/:id/reject", rejectPayment);
router.post("/wallets/:id/adjust", adjustBalance);

export default router;

