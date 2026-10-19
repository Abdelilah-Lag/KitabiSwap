import prisma from "../config/prisma.js";

export async function getBookDetails(type, id) {

    /* ==========================================
       EXCHANGE BOOK
    ========================================== */

    if (type === "exchange") {

        const userBook = await prisma.user_books.findUnique({

            where: {

                id: Number(id)

            },

            include: {

                users: true,

                books_catalog: {

                    include: {

                        book_images: true

                    }

                }

            }

        });

        if (!userBook) {

            return null;

        }

        const images = userBook.books_catalog.book_images
            .filter(image => image.uploaded_by === userBook.user_id)
            .map(image => image.image_url);

        const cover =

            userBook.books_catalog.book_images.find(image =>

                image.uploaded_by === userBook.user_id &&
                image.is_cover

            ) ||

            userBook.books_catalog.book_images.find(image =>

                image.uploaded_by === null &&
                image.is_cover

            );

        return {

            type: "exchange",

            owner: {

                id: userBook.users.id ? userBook.users.id.toString() : null,

                name:

                    `${userBook.users.first_name} ${userBook.users.last_name}`

            },

            condition: userBook.book_condition,

            estimatedPrice: userBook.estimated_price,

            book: {

                id: userBook.books_catalog.id
                    ? userBook.books_catalog.id.toString()
                    : null,

                isbn: userBook.books_catalog.isbn
                    ? userBook.books_catalog.isbn.toString()
                    : null,

                title: userBook.books_catalog.title,

                subtitle: userBook.books_catalog.subtitle,

                author: userBook.books_catalog.author,

                publisher: userBook.books_catalog.publisher,

                edition: userBook.books_catalog.edition,

                publicationYear:

                    userBook.books_catalog.publication_year,

                language: userBook.books_catalog.language,

                category: userBook.books_catalog.category,

                pages: userBook.books_catalog.pages
                    ? Number(userBook.books_catalog.pages)
                    : null,

                description:

                    userBook.books_catalog.description,

                summary:

                    userBook.books_catalog.summary,

                cover: cover?.image_url,

                images

            }

        };

    }

    /* ==========================================
       MAGAZINE BOOK
    ========================================== */

    if (type === "magazine") {

        const magazineBook = await prisma.shop_inventory.findUnique({

            where: {

                id: Number(id)

            },

            include: {

                books_catalog: {

                    include: {

                        book_images: true

                    }

                }

            }

        });

        if (!magazineBook) {

            return null;

        }

        const images =

            magazineBook.books_catalog.book_images

            .filter(image =>

                image.uploaded_by === null

            )

            .map(image => image.image_url);

        const cover =

            magazineBook.books_catalog.book_images.find(image =>

                image.uploaded_by === null &&
                image.is_cover

            );

        return {

            type: "magazine",

            sellingPrice: magazineBook.selling_price,

            oldPrice: magazineBook.old_price,

            stock: magazineBook.stock_quantity,

            book: {

                id: magazineBook.books_catalog.id
                    ? magazineBook.books_catalog.id.toString()
                    : null,

                isbn: magazineBook.books_catalog.isbn
                    ? magazineBook.books_catalog.isbn.toString()
                    : null,

                title: magazineBook.books_catalog.title,

                subtitle: magazineBook.books_catalog.subtitle,

                author: magazineBook.books_catalog.author,

                publisher: magazineBook.books_catalog.publisher,

                edition: magazineBook.books_catalog.edition,

                publicationYear:

                    magazineBook.books_catalog.publication_year,

                language: magazineBook.books_catalog.language,

                category: magazineBook.books_catalog.category,

                pages: magazineBook.books_catalog.pages
                    ? Number(magazineBook.books_catalog.pages)
                    : null,

                description:

                    magazineBook.books_catalog.description,

                summary:

                    magazineBook.books_catalog.summary,

                cover: cover?.image_url,

                images

            }

        };

    }

    return null;

}