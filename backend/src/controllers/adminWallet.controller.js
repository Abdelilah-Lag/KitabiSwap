import {
    getWalletOverview,
    getTransactions,
    getAllWallets,
    getPayments,
    approveRechargeRequest,
    rejectRechargeRequest,
    adjustWalletBalance
} from "../services/adminWallet.service.js";
import { createLog } from "../services/adminGlobal.service.js";

export async function overview(req, res) {
    try {
        const data = await getWalletOverview();
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminWallet] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function listTransactions(req, res) {
    try {
        const { page, limit, type, search, sort, order } = req.query;
        const data = await getTransactions({
            page: Number(page) || 1, limit: Number(limit) || 20,
            type, search, sort, order
        });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminWallet] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function listWallets(req, res) {
    try {
        const { page, limit, role_name, status, search, sort, order } = req.query;
        const data = await getAllWallets({
            page: Number(page) || 1, limit: Number(limit) || 20,
            role_name, status, search, sort, order
        });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminWallet] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function listPayments(req, res) {
    try {
        const { page, limit, status, search, sort, order } = req.query;
        const data = await getPayments({
            page: Number(page) || 1, limit: Number(limit) || 20,
            status, search, sort, order
        });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminPayments] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function approvePayment(req, res) {
    try {
        const result = await approveRechargeRequest(req.params.id, req.user.id);
        await createLog(req.user.id, "wallet_recharge_approved", "wallet_recharge_requests", req.params.id, `Recharge approuvée #${req.params.id}`, req.ip);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error("[AdminPayments] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function rejectPayment(req, res) {
    try {
        const { reason } = req.body;
        const result = await rejectRechargeRequest(req.params.id, req.user.id, reason);
        await createLog(req.user.id, "wallet_recharge_rejected", "wallet_recharge_requests", req.params.id, `Recharge rejetée #${req.params.id}: ${reason || ""}`, req.ip);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error("[AdminPayments] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function adjustBalance(req, res) {
    try {
        const { amount, reason } = req.body;
        if (!amount) return res.status(400).json({ success: false, message: "Montant requis" });
        const result = await adjustWalletBalance(req.params.id, amount, reason, req.user.id);
        await createLog(req.user.id, "wallet_adjustment", "wallets", req.params.id, `Ajustement wallet #${req.params.id}: ${amount} MAD - ${reason || ""}`, req.ip);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error("[AdminWallet] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

