import prisma from "../config/prisma.js";

/*
==========================================================
GET ALL BOOKS OF CONNECTED USER
==========================================================
*/

export async function getMyBooksService(userId) {

    /*
    ==========================================================
    BOOK SUBMISSIONS
    ==========================================================
    */

    const submissions = await prisma.book_submissions.findMany({

        where: {
            user_id: BigInt(userId)
        },

        include: {

            book_submission_images: {

                orderBy: {
                    sort_order: "asc"
                }

            },

            books_catalog: {

                include: {

                    book_images: {

                        where: {
                            
                            uploaded_by: BigInt(userId),
                            is_cover: true
                        },

                        orderBy: {
                            sort_order: "asc"
                        },

                        take: 1

                    }

                }

            }

        },

        orderBy: {

            created_at: "desc"

        }

    });

    /*
    ==========================================================
    FORMAT SUBMISSIONS
    ==========================================================
    */

    const formattedSubmissions = submissions.map((book) => ({

        id: Number(book.id),

        type: "submission",

        request_type: book.request_type,

        status: book.status,

        title: book.title,

        subtitle: book.subtitle,

        author: book.author,

        isbn: book.isbn,

        publisher: book.publisher,

        edition: book.edition,

        publication_year: book.publication_year,

        language: book.language,

        category: book.category,

        pages: book.pages,

        description: book.description,

        summary: book.summary,

        condition: book.book_condition,

        estimated_price: book.estimated_price
            ? Number(book.estimated_price)
            : null,

        price: book.price
            ? Number(book.price)
            : null,

        created_at: book.created_at,

        updated_at: book.updated_at,

        images: book.book_submission_images.map(image => ({
            id: Number(image.id),
            url: image.image_url,
            cover: image.is_cover
        })),

        cover:
            book.book_submission_images?.length > 0
                ? (book.book_submission_images.find(img => img.is_cover)?.image_url || book.book_submission_images[0].image_url)
                : null,

        catalog: book.books_catalog
            ? {

                id: Number(book.books_catalog.id),

                title: book.books_catalog.title,

                author: book.books_catalog.author,

                isbn: book.books_catalog.isbn,

                category: book.books_catalog.category,

                cover:

                    book.books_catalog.book_images.length > 0
                        ? book.books_catalog.book_images[0].image_url
                        : null

            }

            : null

    }));
        /*
    ==========================================================
    USER BOOKS (EXCHANGE LIBRARY)
    ==========================================================
    */

    const libraryBooks = await prisma.user_books.findMany({

        where: {
            user_id: BigInt(userId)
        },

        include: {

            books_catalog: {

                include: {

                    book_images: {

                        where: {
                            uploaded_by: BigInt(userId),
                            is_cover: true
                        },

                        orderBy: {
                            sort_order: "asc"
                        },

                        take: 1

                    }

                }

            }

        },

        orderBy: {

            created_at: "desc"

        }

    });

    /*
    ==========================================================
    FORMAT USER BOOKS
    ==========================================================
    */

    const formattedLibrary = libraryBooks.map((book) => ({

        id: Number(book.id),

        type: "exchange",

        status: book.status,
        visible: book.is_visible,
        condition: book.book_condition,
        cover: book.books_catalog.book_images.find(img => img.is_cover)?.image_url || (book.books_catalog.book_images[0] ? book.books_catalog.book_images[0].image_url : null),

        estimated_price: book.estimated_price
            ? Number(book.estimated_price)
            : null,

        exchange_count: book.exchange_count,

        note: book.note,

        created_at: book.created_at,

        updated_at: book.updated_at,

        catalog: {

            id: Number(book.books_catalog.id),

            isbn: book.books_catalog.isbn,

            title: book.books_catalog.title,

            subtitle: book.books_catalog.subtitle,

            author: book.books_catalog.author,

            publisher: book.books_catalog.publisher,

            edition: book.books_catalog.edition,

            publication_year: book.books_catalog.publication_year,

            language: book.books_catalog.language,

            category: book.books_catalog.category,

            book_type: book.books_catalog.book_type,

            cover_type: book.books_catalog.cover_type,

            target_audience: book.books_catalog.target_audience,

            pages: book.books_catalog.pages,

            description: book.books_catalog.description,

            summary: book.books_catalog.summary,

            average_rating: book.books_catalog.average_rating
                ? Number(book.books_catalog.average_rating)
                : 0,

            images: book.books_catalog.book_images.map(image => ({

                id: Number(image.id),

                url: image.image_url,

                cover: image.is_cover

            }))

        }

    }));
        /*
    ==========================================================
    USER BOOKS TO SELL
    ==========================================================
    */

    const sellingBooks = await prisma.user_books_to_sell.findMany({

        where: {
            user_id: BigInt(userId)
        },

        include: {

            books_catalog: {

                include: {

                    book_images: {

                        where: {
                            uploaded_by: BigInt(userId),
                            is_cover: true
                        },

                        orderBy: {
                            sort_order: "asc"
                        }


                    }


                }

            }

        },

        orderBy: {

            created_at: "desc"

        }

    });

    /*
    ==========================================================
    FORMAT SELLING BOOKS
    ==========================================================
    */

    const formattedSelling = sellingBooks.map((book) => ({

        id: Number(book.id),

        type: "sell",
        status: book.status,
        condition: book.book_condition,
        cover: book.books_catalog.book_images.find(img => img.is_cover)?.image_url || (book.books_catalog.book_images[0] ? book.books_catalog.book_images[0].image_url : null),

        price: Number(book.price),

        note: book.note,

        created_at: book.created_at,

        updated_at: book.updated_at,

        catalog: {

            id: Number(book.books_catalog.id),

            isbn: book.books_catalog.isbn,

            title: book.books_catalog.title,

            subtitle: book.books_catalog.subtitle,

            author: book.books_catalog.author,

            publisher: book.books_catalog.publisher,

            edition: book.books_catalog.edition,

            publication_year: book.books_catalog.publication_year,

            language: book.books_catalog.language,

            category: book.books_catalog.category,

            book_type: book.books_catalog.book_type,

            cover_type: book.books_catalog.cover_type,

            target_audience: book.books_catalog.target_audience,

            pages: book.books_catalog.pages,

            description: book.books_catalog.description,

            summary: book.books_catalog.summary,

            average_rating: book.books_catalog.average_rating
                ? Number(book.books_catalog.average_rating)
                : 0,

            images: book.books_catalog.book_images.map(image => ({

                id: Number(image.id),

                url: image.image_url,

                cover: image.is_cover

            }))

        }

    }));
        /*
    ==========================================================
    RETURN DATA
    ==========================================================
    */

    return {

        submissions: formattedSubmissions,

        library: formattedLibrary,

        selling: formattedSelling,

        statistics: {

            submissions: formattedSubmissions.length,

            library: formattedLibrary.length,

            selling: formattedSelling.length,

            total:

                formattedSubmissions.length +
                formattedLibrary.length +
                formattedSelling.length

        }

    };

}