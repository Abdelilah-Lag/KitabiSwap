import prisma from "../config/prisma.js";

export async function getExploreBooks(query) {

    const page = Number(query.page) || 1;

    const limit = 12;

    const skip = (page - 1) * limit;

    const search = query.search?.trim() || "";

    const rawCategory = query.category || "";

    const rawLanguage = query.language || "";

    const rawCondition = query.condition || "";

    const rawAvailability = query.availability || "";

    const normalizeEnum = (v) => v && typeof v === 'string'
        ? v.trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_')
        : '';

    const category = normalizeEnum(rawCategory);
    const language = normalizeEnum(rawLanguage);
    const condition = normalizeEnum(rawCondition);
    const availability = normalizeEnum(rawAvailability);

    /* ==========================================
            BUILD WHERE
    ========================================== */

    const booksCatalogFilters = {};
    if (category) booksCatalogFilters.category = category;
    if (language) booksCatalogFilters.language = language;
    if (search) booksCatalogFilters.OR = [
        { title: { contains: search } },
        { author: { contains: search } }
    ];

    const where = {
        is_visible: true,
        ...(availability ? { status: availability } : { status: "available" }),
        ...(condition && { book_condition: condition }),
        ...(Object.keys(booksCatalogFilters).length && { books_catalog: booksCatalogFilters })
    };

    /* ==========================================
            COUNT
    ========================================== */

    const totalBooks = await prisma.user_books.count({

        where

    });

    const totalPages = Math.ceil(totalBooks / limit);

    /* ==========================================
            GET BOOKS
    ========================================== */

    const booksDB = await prisma.user_books.findMany({

        where,

        skip,

        take: limit,

        orderBy: {

            created_at: "desc"

        },

        include: {

            users: true,

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

    const books = booksDB.map(book => {

        const userIdStr = book.user_id?.toString();

        const cover = book.books_catalog.book_images.find(image =>

            (
                image.uploaded_by !== null &&
                image.uploaded_by?.toString() === userIdStr &&
                image.is_cover
            )

            ||

            (
                image.uploaded_by === null &&
                image.is_cover
            )

        );

        return {

            userBookId: book.id?.toString(),

            status: book.status,

            condition: book.book_condition,

            estimatedPrice: book.estimated_price?.toString(),

            exchangeOnly: book.exchange_only,

            createdAt: book.created_at,

            user: {

                id: book.users.id?.toString(),

                firstName: book.users.first_name,

                lastName: book.users.last_name,

                name: `${book.users.first_name} ${book.users.last_name}`,

                city: book.users.city,

                avatar: book.users.avatar_url

            },

            book: {

                id: book.books_catalog.id?.toString(),

                isbn: book.books_catalog.isbn,

                title: book.books_catalog.title,

                subtitle: book.books_catalog.subtitle,

                author: book.books_catalog.author,

                publisher: book.books_catalog.publisher,

                publicationYear: book.books_catalog.publication_year,

                edition: book.books_catalog.edition,

                language: book.books_catalog.language,

                category: book.books_catalog.category,

                pages: book.books_catalog.pages,

                description: book.books_catalog.description,

                cover: cover?.image_url

            }

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