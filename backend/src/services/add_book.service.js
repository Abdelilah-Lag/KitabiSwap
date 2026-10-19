import prisma from "../config/prisma.js";

import {
    uploadToCloudinary,
    deleteFromCloudinary
} from "../utils/cloudinaryUpload.js";

/* ==========================================================
   BIGINT SERIALIZER
========================================================== */

function serializeBigInt(data) {

    return JSON.parse(

        JSON.stringify(

            data,

            (_, value) =>

                typeof value === "bigint"

                    ? value.toString()

                    : value

        )

    );

}

/* ==========================================================
   SEARCH BOOK CATALOG
========================================================== */

export async function searchBookCatalog(search) {

    if (!search || search.trim() === "") {

        return [];

    }

    const books = await prisma.books_catalog.findMany({

        where: {

            is_active: true,

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
                },

                {
                    isbn: {
                        contains: search
                    }
                },

                {
                    publisher: {
                        contains: search
                    }
                },

                {
                    search_keywords: {
                        contains: search
                    }
                }

            ]

        },

        include: {

            book_images: {

                orderBy: {

                    sort_order: "asc"

                }

            }

        },

        take: 20

    });

    return serializeBigInt(books);

}

/* ==========================================================
   CREATE BOOK SUBMISSION
========================================================== */

export async function createBookSubmission({

    userId,

    data,

    files,

    coverIndex

}) {

    const submission = await prisma.book_submissions.create({

        data: {

            user_id: BigInt(userId),

            book_catalog_id:

                data.book_catalog_id

                    ? BigInt(data.book_catalog_id)

                    : null,

            request_type: data.request_type,

            book_condition: data.book_condition,

            estimated_price:

                data.estimated_price

                    ? Number(data.estimated_price)

                    : null,

            price:

                data.price

                    ? Number(data.price)

                    : null,

            isbn: data.isbn,

            title: data.title,

            subtitle: data.subtitle || null,

            author: data.author,

            publisher: data.publisher || null,

            edition: data.edition || null,

            publication_year:

                data.publication_year

                    ? Number(data.publication_year)

                    : null,

            language: data.language || null,

            category: data.category || null,

            book_type: data.book_type || "physical",

            cover_type: data.cover_type || "paperback",

            target_audience: data.target_audience || "all",

            pages:

                data.pages

                    ? Number(data.pages)

                    : null,

            pages_color: data.pages_color || "black_white",

            dimensions: data.dimensions || null,

            weight:

                data.weight

                    ? Number(data.weight)

                    : null,

            description: data.description || null,

            summary: data.summary || null,

            search_keywords: data.search_keywords || null,

            status: "pending"

        }

    });

    if (files && files.length > 0) {

        for (let i = 0; i < files.length; i++) {

            const uploaded = await uploadToCloudinary(

                files[i].buffer,

                "kitabiswap/book_submissions_images"

            );

            await prisma.book_submission_images.create({

                data: {

                    book_submission_id: submission.id,

                    image_url: uploaded.url,

                    public_id: uploaded.public_id,

                    is_cover: Number(i) === Number(coverIndex),

                    sort_order: i + 1

                }

            });

        }

    }

    const result = await prisma.book_submissions.findUnique({

        where: {

            id: submission.id

        },

        include: {

            book_submission_images: true

        }

    });

    return serializeBigInt(result);

}

/* ==========================================================
   GET USER SUBMISSIONS
========================================================== */

export async function getUserSubmissions(userId) {

    const submissions = await prisma.book_submissions.findMany({

        where: {

            user_id: BigInt(userId)

        },

        include: {

            book_submission_images: true

        },

        orderBy: {

            created_at: "desc"

        }

    });

    return serializeBigInt(submissions);

}

/* ==========================================================
   GET SUBMISSION DETAILS
========================================================== */

export async function getSubmissionById({

    id,

    userId

}) {

    const submission = await prisma.book_submissions.findFirst({

        where: {

            id: BigInt(id),

            user_id: BigInt(userId)

        },

        include: {

            book_submission_images: true

        }

    });

    return serializeBigInt(submission);

}

/* ==========================================================
   DELETE SUBMISSION
========================================================== */

export async function deleteSubmission({

    id,

    userId

}) {

    const submission = await prisma.book_submissions.findFirst({

        where: {

            id: BigInt(id),

            user_id: BigInt(userId)

        },

        include: {

            book_submission_images: true

        }

    });

    if (!submission) {

        throw new Error("Submission introuvable");

    }

    for (const image of submission.book_submission_images) {

        if (image.public_id) {

            await deleteFromCloudinary(image.public_id);

        }

    }

    await prisma.book_submissions.delete({

        where: {

            id: submission.id

        }

    });

    return {

        message: "Demande supprimée avec succès"

    };

}