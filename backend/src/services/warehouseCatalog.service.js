import prisma from "../config/prisma.js";

import {
    uploadToCloudinary,
    deleteFromCloudinary
} from "../utils/cloudinaryUpload.js";

/*
==========================================================
  BIGINT SERIALIZER
==========================================================
*/
function serializeBigInt(data) {
    return JSON.parse(
        JSON.stringify(
            data,
            (_, value) => typeof value === "bigint" ? value.toString() : value
        )
    );
}

function toNumberOrNull(value) {
    if (value === undefined || value === null || value === "") return null;
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
}

/*
==========================================================
  USED COUNT
  (book_submissions + shop_inventory + user_books + user_books_to_sell)
==========================================================
*/
async function getUsedCount(bookCatalogId) {
    const bookId = BigInt(bookCatalogId);

    const [
        submissionsCount,
        inventoryCount,
        userBooksCount,
        userBooksToSellCount
    ] = await Promise.all([
        prisma.book_submissions.count({
            where: { book_catalog_id: bookId }
        }),
        prisma.shop_inventory.count({
            where: { book_catalog_id: bookId }
        }),
        prisma.user_books.count({
            where: { book_catalog_id: bookId }
        }),
        prisma.user_books_to_sell.count({
            where: { book_catalog_id: bookId }
        })
    ]);

    return Number(submissionsCount) +
        Number(inventoryCount) +
        Number(userBooksCount) +
        Number(userBooksToSellCount);
}

function buildWhereFromQuery(query) {
    const where = {
        is_active: query.is_active !== undefined ? query.is_active === "true" : undefined
    };

    // Remove undefined keys
    Object.keys(where).forEach((k) => {
        if (where[k] === undefined) delete where[k];
    });

    const q = String(query.q ?? "").trim();
    if (q) {
        where.OR = [
            { title: { contains: q } },
            { author: { contains: q } },
            { isbn: { contains: q } },
            { publisher: { contains: q } },
            { search_keywords: { contains: q } }
        ];
    }

    if (query.category) where.category = String(query.category);
    if (query.language) where.language = String(query.language);
    if (query.audience) where.target_audience = String(query.audience);
    if (query.book_type) where.book_type = String(query.book_type);

    if (query.publisher) where.publisher = String(query.publisher);

    if (query.publication_year) {
        const y = toNumberOrNull(query.publication_year);
        if (y !== null) where.publication_year = y;
    }

    return where;
}

async function attachCoverAndUsedCount(rows) {
    const ids = rows.map(r => r.id);

    // covers
    const covers = await prisma.book_images.findMany({
        where: {
            book_catalog_id: { in: ids.map(x => BigInt(x)) },
            is_cover: true
        },
        orderBy: { sort_order: "asc" },
        select: {
            book_catalog_id: true,
            image_url: true,
            public_id: true,
            id: true,
            sort_order: true
        }
    });

    const coverByCatalogId = new Map();
    for (const c of covers) {
        const key = c.book_catalog_id.toString();
        if (!coverByCatalogId.has(key)) {
            coverByCatalogId.set(key, {
                id: c.id.toString(),
                image_url: c.image_url,
                public_id: c.public_id,
                sort_order: c.sort_order
            });
        }
    }

    // used_count: per id (simple; can be optimized later)
    const usedCounts = await Promise.all(ids.map(id => getUsedCount(id)));

    return rows.map((r, idx) => {
        const cover = coverByCatalogId.get(r.id.toString()) || null;
        return {
            ...r,
            cover,
            used_count: usedCounts[idx]
        };
    });
}

/*
==========================================================
  CRUD
==========================================================
*/
export async function listCatalogue(query) {
    const page = Math.max(1, toNumberOrNull(query.page) ?? 1);
    const pageSize = Math.max(1, Math.min(100, toNumberOrNull(query.pageSize) ?? 25));
    const skip = (page - 1) * pageSize;

    const where = buildWhereFromQuery(query);

    const rows = await prisma.books_catalog.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: pageSize,
        select: {
            id: true,
            uuid: true,
            isbn: true,
            title: true,
            subtitle: true,
            author: true,
            publisher: true,
            edition: true,
            publication_year: true,
            language: true,
            category: true,
            pages: true,
            weight: true,
            dimensions: true,
            search_keywords: true,
            average_rating: true,
            total_reviews: true,
            total_views: true,
            book_type: true,
            cover_type: true,
            target_audience: true,
            is_active: true,
            created_at: true,
            updated_at: true
        }
    });

    const total = await prisma.books_catalog.count({ where });

    const withComputed = await attachCoverAndUsedCount(rows);

    return serializeBigInt({
        data: withComputed,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        }
    });
}

export async function createBookService({ payload, files }) {
    const data = {
        uuid: payload.uuid || undefined,
        isbn: payload.isbn || null,
        title: payload.title,
        subtitle: payload.subtitle || null,
        author: payload.author,
        publisher: payload.publisher || null,
        edition: payload.edition || null,
        publication_year: toNumberOrNull(payload.publication_year),
        language: payload.language || null,
        category: payload.category || null,
        book_type: payload.book_type || undefined,
        cover_type: payload.cover_type || undefined,
        target_audience: payload.target_audience || undefined,
        pages: toNumberOrNull(payload.pages),
        weight: payload.weight ? Number(payload.weight) : null,
        dimensions: payload.dimensions || null,
        description: payload.description || null,
        summary: payload.summary || null,
        search_keywords: payload.search_keywords || null,
        average_rating: payload.average_rating !== undefined ? Number(payload.average_rating) : undefined,
        total_reviews: payload.total_reviews !== undefined ? Number(payload.total_reviews) : undefined,
        total_views: payload.total_views !== undefined ? Number(payload.total_views) : undefined,
        is_active: payload.is_active !== undefined ? (payload.is_active === "true" || payload.is_active === true) : true
    };

    // uuid
    if (!data.uuid) {
        // prisma schema has uuid unique but no default; create required
        data.uuid = (await import("crypto")).randomUUID();
    }

    const created = await prisma.books_catalog.create({
        data
    });

    const inserted = await prisma.books_catalog.findUnique({
        where: { id: created.id },
        select: {
            id: true,
            uuid: true,
            isbn: true,
            title: true,
            subtitle: true,
            author: true,
            publisher: true,
            edition: true,
            publication_year: true,
            language: true,
            category: true,
            pages: true,
            weight: true,
            dimensions: true,
            description: true,
            summary: true,
            search_keywords: true,
            average_rating: true,
            total_reviews: true,
            total_views: true,
            is_active: true,
            created_at: true,
            updated_at: true
        }
    });

    // Cover handling: we use first file as cover
    if (files && files.length > 0) {
        const coverIndex = 0;
        for (let i = 0; i < files.length; i++) {
            const f = files[i];
            const uploaded = await uploadToCloudinary(
                f.buffer,
                "kitabiswap/book_images"
            );

            await prisma.book_images.create({
                data: {
                    book_catalog_id: created.id,
                    image_url: uploaded.url,
                    public_id: uploaded.public_id,
                    // formulaire catalogue (warehouse) => image officielle
                    image_source: "official",
                    is_cover: Number(i) === Number(coverIndex),
                    sort_order: i + 1
                }
            });

            // only first file as cover by default; others as non-cover
        }
    }

    const result = await getBookService(created.id.toString());
    return result;
}

export async function getBookService(id) {
    const bookId = BigInt(id);

    const row = await prisma.books_catalog.findUnique({
        where: { id: bookId },
        include: {
            book_images: {
                orderBy: { sort_order: "asc" },
                select: {
                    id: true,
                    image_url: true,
                    public_id: true,
                    is_cover: true,
                    sort_order: true,
                    created_at: true
                }
            }
        }
    });

    if (!row) return null;

    const used_count = await getUsedCount(id);

    return serializeBigInt({
        ...row,
        used_count,
        images: row.book_images,
        cover: row.book_images.find(img => img.is_cover) || null
    });
}

export async function updateBookService({ id, payload }) {
    const bookId = BigInt(id);

    const data = {
        isbn: payload.isbn !== undefined ? (payload.isbn || null) : undefined,
        title: payload.title !== undefined ? payload.title : undefined,
        subtitle: payload.subtitle !== undefined ? (payload.subtitle || null) : undefined,
        author: payload.author !== undefined ? payload.author : undefined,
        publisher: payload.publisher !== undefined ? (payload.publisher || null) : undefined,
        edition: payload.edition !== undefined ? (payload.edition || null) : undefined,
        publication_year: payload.publication_year !== undefined ? toNumberOrNull(payload.publication_year) : undefined,
        language: payload.language !== undefined ? (payload.language || null) : undefined,
        category: payload.category !== undefined ? (payload.category || null) : undefined,
        pages: payload.pages !== undefined ? toNumberOrNull(payload.pages) : undefined,
        dimensions: payload.dimensions !== undefined ? (payload.dimensions || null) : undefined,
        weight: payload.weight !== undefined ? (payload.weight ? Number(payload.weight) : null) : undefined,
        description: payload.description !== undefined ? (payload.description || null) : undefined,
        summary: payload.summary !== undefined ? (payload.summary || null) : undefined,
        search_keywords: payload.search_keywords !== undefined ? (payload.search_keywords || null) : undefined,
        book_type: payload.book_type !== undefined ? payload.book_type : undefined,
        cover_type: payload.cover_type !== undefined ? payload.cover_type : undefined,
        target_audience: payload.target_audience !== undefined ? payload.target_audience : undefined,
        average_rating: payload.average_rating !== undefined ? Number(payload.average_rating) : undefined,
        total_reviews: payload.total_reviews !== undefined ? Number(payload.total_reviews) : undefined,
        total_views: payload.total_views !== undefined ? Number(payload.total_views) : undefined,
        is_active: payload.is_active !== undefined ? (payload.is_active === "true" || payload.is_active === true) : undefined
    };

    // Remove undefined
    Object.keys(data).forEach((k) => {
        if (data[k] === undefined) delete data[k];
    });

    await prisma.books_catalog.update({
        where: { id: bookId },
        data
    });

    return await getBookService(id);
}

export async function deleteBookService(id) {
    const bookId = BigInt(id);

    const images = await prisma.book_images.findMany({
        where: { book_catalog_id: bookId },
        select: { public_id: true }
    });

    for (const img of images) {
        if (img.public_id) {
            await deleteFromCloudinary(img.public_id);
        }
    }

    await prisma.books_catalog.delete({
        where: { id: bookId }
    });

    return { deleted: true };
}

export async function uploadBookImagesService({ id, files, body }) {
    const bookId = BigInt(id);

    if (!files || files.length === 0) {
        throw new Error("Aucune image reçue.");
    }

    // If body.cover_index provided, set one of them as cover
    const coverIndex = body?.cover_index !== undefined
        ? Number(body.cover_index)
        : null;

    let maxSort = await prisma.book_images.aggregate({
        where: { book_catalog_id: bookId },
        _max: { sort_order: true }
    });

    let currentSort = (maxSort?._max?.sort_order ?? 0) + 1;

    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const uploaded = await uploadToCloudinary(
            f.buffer,
            "kitabiswap/book_images"
        );

        const is_cover = coverIndex !== null ? (i === coverIndex) : false;

        await prisma.book_images.create({
                data: {
                    book_catalog_id: bookId,
                    image_url: uploaded.url,
                    public_id: uploaded.public_id,
                    // ajout images depuis formulaire catalogue => officielles
                    image_source: "official",
                    is_cover,
                    sort_order: currentSort++
                }
            });
    }

    // If we uploaded a cover, ensure only one cover remains true.
    if (coverIndex !== null) {
        const createdCount = await prisma.book_images.updateMany({
            where: { book_catalog_id: bookId },
            data: { is_cover: false }
        });

        // set cover for the newly inserted (approx: use latest images)
        const newest = await prisma.book_images.findMany({
            where: { book_catalog_id: bookId },
            orderBy: { created_at: "desc" },
            take: files.length
        });
        const coverRow = newest[coverIndex];
        if (coverRow) {
            await prisma.book_images.update({
                where: { id: coverRow.id },
                data: { is_cover: true }
            });
        }
    }

    return await getBookService(id);
}

export async function deleteBookImageService(imageId) {
    const image = await prisma.book_images.findUnique({
        where: { id: BigInt(imageId) },
        select: { public_id: true, book_catalog_id: true }
    });

    if (!image) {
        throw new Error("Image introuvable.");
    }

    if (image.public_id) {
        await deleteFromCloudinary(image.public_id);
    }

    await prisma.book_images.delete({
        where: { id: BigInt(imageId) }
    });

    // If removed cover, pick next cover
    const remainingCovers = await prisma.book_images.findMany({
        where: {
            book_catalog_id: image.book_catalog_id,
            is_cover: true
        }
    });

    if (remainingCovers.length === 0) {
        const next = await prisma.book_images.findFirst({
            where: { book_catalog_id: image.book_catalog_id },
            orderBy: { sort_order: "asc" }
        });
        if (next) {
            await prisma.book_images.update({
                where: { id: next.id },
                data: { is_cover: true }
            });
        }
    }

    return { deleted: true };
}

