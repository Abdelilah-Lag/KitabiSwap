import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serializeBigInt.js";

/**
 * ==========================================
 * ADMIN DASHBOARD SERVICE
 * ==========================================
 */

export async function getDashboardStats() {
    // 1. USERS STATS
    const [
        totalUsers,
        newUsersToday,
        newUsersThisWeek,
        activeUsers,
        blockedUsers
    ] = await Promise.all([
        prisma.users.count({ where: { role_id: 2 } }),
        prisma.users.count({
            where: {
                role_id: 2,
                created_at: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
            }
        }),
        prisma.users.count({
            where: {
                role_id: 2,
                created_at: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }
        }),
        prisma.users.count({
            where: {
                role_id: 2,
                status: "active"
            }
        }),
        prisma.users.count({
            where: {
                role_id: 2,
                status: "suspended"
            }
        })
    ]);

    // Users by role
    const usersByRole = await prisma.users.groupBy({
        by: ["role_id"],
        _count: { id: true }
    });

    const roles = await prisma.roles.findMany();
    const roleMap = {};
    for (const r of roles) roleMap[r.id] = r.name;

    const usersByRoleFormatted = {};
    for (const row of usersByRole) {
        const name = roleMap[row.role_id] || "unknown";
        usersByRoleFormatted[name] = row._count.id;
    }

    // 2. BOOKS STATS
    const [
        catalogBooks,
        submittedBooks,
        userBooks,
        soldBooksShop,
        soldBooksUser,
        exchangedBooks
    ] = await Promise.all([
        prisma.books_catalog.count({ where: { is_active: true } }),
        prisma.book_submissions.count(),
        prisma.user_books.count({ where: { status: { not: "hidden" } } }),
        prisma.book_orders.count({ where: { status: "valide" } }),
        prisma.user_commandes.count({ where: { order_status: "delivered" } }),
        prisma.exchange_requests.count({ where: { status: "completed" } })
    ]);

    // 3. ORDERS STATS
    const [
        magazineOrders,
        userOrders
    ] = await Promise.all([
        prisma.book_orders.count(),
        prisma.user_commandes.count()
    ]);

    // 4. EXCHANGES & DELIVERIES
    const [
        totalExchanges,
        ongoingDeliveries,
        completedDeliveries
    ] = await Promise.all([
        prisma.exchange_requests.count(),
        prisma.deliveries.count({ where: { status: "en_cours" } }),
        prisma.deliveries.count({ where: { status: "delivre" } })
    ]);

    // 5. WALLET TOTAL (users only - role_id = 2)
    const walletResult = await prisma.$queryRaw`
        SELECT COALESCE(SUM(w.balance), 0) as total
        FROM wallets w
        JOIN users u ON u.id = w.user_id
        WHERE u.role_id = 2
    `;
    const totalUserWalletBalance = Number(walletResult[0]?.total || 0);

    const totalWallets = await prisma.wallets.count({
        where: {
            users: { role_id: 2 }
        }
    });

    // 6. PLATFORM REVENUES (commissions + delivery fees)
    const exchangeCommissionRate = 10; // Default commission rate (10%)

    // Calculate exchange commission revenue from exchange_delivery
    const exchangeDeliveries = await prisma.exchange_delivery.findMany({
        where: { status: "completed" }
    });

    let exchangeCommissionTotal = 0;
    let deliveryFeesTotal = 0;

    for (const ed of exchangeDeliveries) {
        const fee = Number(ed.delivery_fee);
        deliveryFeesTotal += fee;
        // Commission is typically a percentage of the delivery fee
        exchangeCommissionTotal += (fee * exchangeCommissionRate) / 100;
    }

    // Calculate withdrawal fees from wallet_transactions
    const withdrawalTransactions = await prisma.wallet_transactions.findMany({
        where: { transaction_type: "exchange_fee" }
    });
    let withdrawalFeesTotal = 0;
    for (const t of withdrawalTransactions) {
        withdrawalFeesTotal += Number(t.amount);
    }

    const totalRevenue = exchangeCommissionTotal + withdrawalFeesTotal + deliveryFeesTotal;

    // 7. MONTHLY CHARTS (last 12 months)
    const monthlyData = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const [registrations, ordersCount, walletDeposits, deliveriesCount, exchangesCount] = await Promise.all([
            prisma.users.count({
                where: {
                    created_at: { gte: month, lte: monthEnd }
                }
            }),
            prisma.book_orders.count({
                where: {
                    created_at: { gte: month, lte: monthEnd }
                }
            }),
            prisma.wallet_transactions.count({
                where: {
                    transaction_type: "deposit",
                    created_at: { gte: month, lte: monthEnd }
                }
            }),
            prisma.deliveries.count({
                where: {
                    created_at: { gte: month, lte: monthEnd }
                }
            }),
            prisma.exchange_requests.count({
                where: {
                    created_at: { gte: month, lte: monthEnd }
                }
            })
        ]);

        monthlyData.push({
            month: month.toLocaleString("fr-FR", { month: "short" }),
            year: month.getFullYear(),
            registrations,
            orders: ordersCount,
            wallet_deposits: walletDeposits,
            deliveries: deliveriesCount,
            exchanges: exchangesCount
        });
    }

    return serializeBigInt({
        users: {
            total: totalUsers,
            new_today: newUsersToday,
            new_this_week: newUsersThisWeek,
            active: activeUsers,
            blocked: blockedUsers,
            by_role: usersByRoleFormatted
        },
        books: {
            catalog: catalogBooks,
            submitted: submittedBooks,
            user_books: userBooks,
            sold_shop: soldBooksShop + soldBooksUser,
            exchanged: exchangedBooks
        },
        orders: {
            magazine: magazineOrders,
            user_orders: userOrders
        },
        exchanges: totalExchanges,
        deliveries: {
            ongoing: ongoingDeliveries,
            completed: completedDeliveries
        },
        wallet: {
            total_user_balance: totalUserWalletBalance,
            total_wallets: totalWallets
        },
        revenue: {
            exchange_commission: exchangeCommissionTotal,
            withdrawal_fees: withdrawalFeesTotal,
            delivery_fees: deliveryFeesTotal,
            total: totalRevenue
        },
        monthly_charts: monthlyData
    });
}

