import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serializeBigInt.js";

/*
==========================================================
DELIVERY DASHBOARD
==========================================================
*/

export async function getDeliveryDashboardService(userId) {

    /*
    ==========================================================
    WALLET
    ==========================================================
    */

    const wallet = await prisma.wallets.findUnique({

        where: {

            user_id: BigInt(userId)

        }

    });

    /*
    ==========================================================
    ALL DELIVERIES
    ==========================================================
    */

    const deliveries = await prisma.deliveries.findMany({

        where: {

            delivery_person_id: BigInt(userId)

        },

        include: {

            book_orders: {

                select: {

                    id: true,

                    shop_inventory_id: true,

                    user_book_to_sell_id: true

                }

            },

            user_commandes: {

                select: {

                    id: true

                }

            },

            exchange_delivery: {

                select: {

                    id: true

                }

            }

        },

        orderBy: {

            created_at: "desc"

        }

    });

    /*
    ==========================================================
    STATISTICS
    ==========================================================
    */

    let magazineDeliveries = 0;
    let userDeliveries = 0;
    let exchangeDeliveries = 0;

    deliveries.forEach((delivery) => {

        /*
        --------------------------
        EXCHANGE
        --------------------------
        */

        if (delivery.exchange_delivery_id) {

            exchangeDeliveries++;

            return;

        }

        /*
        --------------------------
        USER COMMANDE
        --------------------------
        */

        if (delivery.user_commande_id) {

            magazineDeliveries++;

            return;

        }

        /*
        --------------------------
        BOOK ORDER
        --------------------------
        */

        if (delivery.book_orders) {

            if (delivery.book_orders.shop_inventory_id) {

                magazineDeliveries++;

            }

            else if (delivery.book_orders.user_book_to_sell_id) {

                userDeliveries++;

            }

        }

    });

    /*
    ==========================================================
    LAST DELIVERIES
    ==========================================================
    */

    const latestDeliveries = deliveries

        .slice(0, 10)

        .map((delivery) => {

            let type = "Magazine";

            if (delivery.exchange_delivery_id) {

                type = "Exchange";

            }

            else if (delivery.user_commande_id) {

                type = "Magazine";

            }

            else if (delivery.book_orders?.shop_inventory_id) {

                type = "Magazine";

            }

            else if (delivery.book_orders?.user_book_to_sell_id) {

                type = "Utilisateur";

            }

            return {

                id: delivery.id,

                type,

                status: delivery.status,

                payment: delivery.payment,

                total: delivery.total,

                created_at: delivery.created_at

            };

        });

    /*
    ==========================================================
    RETURN
    ==========================================================
    */

    return serializeBigInt({

        statistics: {

            wallet_balance: wallet?.balance ?? 0,

            total_deliveries: deliveries.length,

            magazine_deliveries: magazineDeliveries,

            user_deliveries: userDeliveries,

            exchange_deliveries: exchangeDeliveries

        },

        latest_deliveries: latestDeliveries

    });

}