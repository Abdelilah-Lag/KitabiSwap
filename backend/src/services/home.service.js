import prisma from "../config/prisma.js";

export async function getHomePageData() {

    /* ==========================================
       EXCHANGE BOOKS
    ========================================== */

    const exchangeBooksDB = await prisma.user_books.findMany({

        where: {

            status: "available",

            is_visible: true

        },

        take: 8,

        orderBy: {

            created_at: "desc"

        },

        include: {

            users: true,

            books_catalog: {

                select: {

                    id: true,

                    title: true,

                    author: true,

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

    const exchangeBooks = exchangeBooksDB.map(book => {

        const userIdStr = book.user_id?.toString();

        const cover = book.books_catalog.book_images.find(image =>

            (image.uploaded_by !== null && image.uploaded_by?.toString() === userIdStr && image.is_cover) ||

            (image.uploaded_by === null && image.is_cover)

        );

        return {

            userBookId: book.id?.toString(),

            condition: book.book_condition,

            estimatedPrice: book.estimated_price?.toString(),

            user: {

                id: book.users.id?.toString(),

                name: `${book.users.first_name} ${book.users.last_name}`

            },

            book: {

                id: book.books_catalog.id?.toString(),

                title: book.books_catalog.title,

                author: book.books_catalog.author,

                cover: cover?.image_url

            }

        };

    });

    /* ==========================================
       MAGAZINE
    ========================================== */

    const magazineDB = await prisma.shop_inventory.findMany({

        where: {

            status: "available"

        },

        take: 8,

        orderBy: {

            created_at: "desc"

        },

        include: {

            books_catalog: {

                select: {

                    title: true,

                    author: true,

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

    const magazineBooks = magazineDB.map(item => {

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

    return {

        exchangeBooks,

        magazineBooks

    };

}