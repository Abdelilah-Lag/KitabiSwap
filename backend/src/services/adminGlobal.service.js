import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serializeBigInt.js";

/**
 * ==========================================
 * ADMIN GLOBAL SERVICE
 * (Messages, Logs, Settings, Search, Backup, Stats)
 * ==========================================
 */

// ==========================================
// MESSAGES
// ==========================================

export async function sendAdminMessage(data, adminId) {
    const { title, message, message_type, target_type, target_user_id } = data;

    // Record the broadcast message to the admin's own inbox
    const msg = await prisma.messages.create({
        data: {
            sender_id: BigInt(adminId),
            receiver_id: BigInt(adminId),
            message: `[BROADCAST - ${target_type}] ${title}\n\n${message}`,
            is_read: false
        }
    });

    // Create individual message records for each target user
    let targetUsers = [];

    switch (target_type) {
        case "all": {
            const allUsers = await prisma.users.findMany({
                where: { status: "active" },
                select: { id: true }
            });
            targetUsers = allUsers;
            break;
        }
        case "all_users": {
            const users = await prisma.users.findMany({
                where: { role_id: 2, status: "active" },
                select: { id: true }
            });
            targetUsers = users;
            break;
        }
        case "all_delivery": {
            const deliveryRole = await prisma.roles.findUnique({ where: { name: "delivery" } });
            if (deliveryRole) {
                const deliverers = await prisma.users.findMany({
                    where: { role_id: deliveryRole.id, status: "active" },
                    select: { id: true }
                });
                targetUsers = deliverers;
            }
            break;
        }
        case "all_controller": {
            const controllerRole = await prisma.roles.findUnique({ where: { name: "controller" } });
            if (controllerRole) {
                const controllers = await prisma.users.findMany({
                    where: { role_id: controllerRole.id, status: "active" },
                    select: { id: true }
                });
                targetUsers = controllers;
            }
            break;
        }
        case "all_warehouse": {
            const warehouseRole = await prisma.roles.findUnique({ where: { name: "warehouse_manager" } });
            if (warehouseRole) {
                const warehouses = await prisma.users.findMany({
                    where: { role_id: warehouseRole.id, status: "active" },
                    select: { id: true }
                });
                targetUsers = warehouses;
            }
            break;
        }
        case "all_payment_manager": {
            const paymentRole = await prisma.roles.findUnique({ where: { name: "payment_manager" } });
            if (paymentRole) {
                const payments = await prisma.users.findMany({
                    where: { role_id: paymentRole.id, status: "active" },
                    select: { id: true }
                });
                targetUsers = payments;
            }
            break;
        }
        case "specific_user":
            if (target_user_id) {
                targetUsers = [{ id: BigInt(target_user_id) }];
            }
            break;
    }

    // Create message records in the messages table for each target user
    if (targetUsers.length > 0) {
        const messageRecords = targetUsers.map(u => ({
            sender_id: BigInt(adminId),
            receiver_id: u.id,
            message: `${title}\n\n${message}`,
            is_read: false
        }));

        // Batch insert in chunks
        const chunkSize = 100;
        for (let i = 0; i < messageRecords.length; i += chunkSize) {
            const chunk = messageRecords.slice(i, i + chunkSize);
            await prisma.messages.createMany({ data: chunk });
        }
    }

    return serializeBigInt(msg);
}

export async function getSentMessages({ page = 1, limit = 20, adminId }) {
    const skip = (page - 1) * limit;
    const where = { sender_id: BigInt(adminId) };

    const [messages, total] = await Promise.all([
        prisma.messages.findMany({
            where,
            skip,
            take: limit,
            orderBy: { created_at: "desc" }
        }),
        prisma.messages.count({ where })
    ]);

    return serializeBigInt({ messages, pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } });
}

// ==========================================
// LOGS
// ==========================================

export async function createLog(adminId, action, entityType, entityId, details, ipAddress) {
    try {
        // Raw SQL INSERT for admin_logs (model not in Prisma schema)
        await prisma.$executeRawUnsafe(
            `INSERT INTO admin_logs (admin_id, action, entity_type, entity_id, details, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            BigInt(adminId),
            action,
            entityType,
            entityId ? String(entityId) : null,
            details ? String(details) : null,
            ipAddress || null
        );
    } catch (error) {
        console.error("Failed to create admin log:", error);
    }
}

export async function getLogs({ page = 1, limit = 50, action, entity_type, admin_id, search, sort = "created_at", order = "desc" }) {
    const skip = (page - 1) * limit;

    // Build dynamic WHERE clause for admin_logs
    const conditions = [];
    const params = [];

    if (action) {
        conditions.push("al.action LIKE ?");
        params.push(`%${action}%`);
    }
    if (entity_type) {
        conditions.push("al.entity_type = ?");
        params.push(entity_type);
    }
    if (admin_id) {
        conditions.push("al.admin_id = ?");
        params.push(BigInt(admin_id));
    }
    if (search) {
        conditions.push("(al.action LIKE ? OR al.details LIKE ? OR al.entity_type LIKE ?)");
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    // Validate sort column to prevent SQL injection
    const allowedSortColumns = ["created_at", "action", "entity_type", "admin_id"];
    const safeSort = allowedSortColumns.includes(sort) ? sort : "created_at";
    const safeOrder = order === "asc" ? "ASC" : "DESC";

    // Count query
    const [countResult] = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*) as total FROM admin_logs al ${whereClause}`,
        ...params
    );
    const total = Number(countResult.total);

    // Data query with JOIN on users table
    const logs = await prisma.$queryRawUnsafe(
        `SELECT al.*, u.id as user_id, u.first_name as user_first_name, u.last_name as user_last_name, u.email as user_email 
         FROM admin_logs al 
         LEFT JOIN users u ON al.admin_id = u.id 
         ${whereClause} 
         ORDER BY al.${safeSort} ${safeOrder} 
         LIMIT ? OFFSET ?`,
        ...params,
        Number(limit),
        Number(skip)
    );

    // Transform logs to match expected format (with nested users object)
    const transformedLogs = logs.map(log => ({
        id: log.id,
        admin_id: log.admin_id,
        action: log.action,
        entity_type: log.entity_type,
        entity_id: log.entity_id,
        details: log.details,
        ip_address: log.ip_address,
        created_at: log.created_at,
        users: log.user_id ? {
            id: log.user_id,
            first_name: log.user_first_name,
            last_name: log.user_last_name,
            email: log.user_email
        } : null
    }));

    return serializeBigInt({ logs: transformedLogs, pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } });
}

// ==========================================
// SETTINGS
// ==========================================

export async function getSettings() {
    // Raw SQL for admin_settings (model not in Prisma schema)
    const settings = await prisma.$queryRawUnsafe(
        `SELECT setting_key, setting_value FROM admin_settings`
    );
    const result = {};
    for (const s of settings) {
        result[s.setting_key] = s.setting_value;
    }
    return result;
}

export async function updateSetting(key, value) {
    // Raw SQL UPSERT for admin_settings (model not in Prisma schema)
    const affectedRows = await prisma.$executeRawUnsafe(
        `UPDATE admin_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?`,
        value, key
    );

    if (affectedRows === 0) {
        await prisma.$executeRawUnsafe(
            `INSERT INTO admin_settings (setting_key, setting_value, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
            key, value
        );
    }

    const [setting] = await prisma.$queryRawUnsafe(
        `SELECT * FROM admin_settings WHERE setting_key = ?`,
        key
    );

    return serializeBigInt(setting);
}

export async function getDefaultSettings() {
    const defaults = {
        exchange_commission_rate: "10",
        withdrawal_fee: "5",
        delivery_price_per_km: "3",
        max_exchange_books: "5",
        exchange_expiration_days: "10",
        platform_name: "KitabiSwap",
        platform_email: "contact@kitabiswap.ma",
        platform_phone: "+212 5XX XX XX XX",
        platform_logo: "",
        platform_address: "Rabat, Maroc"
    };
    return defaults;
}

// ==========================================
// GLOBAL SEARCH
// ==========================================

export async function globalSearch(query) {
    if (!query || query.trim().length < 2) {
        return { results: [], total: 0 };
    }

    const searchTerm = query.trim();

    const [catalogBooks, users, orders, exchanges, deliveries, transactions, messages] = await Promise.all([
        prisma.books_catalog.findMany({
            where: {
                OR: [
                    { title: { contains: searchTerm } },
                    { author: { contains: searchTerm } },
                    { isbn: { contains: searchTerm } }
                ]
            },
            take: 10,
            select: { id: true, title: true, author: true, isbn: true, category: true }
        }),
        prisma.users.findMany({
            where: {
                OR: [
                    { first_name: { contains: searchTerm } },
                    { last_name: { contains: searchTerm } },
                    { email: { contains: searchTerm } },
                    { phone: { contains: searchTerm } }
                ]
            },
            take: 10,
            select: { id: true, first_name: true, last_name: true, email: true, role_id: true }
        }),
        prisma.book_orders.findMany({
            where: {
                users: {
                    OR: [
                        { first_name: { contains: searchTerm } },
                        { last_name: { contains: searchTerm } }
                    ]
                }
            },
            take: 10,
            select: { id: true, price: true, status: true, created_at: true, user_id: true }
        }),
        prisma.exchange_requests.findMany({
            where: {
                OR: [
                    { requester_books: { contains: searchTerm } },
                    { receiver_books: { contains: searchTerm } }
                ]
            },
            take: 10,
            select: { id: true, status: true, created_at: true }
        }),
        prisma.deliveries.findMany({
            where: {
                users: {
                    OR: [
                        { first_name: { contains: searchTerm } },
                        { last_name: { contains: searchTerm } }
                    ]
                }
            },
            take: 10,
            select: { id: true, status: true, total: true, created_at: true }
        }),
        prisma.wallet_transactions.findMany({
            where: {
                description: { contains: searchTerm }
            },
            take: 10,
            select: { id: true, transaction_type: true, amount: true, created_at: true }
        }),
        prisma.messages.findMany({
            where: { message: { contains: searchTerm } },
            take: 10,
            select: { id: true, message: true, is_read: true, created_at: true }
        })
    ]);

    return serializeBigInt({
        results: {
            catalog_books: catalogBooks,
            users,
            orders,
            exchanges,
            deliveries,
            transactions,
            messages
        },
        total: catalogBooks.length + users.length + orders.length + exchanges.length + deliveries.length + transactions.length + messages.length
    });
}

// ==========================================
// STATISTICS
// ==========================================

export async function getDetailedStats({ period = "month", start_date, end_date }) {
    let start, end;
    if (start_date && end_date) {
        start = new Date(start_date);
        end = new Date(end_date);
    } else {
        end = new Date();
        switch (period) {
            case "week":
                start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "year":
                start = new Date(end.getFullYear() - 1, end.getMonth(), 1);
                break;
            case "month":
            default:
                start = new Date(end.getFullYear(), end.getMonth() - 12, 1);
                break;
        }
    }

    // Registration timeline
    const registrations = await prisma.users.findMany({
        where: { created_at: { gte: start, lte: end } },
        select: { created_at: true, role_id: true },
        orderBy: { created_at: "asc" }
    });

    // Sales timeline
    const sales = await prisma.book_orders.findMany({
        where: { created_at: { gte: start, lte: end }, status: "valide" },
        select: { created_at: true, price: true }
    });

    // Exchange timeline
    const exchangeList = await prisma.exchange_requests.findMany({
        where: { created_at: { gte: start, lte: end } },
        select: { created_at: true, status: true }
    });

    // Delivery timeline
    const deliveryList = await prisma.deliveries.findMany({
        where: { created_at: { gte: start, lte: end } },
        select: { created_at: true, status: true, total: true }
    });

    // Top books
    const topBooks = await prisma.book_orders.groupBy({
        by: ["shop_inventory_id"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10
    });

    const topBookDetails = [];
    for (const tb of topBooks) {
        if (tb.shop_inventory_id) {
            const item = await prisma.shop_inventory.findUnique({
                where: { id: tb.shop_inventory_id },
                include: { books_catalog: { select: { title: true, author: true } } }
            });
            if (item) {
                topBookDetails.push({
                    title: item.books_catalog.title,
                    author: item.books_catalog.author,
                    sales_count: tb._count.id
                });
            }
        }
    }

    // Top users (by exchanges)
    const topUsers = await prisma.exchange_requests.groupBy({
        by: ["requester_id"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10
    });

    const topUserDetails = [];
    for (const tu of topUsers) {
        const user = await prisma.users.findUnique({
            where: { id: tu.requester_id },
            select: { id: true, first_name: true, last_name: true, email: true }
        });
        if (user) {
            topUserDetails.push({
                ...serializeBigInt(user),
                exchange_count: tu._count.id
            });
        }
    }

    // Top cities
    const topCities = await prisma.user_addresses.groupBy({
        by: ["city"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
        where: { city: { not: null } }
    });

    // Wallet timeline
    const walletTimeline = await prisma.wallet_transactions.findMany({
        where: { created_at: { gte: start, lte: end } },
        select: { created_at: true, transaction_type: true, amount: true }
    });

    return serializeBigInt({
        registrations: registrations.map(r => ({ date: r.created_at, role_id: r.role_id })),
        sales: sales.map(s => ({ date: s.created_at, price: Number(s.price) })),
        exchanges: exchangeList.map(e => ({ date: e.created_at, status: e.status })),
        deliveries: deliveryList.map(d => ({ date: d.created_at, status: d.status, total: Number(d.total) })),
        top_books: topBookDetails,
        top_users: topUserDetails,
        top_cities: topCities.map(c => ({ city: c.city, count: c._count.id })),
        wallet_transactions: walletTimeline.map(w => ({ date: w.created_at, type: w.transaction_type, amount: Number(w.amount) }))
    });
}

// ==========================================
// BACKUP
// ==========================================

export async function getBackupData() {
    const [
        users, roles, booksCatalog, shopInventory, userBooks,
        userBooksToSell, bookOrders, userCommandes, exchangeRequests,
        exchangeDeliveries, deliveries, wallets, walletTransactions,
        rechargeRequests, messages, addresses, favorites, bookSubmissions,
        bookImages, submissionImages, paymentMethods
    ] = await Promise.all([
        prisma.users.findMany({ take: 1000 }),
        prisma.roles.findMany(),
        prisma.books_catalog.findMany({ take: 1000 }),
        prisma.shop_inventory.findMany({ take: 1000 }),
        prisma.user_books.findMany({ take: 1000 }),
        prisma.user_books_to_sell.findMany({ take: 1000 }),
        prisma.book_orders.findMany({ take: 1000 }),
        prisma.user_commandes.findMany({ take: 1000 }),
        prisma.exchange_requests.findMany({ take: 1000 }),
        prisma.exchange_delivery.findMany({ take: 1000 }),
        prisma.deliveries.findMany({ take: 1000 }),
        prisma.wallets.findMany({ take: 1000 }),
        prisma.wallet_transactions.findMany({ take: 1000 }),
        prisma.wallet_recharge_requests.findMany({ take: 1000 }),
        prisma.messages.findMany({ take: 1000 }),
        prisma.user_addresses.findMany({ take: 1000 }),
        prisma.favorites.findMany({ take: 1000 }),
        prisma.book_submissions.findMany({ take: 1000 }),
        prisma.book_images.findMany({ take: 1000 }),
        prisma.book_submission_images.findMany({ take: 1000 }),
        prisma.payment_methods.findMany({ take: 100 })
    ]);

    return serializeBigInt({
        exported_at: new Date().toISOString(),
        data: {
            roles, users, books_catalog: booksCatalog, shop_inventory: shopInventory,
            user_books: userBooks, user_books_to_sell: userBooksToSell,
            book_orders: bookOrders, user_commandes: userCommandes,
            exchange_requests: exchangeRequests, exchange_delivery: exchangeDeliveries,
            deliveries, wallets, wallet_transactions: walletTransactions,
            wallet_recharge_requests: rechargeRequests, messages, user_addresses: addresses,
            favorites, book_submissions: bookSubmissions, book_images: bookImages,
            book_submission_images: submissionImages, payment_methods: paymentMethods
        }
    });
}
