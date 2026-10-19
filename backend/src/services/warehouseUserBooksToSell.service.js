import prisma from "../config/prisma.js";

import {
    serializeBigInt
} from "../utils/serializeBigInt.js";

/*
==========================================================
LIST USER BOOKS TO SELL
==========================================================
*/

export async function listUserBooksToSellService({

    page = 1,

    pageSize = 25,

    q = "",

    status,

    condition

}) {

    const where = {};

    /*
    =====================================
    STATUS
    =====================================
    */

    if (status) {

        where.status = status;

    }

    /*
    =====================================
    BOOK CONDITION
    =====================================
    */

    if (condition) {

        where.book_condition = condition;

    }

    /*
    =====================================
    SEARCH
    =====================================
    */

    if (q && q.trim()) {

        where.OR = [

            {
                books_catalog: {
                    title: {
                        contains: q,
                        mode: "insensitive"
                    }
                }
            },

            {
                books_catalog: {
                    author: {
                        contains: q,
                        mode: "insensitive"
                    }
                }
            },

            {
                books_catalog: {
                    isbn: {
                        contains: q,
                        mode: "insensitive"
                    }
                }
            },

            {
                users: {
                    first_name: {
                        contains: q,
                        mode: "insensitive"
                    }
                }
            },

            {
                users: {
                    last_name: {
                        contains: q,
                        mode: "insensitive"
                    }
                }
            }

        ];

    }
        /*
    =====================================
    TOTAL
    =====================================
    */

    const total = await prisma.user_books_to_sell.count({

        where

    });

    /*
    =====================================
    USER BOOKS
    =====================================
    */

    const rows = await prisma.user_books_to_sell.findMany({

        where,

        skip: (page - 1) * pageSize,

        take: Number(pageSize),

        orderBy: {

            created_at: "desc"

        },

        include: {

            users: {

                select: {

                    id: true,

                    first_name: true,

                    last_name: true,

                    email: true,

                    phone: true

                }

            },

            books_catalog: {

                include: {

                    book_images: {

                        where: {

                            is_cover: true

                        },

                        take: 1

                    }

                }

            }

        }

    });

    /*
    =====================================
    FORMAT RESPONSE
    =====================================
    */

    const data = rows.map((row) => ({

        id: row.id,

        price: row.price,

        status: row.status,

        book_condition: row.book_condition,

        note: row.note,

        created_at: row.created_at,

        updated_at: row.updated_at,

        user: row.users,

        book: {

            id: row.books_catalog.id,

            isbn: row.books_catalog.isbn,

            title: row.books_catalog.title,

            author: row.books_catalog.author,

            publisher: row.books_catalog.publisher,

            category: row.books_catalog.category,

            language: row.books_catalog.language,

            image:

                row.books_catalog.book_images.length > 0

                    ? row.books_catalog.book_images[0].image_url

                    : null

        }

    }));

    /*
    =====================================
    RETURN
    =====================================
    */

    return serializeBigInt({

        data,

        pagination: {

            page: Number(page),

            pageSize: Number(pageSize),

            total,

            totalPages: Math.ceil(total / pageSize)

        }

    });

}
/*
==========================================================
GET USER BOOK TO SELL DETAILS
==========================================================
*/

export async function getUserBookToSellDetailsService(id) {

    const book = await prisma.user_books_to_sell.findUnique({

        where: {

            id: BigInt(id)

        },

        include: {

            users: {

                select: {

                    id: true,

                    first_name: true,

                    last_name: true,

                    email: true,

                    phone: true

                }

            },

            books_catalog: {

                include: {

                    book_images: {

                        orderBy: {

                            sort_order: "asc"

                        }

                    }

                }

            }

        }

    });

    if (!book) {

        throw new Error("Livre introuvable.");

    }

    return serializeBigInt(book);

}
/*
==========================================================
DELETE USER BOOK TO SELL
==========================================================
*/

export async function deleteUserBookToSellService(id) {

    const book = await prisma.user_books_to_sell.findUnique({

        where: {

            id: BigInt(id)

        }

    });

    if (!book) {

        throw new Error("Livre introuvable.");

    }

    await prisma.user_books_to_sell.delete({

        where: {

            id: BigInt(id)

        }

    });

    return {

        success: true,

        message: "Livre supprimé avec succès."

    };

}