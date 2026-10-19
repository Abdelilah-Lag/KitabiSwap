import prisma from "../config/prisma.js";

/* ==========================================================
 * Helpers
 * ========================================================== */

function serializeBigInt(data) {
    return JSON.parse(
        JSON.stringify(data, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

function toNumberOrNull(value) {
    if (value === undefined || value === null || value === "") return null;
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
}

function toBooleanOrUndefined(value) {
    if (value === undefined || value === null || value === "") return undefined;
    if (value === true || value === "true" || value === 1 || value === "1") return true;
    if (value === false || value === "false" || value === 0 || value === "0") return false;
    return undefined;
}

/**
 * Only the enum column value "out_of_stock" is returned when the on-hand
 * quantity is strictly zero. `qty <= min_stock_alert` is a low-stock
 * ALERT flag (surfaced via the low_stock filter and the statistics), not a
 * status change — otherwise a book with 12 units and a 5-unit alert would
 * be marked out_of_stock, which is wrong.
 */
function computeAutoStatus(qty, requestedStatus) {
    const n = Number(qty);
    if (!Number.isFinite(n) || n <= 0) return "out_of_stock";
    return requestedStatus || "available";
}

function buildInventoryWhere(query) {
    const where = {};

    const q = String(query.q ?? "").trim();
    if (q) {
        where.books_catalog = {
            OR: [
                { title: { contains: q } },
                { author: { contains: q } },
                { isbn: { contains: q } },
                { category: { contains: q } }
            ]
        };
    }

    if (query.status) {
        where.status = String(query.status);
    }

    const featured = toBooleanOrUndefined(query.featured);
    if (featured !== undefined) {
        where.featured = featured;
    }

    // NOTE: low_stock (stock_quantity <= min_stock_alert) is a
    // column-to-column comparison that Prisma cannot express directly, so
    // we handle it in-memory in listInventory().  Do NOT add a broken
    // { stock_quantity: { lte: undefined } } clause here — Prisma throws
    // when it receives undefined comparison values.

    return where;
}

async function attachCover(rows) {
    if (!rows.length) return rows;

    const ids = rows.map((r) => BigInt(r.book_catalog_id));

    const covers = await prisma.book_images.findMany({
        where: {
            book_catalog_id: { in: ids },
            is_cover: true
        },
        orderBy: { sort_order: "asc" },
        select: {
            book_catalog_id: true,
            image_url: true,
            public_id: true
        }
    });

    const coverById = new Map();
    for (const c of covers) {
        const key = c.book_catalog_id.toString();
        if (!coverById.has(key)) {
            coverById.set(key, {
                image_url: c.image_url,
                public_id: c.public_id
            });
        }
    }

    return rows.map((r) => ({
        ...r,
        cover: coverById.get(String(r.book_catalog_id)) || null
    }));
}

function isLowStock(inventoryRow) {
    const qty = Number(inventoryRow.stock_quantity ?? 0);
    const min = Number(inventoryRow.min_stock_alert ?? 0);
    return qty <= min;
}

async function computeStats() {
    const all = await prisma.shop_inventory.findMany({
        select: {
            stock_quantity: true,
            min_stock_alert: true,
            selling_price: true,
            status: true,
            featured: true
        }
    });

    let lowStockCount = 0;
    let totalValue = 0;
    let availableCount = 0;
    let featuredCount = 0;

    for (const r of all) {
        const qty = Number(r.stock_quantity ?? 0);
        const min = Number(r.min_stock_alert ?? 0);
        if (qty <= min) lowStockCount++;

        totalValue += Number(r.selling_price ?? 0) * qty;

        if (r.status === "available") availableCount++;
        if (r.featured === true) featuredCount++;
    }

    return serializeBigInt({
        totalProducts: all.length,
        availableCount,
        lowStockCount,
        featuredCount,
        totalInventoryValue: Number(totalValue).toFixed(2)
    });
}

/* ==========================================================
 * SEARCH CATALOGUE
 * ========================================================== */

export async function searchCatalogue(query) {
    const page = Math.max(1, toNumberOrNull(query.page) ?? 1);
    const pageSize = Math.max(1, Math.min(25, toNumberOrNull(query.pageSize) ?? 10));
    const skip = (page - 1) * pageSize;

    const q = String(query.q ?? "").trim();
    if (!q) {
        return serializeBigInt({
            data: [],
            pagination: { page, pageSize, total: 0, totalPages: 0 }
        });
    }

    const category = query.category ? String(query.category) : undefined;

    const where = {
        is_active: true,
        OR: [
            { title: { contains: q } },
            { author: { contains: q } },
            { isbn: { contains: q } }
        ]
    };

    if (category) {
        where.category = category;
    }

    const [rows, total] = await Promise.all([
        prisma.books_catalog.findMany({
            where,
            orderBy: { created_at: "desc" },
            skip,
            take: pageSize,
            select: {
                id: true,
                isbn: true,
                title: true,
                author: true,
                category: true,
                book_images: {
                    where: { is_cover: true },
                    orderBy: { sort_order: "asc" },
                    take: 1,
                    select: { image_url: true, public_id: true }
                }
            }
        }),
        prisma.books_catalog.count({ where })
    ]);

    const data = rows.map((r) => ({
        id: r.id.toString(),
        isbn: r.isbn,
        title: r.title,
        author: r.author,
        category: r.category,
        cover: r.book_images?.[0]
            ? {
                image_url: r.book_images[0].image_url,
                public_id: r.book_images[0].public_id
            }
            : null
    }));

    return serializeBigInt({
        data,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        }
    });
}

/* ==========================================================
 * INVENTORY CRUD
 * ========================================================== */

export async function addToStock(payload) {
    const {
        book_catalog_id,
        selling_price,
        old_price,
        stock_quantity,
        min_stock_alert,
        featured,
        status
    } = payload || {};

    if (!book_catalog_id) {
        throw new Error("book_catalog_id manquant");
    }

    let catalogId;
    try {
        catalogId = BigInt(book_catalog_id);
    } catch {
        throw new Error("book_catalog_id invalide");
    }

    // shop_inventory.selling_price is NOT NULL — validate required.
    const selling = Number(selling_price);
    if (selling_price === undefined || selling_price === null || selling_price === "" || Number.isNaN(selling)) {
        throw new Error("selling_price obligatoire et invalide");
    }
    if (selling < 0) throw new Error("selling_price ne peut pas être négatif");

    const oldP =
        old_price === undefined || old_price === null || old_price === ""
            ? null
            : Number(old_price);
    if (oldP !== null && Number.isNaN(oldP)) throw new Error("old_price invalide");

    const qty =
        stock_quantity === undefined || stock_quantity === null || stock_quantity === ""
            ? 0
            : Number(stock_quantity);
    if (Number.isNaN(qty) || qty < 0) throw new Error("stock_quantity invalide");

    const min =
        min_stock_alert === undefined || min_stock_alert === null || min_stock_alert === ""
            ? 5
            : Number(min_stock_alert);
    if (Number.isNaN(min) || min < 0) throw new Error("min_stock_alert invalide");

    // Make sure the referenced catalog row exists so the FK does not blow up
    // with a raw prisma error.
    const catalogExists = await prisma.books_catalog.findUnique({
        where: { id: catalogId },
        select: { id: true }
    });
    if (!catalogExists) {
        throw new Error("Livre introuvable dans le catalogue");
    }

    // Enforce the natural key: one shop_inventory row per book_catalog_id.
    const existing = await prisma.shop_inventory.findFirst({
        where: { book_catalog_id: catalogId },
        select: { id: true }
    });
    if (existing) {
        throw new Error("Ce livre est déjà présent dans le stock — modifiez la ligne existante à la place.");
    }

    const computedStatus = computeAutoStatus(qty, status);

    const inv = await prisma.shop_inventory.create({
        data: {
            book_catalog_id: catalogId,
            selling_price: selling,
            old_price: oldP,
            stock_quantity: qty,
            min_stock_alert: min,
            featured: featured === true || featured === "true",
            status: computedStatus
        },
        include: {
            books_catalog: {
                select: { id: true, title: true, author: true, isbn: true, category: true }
            }
        }
    });

    return serializeBigInt({
        ...inv,
        id: inv.id.toString(),
        book_catalog_id: inv.book_catalog_id.toString()
    });
}

export async function updateInventory({ id, payload }) {
    const invId = BigInt(id);

    const current = await prisma.shop_inventory.findUnique({
        where: { id: invId },
        select: { stock_quantity: true, min_stock_alert: true, status: true }
    });
    if (!current) {
        throw new Error("Ligne d'inventaire introuvable");
    }

    const nextQty =
        payload.stock_quantity !== undefined
            ? Number(payload.stock_quantity)
            : Number(current.stock_quantity ?? 0);

    const requestedStatus =
        payload.status !== undefined ? String(payload.status) : current.status;
    const computedStatus = computeAutoStatus(nextQty, requestedStatus);

    const data = {
        selling_price:
            payload.selling_price !== undefined ? Number(payload.selling_price) : undefined,
        old_price:
            payload.old_price !== undefined
                ? payload.old_price === null || payload.old_price === ""
                    ? null
                    : Number(payload.old_price)
                : undefined,
        stock_quantity:
            payload.stock_quantity !== undefined
                ? Number(payload.stock_quantity)
                : undefined,
        min_stock_alert:
            payload.min_stock_alert !== undefined
                ? Number(payload.min_stock_alert)
                : undefined,
        featured:
            payload.featured !== undefined
                ? payload.featured === true || payload.featured === "true"
                : undefined,
        status: computedStatus
    };

    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    const updated = await prisma.shop_inventory.update({
        where: { id: invId },
        data,
        include: {
            books_catalog: {
                select: { id: true, title: true, author: true, isbn: true, category: true }
            }
        }
    });

    return serializeBigInt({
        ...updated,
        id: updated.id.toString(),
        book_catalog_id: updated.book_catalog_id.toString()
    });
}

export async function deleteInventory(id) {
    const invId = BigInt(id);
    await prisma.shop_inventory.delete({ where: { id: invId } });
    return { deleted: true };
}

export async function listInventory(query) {
    const page = Math.max(1, toNumberOrNull(query.page) ?? 1);
    const pageSize = Math.max(1, Math.min(100, toNumberOrNull(query.pageSize) ?? 25));
    const skip = (page - 1) * pageSize;

    const lowStock = toBooleanOrUndefined(query.low_stock);
    const where = buildInventoryWhere(query);

    // When low_stock is requested we can't page in SQL because the filter
    // is stock_quantity <= min_stock_alert (column-to-column).  Fetch all
    // matching rows, filter in-memory, then paginate.
    if (lowStock === true) {
        const allRows = await prisma.shop_inventory.findMany({
            where,
            orderBy: { updated_at: "desc" },
            include: {
                books_catalog: {
                    select: {
                        id: true,
                        title: true,
                        author: true,
                        isbn: true,
                        category: true
                    }
                }
            }
        });
        const filtered = allRows.filter(isLowStock);
        const total = filtered.length;
        const pageRows = filtered.slice(skip, skip + pageSize);

        const withCover = await attachCover(
            pageRows.map((r) => ({ ...r, book_catalog_id: r.book_catalog_id.toString() }))
        );

        const data = withCover.map((r) => ({
            id: r.id.toString(),
            book_catalog_id: r.book_catalog_id.toString(),
            selling_price: r.selling_price,
            old_price: r.old_price,
            stock_quantity: r.stock_quantity,
            min_stock_alert: r.min_stock_alert,
            featured: r.featured,
            status: r.status,
            cover: r.cover,
            books_catalog: r.books_catalog
        }));

        const stats = await computeStats();

        return serializeBigInt({
            data,
            statistics: stats,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    }

    const [rows, total] = await Promise.all([
        prisma.shop_inventory.findMany({
            where,
            orderBy: { updated_at: "desc" },
            skip,
            take: pageSize,
            include: {
                books_catalog: {
                    select: {
                        id: true,
                        title: true,
                        author: true,
                        isbn: true,
                        category: true
                    }
                }
            }
        }),
        prisma.shop_inventory.count({ where })
    ]);

    const withCover = await attachCover(
        rows.map((r) => ({ ...r, book_catalog_id: r.book_catalog_id.toString() }))
    );

    const data = withCover.map((r) => ({
        id: r.id.toString(),
        book_catalog_id: r.book_catalog_id.toString(),
        selling_price: r.selling_price,
        old_price: r.old_price,
        stock_quantity: r.stock_quantity,
        min_stock_alert: r.min_stock_alert,
        featured: r.featured,
        status: r.status,
        cover: r.cover,
        books_catalog: r.books_catalog
    }));

    const stats = await computeStats();

    return serializeBigInt({
        data,
        statistics: stats,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        }
    });
}
