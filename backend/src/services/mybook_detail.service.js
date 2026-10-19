import prisma from "../config/prisma.js";

function normalizeType(type) {

    const t = String(type || "").toLowerCase();

    if (t === "submission") return "submission";

    if (t === "exchange") return "exchange";

    if (t === "sale") return "sale";

    return null;

}

export async function getMyBookDetailService({ userId, type, id }) {

    const normType = normalizeType(type);

    if (!normType) throw new Error("Invalid type");

    if (normType === "submission") {

        const submission = await prisma.book_submissions.findUnique({

            where: { id: BigInt(id) },

            include: {

                book_submission_images: {

                    orderBy: { sort_order: "asc" }

                },

                books_catalog: {

                    include: {

                        book_images: {

                            where: { is_cover: true },

                            orderBy: { sort_order: "asc" },

                            take: 1

                        }

                    }

                }

            }

        });

        if (!submission || submission.user_id !== BigInt(userId)) throw new Error("Not found");

        return {

            book: {

                id: Number(submission.id),

                type: "submission",

                title: submission.title,

                author: submission.author,

                book_condition: submission.book_condition,

                request_type: submission.request_type,

                status: submission.status,

                estimated_price: submission.estimated_price,

                price: submission.price,

                created_at: submission.created_at,

                images: submission.book_submission_images.map(img => ({

                    id: Number(img.id),

                    image_url: img.image_url,

                    cover: img.is_cover

                })),

                cover: submission.book_submission_images.find(i => i.is_cover)?.image_url || submission.book_submission_images[0]?.image_url || null,

                catalog: submission.books_catalog ? {

                    id: Number(submission.books_catalog.id),

                    cover: submission.books_catalog.book_images[0]?.image_url || null,

                    images: submission.books_catalog.book_images.map(img => ({

                        id: Number(img.id),

                        image_url: img.image_url,

                        cover: img.is_cover

                    }))

                } : null

            }

        };

    }

    if (normType === "exchange") {

        const row = await prisma.user_books.findFirst({

            where: {

                id: BigInt(id),

                user_id: BigInt(userId)

            },

            include: {

                books_catalog: {

                    include: {

                        book_images: {

                            where: { is_cover: true },

                            orderBy: { sort_order: "asc" },

                            take: 1

                        }

                    }

                }

            }

        });


        if (!row) throw new Error("Not found");

        // Some legacy records may use `id` as user_id. Keep strict check only when user_id exists.
        if (row.user_id !== null && row.user_id !== undefined && row.user_id !== BigInt(userId)) {
            console.error("[mybook_detail] exchange ownership mismatch", {
                type: normType,
                id: String(id),
                userId: String(userId),
                rowUserId: String(row.user_id),
            });
            throw new Error("Not found");
        }


        return {

            book: {

                id: Number(row.id),

                type: "exchange",

                title: row.books_catalog.title,

                author: row.books_catalog.author,

                isbn: row.books_catalog.isbn,

                book_condition: row.book_condition,

                status: row.status,

                estimated_price: row.estimated_price,

                cover: row.books_catalog.book_images[0]?.image_url || null,

                catalog: {

                    id: Number(row.books_catalog.id),

                    cover: row.books_catalog.book_images[0]?.image_url || null

                }

            }

        };

    }

    // sale

    const row = await prisma.user_books_to_sell.findFirst({

        where: {

            id: BigInt(id),

            user_id: BigInt(userId)

        },

        include: {

            books_catalog: {

                include: {

                    book_images: {

                        where: { is_cover: true },

                        orderBy: { sort_order: "asc" },

                        take: 1

                    }

                }

            }

        }

    });

    if (!row) throw new Error("Not found");


    return {

        book: {

            id: Number(row.id),

            type: "sale",

            title: row.books_catalog.title,

            author: row.books_catalog.author,

            isbn: row.books_catalog.isbn,

            book_condition: row.book_condition,

            status: row.status,

            price: row.price,

            cover: row.books_catalog.book_images[0]?.image_url || null,

            catalog: {

                id: Number(row.books_catalog.id),

                cover: row.books_catalog.book_images[0]?.image_url || null

            }

        }

    };

}

export async function deleteMyBookDetailService({ userId, type, id }) {

    const normType = normalizeType(type);

    if (!normType) throw new Error("Invalid type");

    if (normType === "submission") {

        const submission = await prisma.book_submissions.findUnique({

            where: { id: BigInt(id) }

        });

        if (!submission || submission.user_id !== BigInt(userId)) throw new Error("Not found");

        // delete images of this submission only
        await prisma.book_submission_images.deleteMany({

            where: { book_submission_id: submission.id }

        });

        await prisma.book_submissions.delete({

            where: { id: submission.id }

        });

        return;

    }

    if (normType === "exchange") {

        const row = await prisma.user_books.findUnique({

            where: { id: BigInt(id) }

        });

        if (!row || row.user_id !== BigInt(userId)) throw new Error("Not found");

        await prisma.user_books.delete({ where: { id: row.id } });

        return;

    }

    // sale

    const row = await prisma.user_books_to_sell.findUnique({

        where: { id: BigInt(id) }

    });

    if (!row || row.user_id !== BigInt(userId)) throw new Error("Not found");

    await prisma.user_books_to_sell.delete({ where: { id: row.id } });

}

