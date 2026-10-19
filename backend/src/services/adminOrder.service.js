import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serializeBigInt.js";

/**
 * ==========================================
 * ADMIN ORDER SERVICE
 * ==========================================
 */

export async function getBookOrders({ page = 1, limit = 20, status, payment_method, search, sort = "created_at", order = "desc" }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (payment_method) where.payment_method = payment_method;
    if (search) {
        where.users = {
            OR: [
                { first_name: { contains: search } },
                { last_name: { contains: search } },
                { email: { contains: search } }
            ]
        };
    }

    const [orders, total] = await Promise.all([
        prisma.book_orders.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sort]: order },
            include: {
                users: { select: { id: true, first_name: true, last_name: true, email: true, phone: true } },
                shop_inventory: { include: { books_catalog: { select: { title: true, author: true, isbn: true } } } },
                user_books_to_sell: { include: { books_catalog: { select: { title: true, author: true } } } },
                deliveries: { include: { users: { select: { first_name: true, last_name: true } } } }
            }
        }),
        prisma.book_orders.count({ where })
    ]);

    return serializeBigInt({ orders, pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } });
}

export async function getUserCommandes({ page = 1, limit = 20, order_status, payment_status, search, sort = "created_at", order = "desc" }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (order_status) where.order_status = order_status;
    if (payment_status) where.payment_status = payment_status;
    if (search) {
        where.users = {
            OR: [
                { first_name: { contains: search } },
                { last_name: { contains: search } },
                { email: { contains: search } }
            ]
        };
    }

    const [commandes, total] = await Promise.all([
        prisma.user_commandes.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sort]: order },
            include: {
                users: { select: { id: true, first_name: true, last_name: true, email: true, phone: true } },
                deliveries: { include: { users: { select: { first_name: true, last_name: true } } } }
            }
        }),
        prisma.user_commandes.count({ where })
    ]);

    return serializeBigInt({ commandes, pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } });
}

export async function getOrderById(orderId) {
    const order = await prisma.book_orders.findUnique({
        where: { id: BigInt(orderId) },
        include: {
            users: { select: { id: true, first_name: true, last_name: true, email: true, phone: true } },
            shop_inventory: { include: { books_catalog: { select: { title: true, author: true, isbn: true, category: true } } } },
            user_books_to_sell: { include: { books_catalog: { select: { title: true, author: true } }, users: { select: { first_name: true, last_name: true } } } },
            deliveries: { include: { users: { select: { first_name: true, last_name: true, phone: true } } } }
        }
    });
    if (!order) return null;
    return serializeBigInt(order);
}

export async function updateOrderStatus(orderId, status) {
    const order = await prisma.book_orders.update({
        where: { id: BigInt(orderId) },
        data: { status }
    });
    return serializeBigInt(order);
}

export async function cancelOrder(orderId) {
    const order = await prisma.book_orders.update({
        where: { id: BigInt(orderId) },
        data: { status: "refuse" }
    });
    return serializeBigInt(order);
}

export async function getExchanges({ page = 1, limit = 20, status, search, sort = "created_at", order = "desc" }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (search) {
        where.OR = [
            { users_exchange_requests_requester_idTousers: { first_name: { contains: search } } },
            { users_exchange_requests_requester_idTousers: { last_name: { contains: search } } },
            { users_exchange_requests_receiver_idTousers: { first_name: { contains: search } } },
            { users_exchange_requests_receiver_idTousers: { last_name: { contains: search } } }
        ];
    }

    const [exchanges, total] = await Promise.all([
        prisma.exchange_requests.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sort]: order },
            include: {
                users_exchange_requests_requester_idTousers: { select: { id: true, first_name: true, last_name: true, email: true, phone: true, avatar_url: true } },
                users_exchange_requests_receiver_idTousers: { select: { id: true, first_name: true, last_name: true, email: true, phone: true, avatar_url: true } },
                exchange_delivery: {
                    include: {
                        users: { select: { first_name: true, last_name: true } },
                        deliveries: true
                    }
                },
                exchange_chat: { orderBy: { created_at: "desc" }, take: 1 }
            }
        }),
        prisma.exchange_requests.count({ where })
    ]);

    return serializeBigInt({ exchanges, pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } });
}

export async function getExchangeById(exchangeId) {
    const exchange = await prisma.exchange_requests.findUnique({
        where: { id: BigInt(exchangeId) },
        include: {
            users_exchange_requests_requester_idTousers: { select: { id: true, first_name: true, last_name: true, email: true, phone: true, avatar_url: true } },
            users_exchange_requests_receiver_idTousers: { select: { id: true, first_name: true, last_name: true, email: true, phone: true, avatar_url: true } },
            exchange_delivery: {
                include: {
                    users: { select: { id: true, first_name: true, last_name: true, phone: true } },
                    deliveries: { include: { users: { select: { first_name: true, last_name: true } } } }
                }
            },
            exchange_chat: { orderBy: { created_at: "asc" }, include: { users: { select: { id: true, first_name: true, last_name: true, avatar_url: true } } } }
        }
    });
    if (!exchange) return null;
    return serializeBigInt(exchange);
}

export async function updateExchangeStatus(exchangeId, status) {
    const exchange = await prisma.exchange_requests.update({
        where: { id: BigInt(exchangeId) },
        data: { status }
    });
    return serializeBigInt(exchange);
}

export async function getDeliveries({ page = 1, limit = 20, status, delivery_person_id, search, sort = "created_at", order = "desc" }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (delivery_person_id) where.delivery_person_id = BigInt(delivery_person_id);
    if (search) {
        where.users = {
            OR: [
                { first_name: { contains: search } },
                { last_name: { contains: search } }
            ]
        };
    }

    const [deliveries, total] = await Promise.all([
        prisma.deliveries.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sort]: order },
            include: {
                users: { select: { id: true, first_name: true, last_name: true, phone: true, avatar_url: true } },
                book_orders: { include: { shop_inventory: { include: { books_catalog: { select: { title: true } } } } } },
                user_commandes: { select: { id: true, total_price: true, order_status: true } },
                exchange_delivery: { include: { exchange_requests: { select: { id: true, requester_books: true, receiver_books: true } } } }
            }
        }),
        prisma.deliveries.count({ where })
    ]);

    return serializeBigInt({ deliveries, pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } });
}

export async function getDeliveryPersons() {
    const deliveryRole = await prisma.roles.findUnique({ where: { name: "delivery" } });
    if (!deliveryRole) return [];

    const persons = await prisma.users.findMany({
        where: { role_id: deliveryRole.id, status: "active" },
        select: { id: true, first_name: true, last_name: true, phone: true, avatar_url: true }
    });
    return serializeBigInt(persons);
}

