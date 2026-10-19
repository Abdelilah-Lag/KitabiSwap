import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serializeBigInt.js";

function monthIndex(date) {
    if (!date) return null;
    const d = new Date(date);
    // getMonth: 0-11
    return d.getMonth() + 1;
}

export async function getDashboardService() {
    // Échanges (source: exchange_requests)
    const [
        totalExchanges,
        pendingExchanges,
        acceptedExchanges,
        completedExchanges,
        cancelledExchanges,
        rejectedExchanges,

        totalExchangeBooks,

        // Livraison (source: exchange_delivery)
        deliveryPending,
        deliveryAssigned,
        deliveryInTransit,
        deliveryCompleted,
        deliveryCancelled,

        exchangeRequestsByMonth,
        exchangeStatusDistribution
    ] = await Promise.all([
        prisma.exchange_requests.count(),
        prisma.exchange_requests.count({ where: { status: "pending" } }),
        prisma.exchange_requests.count({ where: { status: "accepted" } }),
        prisma.exchange_requests.count({ where: { status: "completed" } }),
        prisma.exchange_requests.count({ where: { status: "cancelled" } }),
        prisma.exchange_requests.count({ where: { status: "rejected" } }),

        // total_exchange_books: nombre total de livres impliqués
        // Heuristique: on comptabilise requester_books + receiver_books (json longtext)
        prisma.exchange_requests.findMany({
            select: { requester_books: true, receiver_books: true }
        }),

        prisma.exchange_delivery.count({ where: { status: "pending" } }),
        prisma.exchange_delivery.count({ where: { status: "collecting_books" } }),
        prisma.exchange_delivery.count({ where: { status: "in_transit" } }),
        prisma.exchange_delivery.count({ where: { status: "completed" } }),
        prisma.exchange_delivery.count({ where: { status: "cancelled" } }),

        prisma.exchange_requests.findMany({
            select: { created_at: true },
            orderBy: { created_at: "asc" }
        }),

        prisma.exchange_requests.groupBy({
            by: ["status"],
            _count: true
        })
    ]);

    // Compute totalExchangeBooks from requester_books/receiver_books
    // requester_books/receiver_books sont des LongText. On tente parse JSON.
    const requestsRows = totalExchangeBooks;
    let totalBooks = 0;

    for (const r of requestsRows) {
        const pairs = [r.requester_books, r.receiver_books];
        for (const raw of pairs) {
            if (!raw) continue;
            try {
                const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
                // attendu: array de livres ou objet
                if (Array.isArray(parsed)) totalBooks += parsed.length;
                else if (typeof parsed === "object") {
                    totalBooks += 1;
                }
                else totalBooks += 1;
            }
            catch {
                // fallback: comptage impossible
                // on suppose 1 livre si non vide
                totalBooks += 1;
            }
        }
    }

    // exchanges_by_month: 12 mois
    const monthCounts = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 0 }));
    for (const row of exchangeRequestsByMonth) {
        const m = monthIndex(row.created_at);
        if (m) monthCounts[m - 1].value += 1;
    }

    const statusMap = {
        pending: 0,
        accepted: 0,
        rejected: 0,
        completed: 0,
        cancelled: 0
    };
    for (const row of exchangeStatusDistribution) {
        if (row.status && statusMap[row.status] !== undefined) {
            statusMap[row.status] = row._count;
        }
    }

    return serializeBigInt({
        statistics: {
            total_exchanges: totalExchanges,
            pending: pendingExchanges,
            accepted: acceptedExchanges,
            completed: completedExchanges,
            cancelled: cancelledExchanges,

            // total_exchange_books
            total_exchange_books: totalBooks,

            exchange_submissions: 0,
            exchange_submissions_pending: 0,
            exchange_submissions_accepted: 0,
            exchange_submissions_rejected: 0,

            delivery_pending: deliveryPending,
            delivery_assigned: deliveryAssigned,
            delivery_in_transit: deliveryInTransit,
            delivery_completed: deliveryCompleted,
            delivery_cancelled: deliveryCancelled
        },
        charts: {
            exchanges_by_month: monthCounts,
            exchange_status_distribution: statusMap
        }
    });
}

