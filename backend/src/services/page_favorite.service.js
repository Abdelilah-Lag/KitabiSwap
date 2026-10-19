import prisma from "../config/prisma.js";


/*
==========================================================
 GET USER FAVORITES
==========================================================
*/

export async function getFavoritesService(userId) {

    const favorites = await prisma.favorites.findMany({

        where: {

            user_id: BigInt(userId)

        },

        include: {

            user_books: {

                include: {

                    users: {

                        select: {

                            first_name: true,
                            last_name: true

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

            },



            user_books_to_sell: {

                include: {

                    users: {

                        select: {

                            first_name: true,
                            last_name: true

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

            },



            shop_inventory: {

                include: {

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

            }

        },



        orderBy: {

            created_at: "desc"

        }

    });



    const books = [];



    for (const favorite of favorites) {

        /*
        ==========================================================
        USER EXCHANGE BOOK
        ==========================================================
        */

        if (favorite.user_books) {

            const book = favorite.user_books;

            const catalog = book.books_catalog;

            const cover =

                catalog.book_images.find(

                    image => image.is_cover

                ) ||

                catalog.book_images[0] ||

                null;



            books.push({

                favorite_id: favorite.id.toString(),

                type: "exchange",

                book_id: book.id.toString(),

                catalog_id: catalog.id.toString(),



                title: catalog.title,

                subtitle: catalog.subtitle,

                author: catalog.author,

                publisher: catalog.publisher,

                edition: catalog.edition,

                publication_year: catalog.publication_year,

                language: catalog.language,

                category: catalog.category,

                description: catalog.description,

                summary: catalog.summary,



                book_condition: book.book_condition,

                condition: book.book_condition,



                estimated_price: book.estimated_price,

                price: book.estimated_price,



                owner_name:

                    book.users.first_name +

                    " " +

                    book.users.last_name,



                cover_image:

                    cover?.image_url ||

                    null,



                image_url:

                    cover?.image_url ||

                    null,



                images:

                    catalog.book_images.map(

                        image => ({

                            id: image.id.toString(),

                            image_url: image.image_url,

                            public_id: image.public_id,

                            is_cover: image.is_cover

                        })

                    ),



                catalog: {

    id: catalog.id.toString(),

    isbn: catalog.isbn,

    title: catalog.title,

    subtitle: catalog.subtitle,

    author: catalog.author,

    publisher: catalog.publisher,

    edition: catalog.edition,

    publication_year: catalog.publication_year,

    language: catalog.language,

    category: catalog.category,

    book_type: catalog.book_type,

    cover_type: catalog.cover_type,

    target_audience: catalog.target_audience,

    pages: catalog.pages,

    pages_color: catalog.pages_color,

    dimensions: catalog.dimensions,

    weight: catalog.weight,

    description: catalog.description,

    summary: catalog.summary

}

            });

        }



        /*
        ==========================================================
        USER SELL BOOK
        ==========================================================
        */

        else if (favorite.user_books_to_sell) {

            const book = favorite.user_books_to_sell;

            const catalog = book.books_catalog;

            const cover =

                catalog.book_images.find(

                    image => image.is_cover

                ) ||

                catalog.book_images[0] ||

                null;



            books.push({

                favorite_id: favorite.id.toString(),

                type: "sell",

                book_id: book.id.toString(),

                catalog_id: catalog.id.toString(),

                title: catalog.title,

                subtitle: catalog.subtitle,

                author: catalog.author,

                publisher: catalog.publisher,

                edition: catalog.edition,

                publication_year: catalog.publication_year,

                language: catalog.language,

                category: catalog.category,

                description: catalog.description,

                summary: catalog.summary,

                // ---- la partie SHOP continue dans la partie 2 ----
                                book_condition: book.book_condition,

                condition: book.book_condition,

                price: book.price,

                estimated_price: book.price,

                owner_name:

                    book.users.first_name +

                    " " +

                    book.users.last_name,



                cover_image:

                    cover?.image_url ||

                    null,



                image_url:

                    cover?.image_url ||

                    null,



                images:

                    catalog.book_images.map(

                        image => ({

                            id: image.id.toString(),

                            image_url: image.image_url,

                            public_id: image.public_id,

                            is_cover: image.is_cover

                        })

                    ),



                catalog: {

    id: catalog.id.toString(),

    isbn: catalog.isbn,

    title: catalog.title,

    subtitle: catalog.subtitle,

    author: catalog.author,

    publisher: catalog.publisher,

    edition: catalog.edition,

    publication_year: catalog.publication_year,

    language: catalog.language,

    category: catalog.category,

    book_type: catalog.book_type,

    cover_type: catalog.cover_type,

    target_audience: catalog.target_audience,

    pages: catalog.pages,

    pages_color: catalog.pages_color,

    dimensions: catalog.dimensions,

    weight: catalog.weight,

    description: catalog.description,

    summary: catalog.summary

}

            });

        }



        /*
        ==========================================================
        SHOP BOOK
        ==========================================================
        */

        else if (favorite.shop_inventory) {

            const book = favorite.shop_inventory;

            const catalog = book.books_catalog;

            const cover =

                catalog.book_images.find(

                    image => image.is_cover

                ) ||

                catalog.book_images[0] ||

                null;



            books.push({

                favorite_id: favorite.id.toString(),

                type: "shop",

                book_id: book.id.toString(),

                catalog_id: catalog.id.toString(),



                title: catalog.title,

                subtitle: catalog.subtitle,

                author: catalog.author,

                publisher: catalog.publisher,

                edition: catalog.edition,

                publication_year: catalog.publication_year,

                language: catalog.language,

                category: catalog.category,

                description: catalog.description,

                summary: catalog.summary,



                condition: "new",

                book_condition: "new",



                price: book.selling_price,

                estimated_price: book.selling_price,



                owner_name: "KitabiSwap",



                stock_quantity: book.stock_quantity,



                cover_image:

                    cover?.image_url ||

                    null,



                image_url:

                    cover?.image_url ||

                    null,



                images:

                    catalog.book_images.map(

                        image => ({

                            id: image.id.toString(),

                            image_url: image.image_url,

                            public_id: image.public_id,

                            is_cover: image.is_cover

                        })

                    ),



                catalog: {

    id: catalog.id.toString(),

    isbn: catalog.isbn,

    title: catalog.title,

    subtitle: catalog.subtitle,

    author: catalog.author,

    publisher: catalog.publisher,

    edition: catalog.edition,

    publication_year: catalog.publication_year,

    language: catalog.language,

    category: catalog.category,

    book_type: catalog.book_type,

    cover_type: catalog.cover_type,

    target_audience: catalog.target_audience,

    pages: catalog.pages,

    pages_color: catalog.pages_color,

    dimensions: catalog.dimensions,

    weight: catalog.weight,

    description: catalog.description,

    summary: catalog.summary

}

            });

        }

    }



    return books;

}
/*
==========================================================
 ADD FAVORITE
==========================================================
*/

export async function addFavoriteService(userId, data) {

    const {

        userBookId,
        userBookSellId,
        shopInventoryId

    } = data;



    /*
    ==========================================
    Vérifier qu'un seul type est envoyé
    ==========================================
    */

    const total =

        (userBookId ? 1 : 0) +

        (userBookSellId ? 1 : 0) +

        (shopInventoryId ? 1 : 0);


    if (total !== 1) {

        throw new Error(
            "Un seul type de favori est autorisé."
        );

    }



    /*
    ==========================================
    Vérifier si déjà ajouté
    ==========================================
    */

    const existing = await prisma.favorites.findFirst({

        where: {

            user_id: BigInt(userId),

            OR: [

                userBookId
                    ? {
                        user_book_id: BigInt(userBookId)
                    }
                    : undefined,

                userBookSellId
                    ? {
                        user_books_to_sell_id: BigInt(userBookSellId)
                    }
                    : undefined,

                shopInventoryId
                    ? {
                        shop_inventory_id: BigInt(shopInventoryId)
                    }
                    : undefined

            ].filter(Boolean)

        }

    });


    if (existing) {

        throw new Error(
            "Ce livre est déjà dans vos favoris."
        );

    }



    /*
    ==========================================
    Ajouter
    ==========================================
    */

    return await prisma.favorites.create({

        data: {

            user_id: BigInt(userId),

            user_book_id:

                userBookId

                    ? BigInt(userBookId)

                    : null,


            user_books_to_sell_id:

                userBookSellId

                    ? BigInt(userBookSellId)

                    : null,


            shop_inventory_id:

                shopInventoryId

                    ? BigInt(shopInventoryId)

                    : null

        }

    });

}






/*
==========================================================
 REMOVE FAVORITE
==========================================================
*/

export async function removeFavoriteService(

    userId,

    favoriteId

) {

    const favorite = await prisma.favorites.findFirst({

        where: {

            id: BigInt(favoriteId),

            user_id: BigInt(userId)

        }

    });



    if (!favorite) {

        throw new Error(
            "Favori introuvable."
        );

    }



    await prisma.favorites.delete({

        where: {

            id: favorite.id

        }

    });


    return true;

}







/*
==========================================================
 CHECK FAVORITE
==========================================================
*/

export async function checkFavoriteService(

    userId,

    data

) {

    const {

        userBookId,

        userBookSellId,

        shopInventoryId

    } = data;



    const favorite = await prisma.favorites.findFirst({

        where: {

            user_id: BigInt(userId),

            OR: [

                userBookId
                    ? {
                        user_book_id: BigInt(userBookId)
                    }
                    : undefined,

                userBookSellId
                    ? {
                        user_books_to_sell_id: BigInt(userBookSellId)
                    }
                    : undefined,

                shopInventoryId
                    ? {
                        shop_inventory_id: BigInt(shopInventoryId)
                    }
                    : undefined

            ].filter(Boolean)

        }

    });



    return !!favorite;

}