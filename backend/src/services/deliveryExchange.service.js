import prisma from "../config/prisma.js";

import {

    serializeBigInt

} from "../utils/serializeBigInt.js";

/*
==========================================================
GET DELIVERY EXCHANGE ORDERS
==========================================================
*/

export async function getDeliveryExchangeOrdersService() {

    /*
    ==========================================
    LIVRAISONS DEJA ATTRIBUEES
    ==========================================
    */

    const existingDeliveries =

        await prisma.deliveries.findMany({

            where: {

                exchange_delivery_id: {

                    not: null

                }

            },

            select: {

                exchange_delivery_id: true

            }

        });

    const deliveredIds =

        existingDeliveries.map(

            item => item.exchange_delivery_id

        );

    /*
    ==========================================
    ECHANGES DISPONIBLES
    ==========================================
    */

    const exchanges =

        await prisma.exchange_delivery.findMany({

            where: {

                status: "collecting_books",

                id: {

                    notIn:

                        deliveredIds.length

                            ? deliveredIds

                            : [BigInt(0)]

                }

            },

            include: {

                exchange_requests: {

                    include: {

                        /*
                        =====================
                        REQUESTER
                        =====================
                        */

                        users_exchange_requests_requester_idTousers: {

                            include: {

                                user_addresses: {

                                    where: {

                                        is_default: true

                                    },

                                    take: 1

                                }

                            }

                        },

                        /*
                        =====================
                        RECEIVER
                        =====================
                        */

                        users_exchange_requests_receiver_idTousers: {

                            include: {

                                user_addresses: {

                                    where: {

                                        is_default: true

                                    },

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
    FORMAT ADRESSE
    ==========================================
    */

    function formatAddress(address) {

        if (!address) return null;

        return [

            address.street,

            address.building,

            address.apartment,

            address.district,

            address.city,

            address.region

        ]

            .filter(Boolean)

            .join(", ");

    }

    /*
    ==========================================
    LA SUITE DANS LA PARTIE 2
    ==========================================
    */
       /*
    ==========================================
    FORMAT RESULTAT
    ==========================================
    */

    const formattedOrders = [];

    for (const delivery of exchanges) {

        const request =
            delivery.exchange_requests;

        /*
        ======================================
        REQUESTER / RECEIVER
        ======================================
        */

        const requester =
            request
            ?.users_exchange_requests_requester_idTousers;

        const receiver =
            request
            ?.users_exchange_requests_receiver_idTousers;

        /*
        ======================================
        IDS DES LIVRES
        ======================================
        */

        const requesterBookIds =

            Array.isArray(request.requester_books)

                ? request.requester_books

                : JSON.parse(

                    request.requester_books || "[]"

                );

        const receiverBookIds =

            Array.isArray(request.receiver_books)

                ? request.receiver_books

                : JSON.parse(

                    request.receiver_books || "[]"

                );

        /*
        ======================================
        LIVRES REQUESTER
        ======================================
        */

        const requesterBooks =

            await prisma.user_books.findMany({

                where: {

                    id: {

                        in: requesterBookIds.map(

                            id => BigInt(id)

                        )

                    }

                },

                include: {

                    books_catalog: {

                        include: {

                            book_images: {

                                where: {

                                    is_cover: true

                                },

                                take: 1

                            }

                        }

                    }

                }

            });

        /*
        ======================================
        LIVRES RECEIVER
        ======================================
        */

        const receiverBooks =

            await prisma.user_books.findMany({

                where: {

                    id: {

                        in: receiverBookIds.map(

                            id => BigInt(id)

                        )

                    }

                },

                include: {

                    books_catalog: {

                        include: {

                            book_images: {

                                where: {

                                    is_cover: true

                                },

                                take: 1

                            }

                        }

                    }

                }

            });

        /*
        ======================================
        FORMAT LIVRES
        ======================================
        */

        const requesterBooksFormatted =

            requesterBooks.map(book => ({

                id: book.id,

                title:

                    book.books_catalog?.title ||

                    "",

                author:

                    book.books_catalog?.author ||

                    "",

                image:

                    book.books_catalog

                    ?.book_images?.[0]

                    ?.image_url || null

            }));

        const receiverBooksFormatted =

            receiverBooks.map(book => ({

                id: book.id,

                title:

                    book.books_catalog?.title ||

                    "",

                author:

                    book.books_catalog?.author ||

                    "",

                image:

                    book.books_catalog

                    ?.book_images?.[0]

                    ?.image_url || null

            }));

        formattedOrders.push({

            id: delivery.id,

            exchange_delivery_id:

                delivery.id,

            exchange_request_id:

                request.id,

            requester: {

                id: requester.id,

                first_name:

                    requester.first_name,

                last_name:

                    requester.last_name,

                phone:

                    requester.phone,

                address:

                    formatAddress(

                        requester

                        ?.user_addresses?.[0]

                    )

            },

            receiver: {

                id: receiver.id,

                first_name:

                    receiver.first_name,

                last_name:

                    receiver.last_name,

                phone:

                    receiver.phone,

                address:

                    formatAddress(

                        receiver

                        ?.user_addresses?.[0]

                    )

            },

            requester_books:

                requesterBooksFormatted,

            receiver_books:

                receiverBooksFormatted,

            requester_books_count:

                requesterBooksFormatted.length,

            receiver_books_count:

                receiverBooksFormatted.length,

            requester_payment_method:

                delivery.requester_payment_method

                || "wallet",

            receiver_payment_method:

                delivery.receiver_payment_method

                || "wallet",

            requester_share:

                Number(

                    delivery.requester_share

                ),

            receiver_share:

                Number(

                    delivery.receiver_share

                ),

            delivery_price:

                Number(

                    delivery.delivery_fee

                ),

            total:
                Number(
                    delivery.delivery_fee
                ),

            created_at:
                delivery.created_at

        });

    }
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
TAKE DELIVERY EXCHANGE ORDER
==========================================================
*/

export async function takeDeliveryExchangeService(

    exchangeDeliveryId,

    deliveryPersonId

) {

    /*
    ==========================================
    VERIFIER SI DEJA PRISE
    ==========================================
    */

    const existingDelivery =

        await prisma.deliveries.findFirst({

            where: {

                exchange_delivery_id:

                    BigInt(exchangeDeliveryId)

            }

        });

    if (existingDelivery) {

        throw new Error(

            "Cette livraison est déjà prise."

        );

    }

    /*
    ==========================================
    VERIFIER EXISTENCE
    ==========================================
    */

    const exchangeDelivery =

        await prisma.exchange_delivery.findUnique({

            where: {

                id: BigInt(exchangeDeliveryId)

            }

        });

    if (!exchangeDelivery) {

        throw new Error(

            "Livraison introuvable."

        );

    }

    /*
    ==========================================
    CREATION DELIVERY
    ==========================================
    */

    await prisma.deliveries.create({

        data: {

            delivery_person_id:

                BigInt(deliveryPersonId),

            exchange_delivery_id:

                BigInt(exchangeDeliveryId),

            status: "en_cours",

            payment:

                exchangeDelivery.requester_payment_method

                || exchangeDelivery.receiver_payment_method

                || "wallet",

            total:

                Number(

                    exchangeDelivery.delivery_fee

                )

        }

    });

    /*
    ==========================================
    RETURN
    ==========================================
    */

    return {

        success: true,

        message:

            "Livraison prise avec succès."

    };

}