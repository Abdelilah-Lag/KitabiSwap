import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serializeBigInt.js";

/*
==========================================================
WAREHOUSE DASHBOARD
==========================================================
*/

export async function getDashboardService() {

    const [

        catalogBooks,

        inventoryBooks,

        sellRequests,

        validatedSales,

        validatedUserSales

    ] = await Promise.all([

        prisma.books_catalog.count(),

        prisma.shop_inventory.count(),

        prisma.book_submissions.count({

            where: {

                request_type: "sell"

            }

        }),

        /* validated sales (legacy book_orders) */
        prisma.book_orders.count({

            where: {

                status: "valide"

            }

        }),

        /* validated sales (user_commandes) */
        prisma.user_commandes.count({

            where: {

                order_status: "confirmed"

            }

        })

    ]);

    /*
    =====================================
    LAST SELL REQUESTS
    =====================================
    */

    const latestSellRequests = await prisma.book_submissions.findMany({

        where: {

            request_type: "sell"

        },

        orderBy: {

            created_at: "desc"

        },

        take: 5,

        include: {

            users: {

                select: {

                    first_name: true,

                    last_name: true

                }

            }

        }

    });

    /*
    =====================================
    LOW STOCK BOOKS
    =====================================
    */

    const lowStockBooks = await prisma.shop_inventory.findMany({

        where: {

            stock_quantity: {

                not: null,

                lte: 5

            }

        },

        take: 5,

        include: {

            books_catalog: {

                select: {

                    title: true,

                    author: true

                }

            }

        }

    });

    return serializeBigInt({

        statistics: {

            catalog_books: catalogBooks,

            inventory_books: inventoryBooks,

            sell_requests: sellRequests,

            validated_sales: validatedSales + validatedUserSales

        },

        latest_sell_requests: latestSellRequests,

        low_stock_books: lowStockBooks

    });

}

/*
==========================================================
WAREHOUSE DASHBOARD PROFILE
==========================================================
*/

export async function getProfileService(userId) {

    const profile = await prisma.users.findUnique({

        where: {

            id: BigInt(userId)

        },

        select: {

            id: true,

            uuid: true,

            first_name: true,

            last_name: true,

            email: true,

            phone: true,

            avatar_url: true,

            avatar_public_id: true,

            status: true,

            created_at: true,

            updated_at: true

        }

    });

    return serializeBigInt(profile);

}