import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serializeBigInt.js";

/*
==========================================================
GET DELIVERY USER ORDERS
==========================================================
*/

export async function getDeliveryUserOrdersService() {

    /*
    ==========================================
    COMMANDES DEJA PRISES PAR UN LIVREUR
    ==========================================
    */

    const existingDeliveries =
        await prisma.deliveries.findMany({

            where: {
                book_order_id: {
                    not: null
                }
            },

            select: {
                book_order_id: true
            }

        });

    const deliveredBookOrderIds =
        existingDeliveries.map(
            item => item.book_order_id
        );

    /*
    ==========================================
    BOOK ORDERS UTILISATEUR
    ==========================================
    */

    const bookOrders =

        await prisma.book_orders.findMany({

            where: {

                user_book_to_sell_id: {
                    not: null
                },

                status: "valide",

                id: {

                    notIn:

                        deliveredBookOrderIds.length

                        ? deliveredBookOrderIds

                        : [BigInt(0)]

                }

            },

            include: {

                // ACHETEUR
                users: {
                    include: {
                        user_addresses: {
                            where: { is_default: true },
                            take: 1
                        }
                    }
                },

                // VENDEUR + LIVRE
                user_books_to_sell: {

                    include: {

                        // VENDEUR
                        users: {
                            include: {
                                user_addresses: {
                                    where: { is_default: true },
                                    take: 1
                                }
                            }
                        },

                        // LIVRE
                        books_catalog: {

                            include: {

                                book_images: {
                                    where: { is_cover: true },
                                    take: 1
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

    /*
    ==========================================
    FORMAT BOOK ORDERS
    ==========================================
    */

    const formattedOrders =

        bookOrders.map(order => {

            const sellerData =
                order.user_books_to_sell;

            const sellerUser =
                sellerData?.users;

            const book =
                sellerData?.books_catalog;

            const buyerAddress =
                order.users?.user_addresses?.[0] || null;

            const sellerAddress =
                sellerUser?.user_addresses?.[0] || null;

            /*
            ==============================
            FORMAT ADDRESS
            ==============================
            */

            function formatAddress(addr) {

                if (!addr) return null;

                const parts = [

                    addr.street,
                    addr.building,
                    addr.apartment,
                    addr.district,
                    addr.city,
                    addr.region

                ].filter(Boolean);

                return parts.join(", ") || null;

            }

            /*
            ==============================
            CALCUL TOTAL
            ==============================
            */

            const total =

                Number(order.price) *

                Number(order.quantity) +

                Number(order.delivery_price);

            return {

                source: "user_order",

                id: order.id,

                customer: {

                    id: order.user_id,

                    first_name:
                        order.users.first_name,

                    last_name:
                        order.users.last_name,

                    phone:
                        order.users.phone,

                    address:
                        formatAddress(buyerAddress)

                },

                seller: {

                    id: sellerData?.user_id,

                    first_name:
                        sellerUser?.first_name || "",

                    last_name:
                        sellerUser?.last_name || "",

                    phone:
                        sellerUser?.phone || "",

                    address:
                        formatAddress(sellerAddress)

                },

                book: {

                    title:
                        book?.title || "",

                    author:
                        book?.author || "",

                    image:
                        book?.book_images?.[0]?.image_url || null

                },

                quantity:
                    Number(order.quantity),

                price:
                    Number(order.price),

                delivery_price:
                    Number(order.delivery_price),

                total:

                    Number(total.toFixed(2)),

                payment:
                    order.payment_method,

                created_at:
                    order.created_at

            };

        });

    /*
    ==========================================
    RETURN
    ==========================================
    */

    return serializeBigInt({

        data: formattedOrders

    });

}

/*
==========================================================
TAKE USER DELIVERY ORDER
==========================================================
*/

export async function takeDeliveryUserOrderService(
    orderId,
    deliveryPersonId
) {

    /*
    ==========================================
    VERIFICATION EXISTENCE
    ==========================================
    */

    const existingDelivery =

        await prisma.deliveries.findFirst({

            where: {
                book_order_id: BigInt(orderId)
            }

        });

    if (existingDelivery) {

        throw new Error(
            "Cette commande est déjà prise"
        );

    }

    /*
    ==========================================
    VERIFICATION COMMANDE
    ==========================================
    */

    const order =

        await prisma.book_orders.findUnique({

            where: {
                id: BigInt(orderId)
            }

        });

    if (!order) {

        throw new Error(
            "Commande introuvable"
        );

    }

    /*
    ==========================================
    CALCUL TOTAL
    ==========================================
    */

    const total =

        Number(order.price) *

        Number(order.quantity) +

        Number(order.delivery_price);

    /*
  /*
==========================================
CREATION LIVRAISON
==========================================
*/

const delivery =

    await prisma.deliveries.create({

        data: {

            delivery_person_id:
                BigInt(deliveryPersonId),

            book_order_id:
                BigInt(orderId),

            status: "en_cours",

            total:
                Number(total.toFixed(2)),

            payment:
                order.payment_method

        }

    });

/*
==========================================
RETURN
==========================================
*/

return serializeBigInt({

    success: true,

    message:

        "Commande prise avec succès.",

    delivery

});
}