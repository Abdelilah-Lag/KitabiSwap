import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serializeBigInt.js";
import bcrypt from "bcrypt";

/**
 * ==========================================
 * ADMIN USER SERVICE
 * ==========================================
 */

export async function getUsers({ page = 1, limit = 20, search, role, status, city, sort = "created_at", order = "desc" }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (search) {
        where.OR = [
            { first_name: { contains: search } },
            { last_name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } }
        ];
    }
    if (role) {
        where.roles = { name: role };
    }
    if (status) {
        where.status = status;
    }
    if (city) {
        where.user_addresses = { some: { city: { contains: city } } };
    }

    const [users, total] = await Promise.all([
        prisma.users.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sort]: order },
            include: {
                roles: { select: { name: true } },
                wallets: { select: { balance: true, status: true } },
                user_addresses: { where: { is_default: true }, take: 1, select: { city: true, region: true } },
                _count: {
                    select: {
                        user_books: true,
                        exchange_requests_exchange_requests_requester_idTousers: true,
                        book_orders: true,
                        messages_messages_sender_idTousers: true
                    }
                }
            }
        }),
        prisma.users.count({ where })
    ]);

    return serializeBigInt({
        users,
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    });
}

export async function getUserById(userId) {
    const user = await prisma.users.findUnique({
        where: { id: BigInt(userId) },
        include: {
            roles: { select: { name: true, id: true } },
            wallets: {
                include: {
                    wallet_transactions: { orderBy: { created_at: "desc" }, take: 20 },
                    wallet_recharge_requests: { orderBy: { created_at: "desc" }, take: 10 }
                }
            },
            user_addresses: { where: { is_active: true } },
            user_books: {
                where: { status: { not: "hidden" } },
                include: { books_catalog: { select: { title: true, author: true } } },
                take: 20,
                orderBy: { created_at: "desc" }
            },
            book_orders: {
                take: 10,
                orderBy: { created_at: "desc" },
                include: {
                    shop_inventory: { include: { books_catalog: { select: { title: true } } } },
                    user_books_to_sell: { include: { books_catalog: { select: { title: true } } } }
                }
            },
            user_commandes: {
                take: 10,
                orderBy: { created_at: "desc" }
            },
            exchange_requests_exchange_requests_requester_idTousers: {
                take: 10,
                orderBy: { created_at: "desc" },
                include: {
                    users_exchange_requests_receiver_idTousers: { select: { first_name: true, last_name: true } }
                }
            },
            _count: {
                select: {
                    user_books: true,
                    book_orders: true,
                    exchange_requests_exchange_requests_requester_idTousers: true,
                    exchange_requests_exchange_requests_receiver_idTousers: true,
                    messages_messages_sender_idTousers: true,
                    messages_messages_receiver_idTousers: true,
                    deliveries: true
                }
            }
        }
    });

    if (!user) return null;
    return serializeBigInt(user);
}

export async function updateUser(userId, data) {
    const user = await prisma.users.update({
        where: { id: BigInt(userId) },
        data: {
            ...(data.first_name && { first_name: data.first_name }),
            ...(data.last_name && { last_name: data.last_name }),
            ...(data.email && { email: data.email }),
            ...(data.phone !== undefined && { phone: data.phone }),
            ...(data.status && { status: data.status })
        }
    });
    return serializeBigInt(user);
}

export async function toggleUserStatus(userId) {
    const user = await prisma.users.findUnique({ where: { id: BigInt(userId) } });
    if (!user) throw new Error("Utilisateur introuvable");

    const newStatus = user.status === "suspended" ? "active" : "suspended";
    const updated = await prisma.users.update({
        where: { id: BigInt(userId) },
        data: { status: newStatus }
    });
    return serializeBigInt(updated);
}

export async function deleteUser(userId) {
    await prisma.users.delete({ where: { id: BigInt(userId) } });
    return { success: true };
}

export async function resetUserPassword(userId, newPassword) {
    const password_hash = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
        where: { id: BigInt(userId) },
        data: { password_hash }
    });
    return { success: true };
}

export async function changeUserRole(userId, roleName) {
    const role = await prisma.roles.findUnique({ where: { name: roleName } });
    if (!role) throw new Error("Rôle introuvable");

    await prisma.users.update({
        where: { id: BigInt(userId) },
        data: { role_id: role.id }
    });
    return { success: true };
}

export async function getUserTransactions(userId) {
    const wallet = await prisma.wallets.findUnique({ where: { user_id: BigInt(userId) } });
    if (!wallet) return [];

    const transactions = await prisma.wallet_transactions.findMany({
        where: { wallet_id: wallet.id },
        orderBy: { created_at: "desc" },
        take: 50
    });
    return serializeBigInt(transactions);
}

export async function getUserMessages(userId) {
    const messages = await prisma.messages.findMany({
        where: {
            OR: [
                { sender_id: BigInt(userId) },
                { receiver_id: BigInt(userId) }
            ]
        },
        orderBy: { created_at: "desc" },
        take: 50,
        include: {
            users_messages_sender_idTousers: { select: { first_name: true, last_name: true } },
            users_messages_receiver_idTousers: { select: { first_name: true, last_name: true } }
        }
    });
    return serializeBigInt(messages);
}

export async function getUserDeliveries(userId) {
    const deliveries = await prisma.deliveries.findMany({
        where: {
            OR: [
                { delivery_person_id: BigInt(userId) },
                { book_orders: { user_id: BigInt(userId) } },
                { user_commandes: { user_id: BigInt(userId) } }
            ]
        },
        orderBy: { created_at: "desc" },
        take: 50,
        include: {
            book_orders: { include: { shop_inventory: { include: { books_catalog: { select: { title: true } } } } } },
            users: { select: { first_name: true, last_name: true, phone: true } }
        }
    });
    return serializeBigInt(deliveries);
}

