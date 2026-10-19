import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serializeBigInt.js";

/**
 * ==========================================
 * ADMIN BOOK SERVICE
 * ==========================================
 */

export async function getCatalogBooks({ page = 1, limit = 20, search, category, language, is_active, sort = "created_at", order = "desc" }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (search) {
        where.OR = [
            { title: { contains: search } },
            { author: { contains: search } },
            { isbn: { contains: search } }
        ];
    }
    if (category) where.category = category;
    if (language) where.language = language;
    if (is_active !== undefined) where.is_active = is_active === "true" || is_active === true;

    const [books, total] = await Promise.all([
        prisma.books_catalog.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sort]: order },
            include: {
                book_images: { take: 1, where: { is_cover: true } },
                _count: {
                    select: {
                        shop_inventory: true,
                        user_books: true,
                        book_submissions: true,
                        user_books_to_sell: true
                    }
                }
            }
        }),
        prisma.books_catalog.count({ where })
    ]);

    return serializeBigInt({ books, pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } });
}

export async function getCatalogBookById(bookId) {
    const book = await prisma.books_catalog.findUnique({
        where: { id: BigInt(bookId) },
        include: {
            book_images: { orderBy: { sort_order: "asc" } },
            shop_inventory: true,
            _count: {
                select: {
                    shop_inventory: true,
                    user_books: true,
                    book_submissions: true,
                    user_books_to_sell: true
                }
            }
        }
    });
    if (!book) return null;
    return serializeBigInt(book);
}

export async function createCatalogBook(data) {
    const { uuid } = await import("uuid");
    const book = await prisma.books_catalog.create({
        data: {
            uuid: uuid(),
            isbn: data.isbn || null,
            title: data.title,
            subtitle: data.subtitle || null,
            author: data.author,
            publisher: data.publisher || null,
            edition: data.edition || null,
            publication_year: data.publication_year ? parseInt(data.publication_year) : null,
            language: data.language || "Français",
            category: data.category || null,
            book_type: data.book_type || "other",
            cover_type: data.cover_type || "paperback",
            target_audience: data.target_audience || "all",
            pages: data.pages ? parseInt(data.pages) : null,
            pages_color: data.pages_color || "black_white",
            dimensions: data.dimensions || null,
            weight: data.weight ? parseFloat(data.weight) : null,
            description: data.description || null,
            summary: data.summary || null,
            search_keywords: data.search_keywords || null,
            is_active: true
        }
    });
    return serializeBigInt(book);
}

export async function updateCatalogBook(bookId, data) {
    const book = await prisma.books_catalog.update({
        where: { id: BigInt(bookId) },
        data: {
            ...(data.title && { title: data.title }),
            ...(data.author && { author: data.author }),
            ...(data.isbn !== undefined && { isbn: data.isbn }),
            ...(data.category && { category: data.category }),
            ...(data.language && { language: data.language }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.summary !== undefined && { summary: data.summary }),
            ...(data.publisher !== undefined && { publisher: data.publisher }),
            ...(data.edition !== undefined && { edition: data.edition }),
            ...(data.publication_year !== undefined && { publication_year: data.publication_year ? parseInt(data.publication_year) : null }),
            ...(data.pages !== undefined && { pages: data.pages ? parseInt(data.pages) : null }),
            ...(data.is_active !== undefined && { is_active: data.is_active }),
            ...(data.search_keywords !== undefined && { search_keywords: data.search_keywords })
        }
    });
    return serializeBigInt(book);
}

export async function deleteCatalogBook(bookId) {
    await prisma.books_catalog.delete({ where: { id: BigInt(bookId) } });
    return { success: true };
}

export async function toggleBookActive(bookId) {
    const book = await prisma.books_catalog.findUnique({ where: { id: BigInt(bookId) } });
    if (!book) throw new Error("Livre introuvable");
    const updated = await prisma.books_catalog.update({
        where: { id: BigInt(bookId) },
        data: { is_active: !book.is_active }
    });
    return serializeBigInt(updated);
}

export async function getCatalogBookStats(bookId) {
    const bookIdBig = BigInt(bookId);
    const [salesShop, salesUser, exchanges, favorites, views] = await Promise.all([
        prisma.book_orders.count({
            where: {
                status: "valide",
                shop_inventory: { book_catalog_id: bookIdBig }
            }
        }),
        prisma.book_orders.count({
            where: {
                status: "valide",
                user_books_to_sell: { book_catalog_id: bookIdBig }
            }
        }),
        prisma.exchange_requests.count({
            where: {
                OR: [
                    { requester_books: { contains: String(bookId) } },
                    { receiver_books: { contains: String(bookId) } }
                ]
            }
        }),
        prisma.favorites.count({
            where: {
                OR: [
                    { shop_inventory: { book_catalog_id: bookIdBig } },
                    { user_book: { book_catalog_id: bookIdBig } },
                    { user_books_to_sell: { book_catalog_id: bookIdBig } }
                ]
            }
        }),
        prisma.books_catalog.findUnique({
            where: { id: bookIdBig },
            select: { total_views: true }
        })
    ]);

    return {
        sales: salesShop + salesUser,
        exchanges,
        favorites,
        total_views: views?.total_views || 0
    };
}

export async function getUserBooks({ page = 1, limit = 20, status, search, sort = "created_at", order = "desc" }) {
    const skip = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;
    if (search) {
        where.books_catalog = {
            OR: [
                { title: { contains: search } },
                { author: { contains: search } }
            ]
        };
    }

    const [books, total] = await Promise.all([
        prisma.user_books.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sort]: order },
            include: {
                books_catalog: { select: { title: true, author: true, isbn: true } },
                users: { select: { id: true, first_name: true, last_name: true, email: true } }
            }
        }),
        prisma.user_books.count({ where })
    ]);

    return serializeBigInt({ books, pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } });
}

export async function updateUserBook(userBookId, data) {
    const book = await prisma.user_books.update({
        where: { id: BigInt(userBookId) },
        data: {
            ...(data.status && { status: data.status }),
            ...(data.book_condition && { book_condition: data.book_condition }),
            ...(data.estimated_price !== undefined && { estimated_price: data.estimated_price ? parseFloat(data.estimated_price) : null }),
            ...(data.note !== undefined && { note: data.note }),
            ...(data.is_visible !== undefined && { is_visible: data.is_visible })
        }
    });
    return serializeBigInt(book);
}

export async function deleteUserBook(userBookId) {
    await prisma.user_books.delete({ where: { id: BigInt(userBookId) } });
    return { success: true };
}

export async function getInventory({ page = 1, limit = 20, status, search, sort = "created_at", order = "desc" }) {
    const skip = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;
    if (search) {
        where.books_catalog = {
            OR: [
                { title: { contains: search } },
                { author: { contains: search } }
            ]
        };
    }

    const [items, total] = await Promise.all([
        prisma.shop_inventory.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sort]: order },
            include: {
                books_catalog: { select: { id: true, title: true, author: true, isbn: true, category: true } }
            }
        }),
        prisma.shop_inventory.count({ where })
    ]);

    return serializeBigInt({ items, pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } });
}

export async function createInventoryItem(data) {
    const item = await prisma.shop_inventory.create({
        data: {
            book_catalog_id: BigInt(data.book_catalog_id),
            selling_price: parseFloat(data.selling_price),
            ...(data.old_price && { old_price: parseFloat(data.old_price) }),
            ...(data.stock_quantity && { stock_quantity: parseInt(data.stock_quantity) }),
            ...(data.min_stock_alert && { min_stock_alert: parseInt(data.min_stock_alert) }),
            ...(data.status && { status: data.status }),
            ...(data.featured !== undefined && { featured: data.featured })
        }
    });
    return serializeBigInt(item);
}

export async function updateInventoryItem(itemId, data) {
    const item = await prisma.shop_inventory.update({
        where: { id: BigInt(itemId) },
        data: {
            ...(data.selling_price && { selling_price: parseFloat(data.selling_price) }),
            ...(data.old_price !== undefined && { old_price: data.old_price ? parseFloat(data.old_price) : null }),
            ...(data.stock_quantity !== undefined && { stock_quantity: data.stock_quantity ? parseInt(data.stock_quantity) : 0 }),
            ...(data.min_stock_alert !== undefined && { min_stock_alert: data.min_stock_alert ? parseInt(data.min_stock_alert) : 5 }),
            ...(data.status && { status: data.status }),
            ...(data.featured !== undefined && { featured: data.featured })
        }
    });
    return serializeBigInt(item);
}

export async function deleteInventoryItem(itemId) {
    await prisma.shop_inventory.delete({ where: { id: BigInt(itemId) } });
    return { success: true };
}

