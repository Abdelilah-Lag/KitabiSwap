// NOTE: Repository currently has no dedicated enum-mapping module.
// We keep this file minimal and focused on required conversions.


export function convertConditionForUserBookToSell(condition) {
    // Prisma enums:
    // - book_submissions_book_condition: new, like_new, very_good, good, acceptable, poor
    // - user_books_to_sell_book_condition: like_new, very_good, good, acceptable, poor
    // Rule: map "new" -> "like_new".

    if (condition === "new") return "like_new";
    return condition; // should be already one of allowed values
}

export function convertPagesColorForCatalog(pagesColor) {
    // book_submissions_pages_color: black_white, color, mixed
    // books_catalog_pages_color: black_white, color
    // Rule: map "mixed" -> "color".

    if (pagesColor === "mixed") return "color";
    return pagesColor;
}

