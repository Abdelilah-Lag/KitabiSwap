import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serializeBigInt.js";

/**
 * ==========================================
 * ADMIN WALLET SERVICE
 * ==========================================
 */

export async function getWalletOverview() {
    // Wallet totals by role
    const roleTotals = await prisma.$queryRaw`
        SELECT r.name as role_name, COUNT(w.id) as wallet_count, COALESCE(SUM(w.balance), 0) as total_balance
        FROM wallets w
        JOIN users u ON u.id = w.user_id
        JOIN roles r ON r.id = u.role_id
        GROUP BY r.name
    `;

    // Platform wallet
    const platformWallet = await prisma.$queryRaw`
        SELECT COALESCE(SUM(w.balance), 0) as total
        FROM wallets w
        JOIN users u ON u.id = w.user_id
        WHERE u.role_id = 1
    `;

    // Total transactions stats
    const transactionStats = await prisma.$queryRaw`
        SELECT 
            transaction_type,
            COUNT(*) as count,
            COALESCE(SUM(amount), 0) as total_amount
        FROM wallet_transactions
        GROUP BY transaction_type
    `;

    return {
        role_totals: roleTotals.map(r => ({
            role_name: r.role_name,
            wallet_count: Number(r.wallet_count),
            total_balance: Number(r.total_balance)
        })),
        platform_wallet: Number(platformWallet[0]?.total || 0),
        transaction_stats: transactionStats.map(t => ({
            type: t.transaction_type,
            count: Number(t.count),
            total_amount: Number(t.total_amount)
        }))
    };
}

export async function getTransactions({ page = 1, limit = 20, type, search, sort = "created_at", order = "desc" }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (type) where.transaction_type = type;
    if (search) {
        where.wallets = {
            users: {
                OR: [
                    { first_name: { contains: search } },
                    { last_name: { contains: search } },
                    { email: { contains: search } }
                ]
            }
        };
    }

    const [transactions, total] = await Promise.all([
        prisma.wallet_transactions.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sort]: order },
            include: {
                wallets: {
                    include: {
                        users: { select: { id: true, first_name: true, last_name: true, email: true } }
                    }
                }
            }
        }),
        prisma.wallet_transactions.count({ where })
    ]);

    return serializeBigInt({ transactions, pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } });
}

export async function getAllWallets({ page = 1, limit = 20, role_name, status, search, sort = "created_at", order = "desc" }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (role_name) {
        where.users = {
            roles: { name: role_name }
        };
    }
    if (search) {
        where.users = {
            ...(where.users || {}),
            OR: [
                { first_name: { contains: search } },
                { last_name: { contains: search } },
                { email: { contains: search } }
            ]
        };
    }

    const [wallets, total] = await Promise.all([
        prisma.wallets.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sort]: order },
            include: {
                users: {
                    select: { id: true, first_name: true, last_name: true, email: true, phone: true, avatar_url: true, roles: { select: { name: true } } }
                },
                _count: { select: { wallet_transactions: true, wallet_recharge_requests: true } }
            }
        }),
        prisma.wallets.count({ where })
    ]);

    return serializeBigInt({ wallets, pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } });
}

export async function getPayments({ page = 1, limit = 20, status, search, sort = "created_at", order = "desc" }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (search) {
        where.users = {
            OR: [
                { first_name: { contains: search } },
                { last_name: { contains: search } },
                { email: { contains: search } }
            ]
        };
    }

    const [requests, total] = await Promise.all([
        prisma.wallet_recharge_requests.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sort]: order },
            include: {
                wallets: {
                    include: {
                        users: { select: { id: true, first_name: true, last_name: true, email: true, phone: true } }
                    }
                },
                users: { select: { id: true, first_name: true, last_name: true } }
            }
        }),
        prisma.wallet_recharge_requests.count({ where })
    ]);

    return serializeBigInt({ requests, pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } });
}

export async function approveRechargeRequest(requestId, adminId) {
    const request = await prisma.wallet_recharge_requests.findUnique({
        where: { id: BigInt(requestId) },
        include: { wallets: true }
    });

    if (!request) throw new Error("Demande introuvable");
    if (request.status !== "pending") throw new Error("Cette demande a déjà été traitée");

    const amount = Number(request.amount);
    const wallet = request.wallets;

    // Update request status
    await prisma.wallet_recharge_requests.update({
        where: { id: BigInt(requestId) },
        data: { status: "approved", admin_id: BigInt(adminId), validated_at: new Date() }
    });

    // Update wallet balance
    const newBalance = Number(wallet.balance) + amount;
    await prisma.wallets.update({
        where: { id: wallet.id },
        data: { balance: newBalance }
    });

    // Create transaction record
    await prisma.wallet_transactions.create({
        data: {
            wallet_id: wallet.id,
            transaction_type: "deposit",
            amount: amount,
            balance_before: Number(wallet.balance),
            balance_after: newBalance,
            description: "Recharge approuvée par l'administrateur",
            reference: `RECHARGE-${requestId}`
        }
    });

    return { success: true, message: "Recharge approuvée avec succès" };
}

export async function rejectRechargeRequest(requestId, adminId, reason) {
    const request = await prisma.wallet_recharge_requests.findUnique({
        where: { id: BigInt(requestId) }
    });

    if (!request) throw new Error("Demande introuvable");
    if (request.status !== "pending") throw new Error("Cette demande a déjà été traitée");

    await prisma.wallet_recharge_requests.update({
        where: { id: BigInt(requestId) },
        data: {
            status: "rejected",
            admin_id: BigInt(adminId),
            rejection_reason: reason || "Demande rejetée"
        }
    });

    return { success: true, message: "Recharge rejetée" };
}

export async function adjustWalletBalance(walletId, amount, reason, adminId) {
    const wallet = await prisma.wallets.findUnique({ where: { id: BigInt(walletId) } });
    if (!wallet) throw new Error("Wallet introuvable");

    const newBalance = Number(wallet.balance) + Number(amount);
    if (newBalance < 0) throw new Error("Solde insuffisant");

    await prisma.wallets.update({
        where: { id: BigInt(walletId) },
        data: { balance: newBalance }
    });

    await prisma.wallet_transactions.create({
        data: {
            wallet_id: BigInt(walletId),
            transaction_type: "admin_adjustment",
            amount: Math.abs(Number(amount)),
            balance_before: Number(wallet.balance),
            balance_after: newBalance,
            description: reason || `Ajustement administrateur: ${Number(amount) >= 0 ? "+" : ""}${amount} MAD`
        }
    });

    return { success: true, new_balance: newBalance };
}

