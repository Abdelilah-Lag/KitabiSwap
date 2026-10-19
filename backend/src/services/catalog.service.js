import prisma from "../config/prisma.js";

export async function searchBookCatalogService(q) {
    const query = String(q ?? "").trim();
    if (!query) return [];

    // Search across books_catalog for visible books (same idea as explore.service.js)
    // and return a shape compatible with BookCatalogSearch.jsx.
    const books = await prisma.books_catalog.findMany({
        where: {
            is_active: true,

            OR: [
                { title: { contains: query, mode: "insensitive" } },
                { author: { contains: query, mode: "insensitive" } },
                { isbn: { contains: query, mode: "insensitive" } },
            ],
        },
        take: 12,
        orderBy: { created_at: "desc" },
        select: {
            id: true,
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
            book_images: {
                where: { is_cover: true },
                take: 1,
                select: { image_url: true },
            },
        },
    });

    return books.map(b => ({
        id: b.id?.toString?.() ?? b.id,
        isbn: b.isbn,
        title: b.title,
        subtitle: b.subtitle,
        author: b.author,
        publisher: b.publisher,
        edition: b.edition,
        publicationYear: b.publication_year,
        language: b.language,
        category: b.category,
        pages: b.pages,
        cover: b.book_images?.[0]?.image_url ?? null,
    }));
}

