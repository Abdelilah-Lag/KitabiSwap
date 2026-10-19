import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

/* ==========================================
   TOGGLE FAVORITE
========================================== */

async function toggleFavorite(

    userId,
    data

) {

    const {

        shop_inventory_id,
        user_books_to_sell_id,
        user_book_id

    } = data;

    if (

        !shop_inventory_id &&
        !user_books_to_sell_id &&
        !user_book_id

    ) {

        throw new Error("Aucun livre sélectionné.");

    }

    /* ==========================================
       SHOP INVENTORY
    ========================================== */

    if (shop_inventory_id) {

        const existing = await prisma.favorites.findFirst({

            where: {

                user_id: userId,

                shop_inventory_id: Number(shop_inventory_id)

            }

        });

        if (existing) {

            await prisma.favorites.delete({

                where: {

                    id: existing.id

                }

            });

            return {

                favorite: false,

                message: "Retiré des favoris."

            };

        }

        await prisma.favorites.create({

            data: {

                uuid: uuidv4(),

                user_id: userId,

                shop_inventory_id: Number(shop_inventory_id)

            }

        });

        return {

            favorite: true,

            message: "Ajouté aux favoris."

        };

    }

    /* ==========================================
       USER BOOK TO SELL
    ========================================== */

    if (user_books_to_sell_id) {

        const existing = await prisma.favorites.findFirst({

            where: {

                user_id: userId,

                user_books_to_sell_id: Number(user_books_to_sell_id)

            }

        });

        if (existing) {

            await prisma.favorites.delete({

                where: {

                    id: existing.id

                }

            });

            return {

                favorite: false,

                message: "Retiré des favoris."

            };

        }

        await prisma.favorites.create({

            data: {

                uuid: uuidv4(),

                user_id: userId,

                user_books_to_sell_id: Number(user_books_to_sell_id)

            }

        });

        return {

            favorite: true,

            message: "Ajouté aux favoris."

        };

    }

    /* ==========================================
       USER BOOK (Exchange)
    ========================================== */

    const existing = await prisma.favorites.findFirst({

        where: {

            user_id: userId,

            user_book_id: Number(user_book_id)

        }

    });

    if (existing) {

        await prisma.favorites.delete({

            where: {

                id: existing.id

            }

        });

        return {

            favorite: false,

            message: "Retiré des favoris."

        };

    }

    await prisma.favorites.create({

        data: {

            uuid: uuidv4(),

            user_id: userId,

            user_book_id: Number(user_book_id)

        }

    });

    return {

        favorite: true,

        message: "Ajouté aux favoris."

    };

}

/* ==========================================
   GET USER FAVORITES
========================================== */

async function getUserFavorites(userId) {

    const favorites = await prisma.favorites.findMany({

        where: {

            user_id: userId

        },

        orderBy: {

            created_at: "desc"

        }

    });

    // Prisma returns BigInt fields (MySQL UnsignedBigInt). JSON.stringify cannot serialize BigInt.
    // Convert all BigInt ids to strings for API responses.
    return favorites.map((f) => ({
        ...f,
        id: f.id?.toString?.() ?? null,
        user_id: f.user_id?.toString?.() ?? null,
        user_book_id: f.user_book_id?.toString?.() ?? null,
        user_books_to_sell_id: f.user_books_to_sell_id?.toString?.() ?? null,
        shop_inventory_id: f.shop_inventory_id?.toString?.() ?? null,
    }));

}

export {
    toggleFavorite,
    getUserFavorites
};

