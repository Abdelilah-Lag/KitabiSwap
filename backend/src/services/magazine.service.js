import prisma from "../config/prisma.js";

export async function getMagazineBooks(query) {

    const page = Number(query.page) || 1;

    const limit = 12;

    const skip = (page - 1) * limit;

    const search = query.search?.trim() || "";

    const rawCategory = query.category || "";

    const rawLanguage = query.language || "";

    const normalizeEnum = (v) => v && typeof v === 'string'
        ? v.trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_')
        : '';

    const category = normalizeEnum(rawCategory);
    const language = normalizeEnum(rawLanguage);

    const minPrice = query.minPrice
        ? Number(query.minPrice)
        : null;

    const maxPrice = query.maxPrice
        ? Number(query.maxPrice)
        : null;

    /* ==========================================
            BUILD WHERE
    ========================================== */

    const where = {

        status: "available",

        ...(minPrice !== null || maxPrice !== null
            ? {

                selling_price: {

                    ...(minPrice !== null
                        ? { gte: minPrice }
                        : {}),

                    ...(maxPrice !== null
                        ? { lte: maxPrice }
                        : {})

                }

            }
            : {}),


        books_catalog: {

            ...(category && {

                category

            }),

            ...(language && {

                language

            }),

            ...(search && {

                OR: [

                    {

                        title: {

                            contains: search

                        }

                    },

                    {

                        author: {

                            contains: search

                        }

                    }

                ]

            })

        }

    };

    /* ==========================================
            COUNT
    ========================================== */

    const totalBooks = await prisma.shop_inventory.count({

        where

    });

    const totalPages = Math.ceil(totalBooks / limit);

    /* ==========================================
            GET BOOKS
    ========================================== */

    const booksDB = await prisma.shop_inventory.findMany({

        where,

        skip,

        take: limit,

        orderBy: {

            created_at: "desc"

        },

        include: {

            books_catalog: {

                select: {

                    id: true,

                    isbn: true,

                    title: true,

                    subtitle: true,

                    author: true,

                    publisher: true,

                    publication_year: true,

                    edition: true,

                    language: true,

                    category: true,

                    pages: true,

                    description: true,

                    book_images: {

                        select: {

                            image_url: true,

                            uploaded_by: true,

                            is_cover: true

                        }

                    }

                }

            }

        }

    });
        /* ==========================================
            FORMAT DATA
    ========================================== */

    const books = booksDB.map(item => {

        const cover =

            item.books_catalog.book_images.find(image => image.uploaded_by === null && image.is_cover)

            || item.books_catalog.book_images.find(image => image.is_cover)

            || item.books_catalog.book_images[0];


        return {

            id: item.id?.toString(),

            title: item.books_catalog.title,

            author: item.books_catalog.author,

            cover: cover?.image_url,

            sellingPrice: item.selling_price?.toString(),

            oldPrice: item.old_price?.toString(),

            stock: item.stock_quantity

        };

    });

    /* ==========================================
            RETURN
    ========================================== */

    return {

        books,

        page,

        totalPages,

        totalBooks

    };

}