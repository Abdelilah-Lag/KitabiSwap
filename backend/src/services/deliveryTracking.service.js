import prisma from "../config/prisma.js";

import {

    serializeBigInt

} from "../utils/serializeBigInt.js";

/*
==========================================================
GET MY DELIVERIES
==========================================================
*/

export async function getMyDeliveriesService(

    deliveryPersonId

){

    /*
    ==========================================
    RECUPERATION DES LIVRAISONS
    ==========================================
    */

    const deliveries =

        await prisma.deliveries.findMany({

            where:{

                delivery_person_id:

                    BigInt(deliveryPersonId),

                status:"en_cours"

            },

            orderBy:{

                created_at:"desc"

            },

            include:{

                /*
                =========================
                BOOK ORDER
                =========================
                */

                book_orders:{

                    include:{

                        users:{
                            include:{
                                user_addresses:{
                                    where:{
                                        is_default:true
                                    },
                                    take:1
                                }
                            }
                        },

                        user_books_to_sell:{
                            include:{

                                users:{
                                    include:{
                                        user_addresses:{
                                            where:{
                                                is_default:true
                                            },
                                            take:1
                                        }
                                    }
                                },

                                books_catalog:{
                                    include:{
                                        book_images:{
                                            where:{
                                                is_cover:true
                                            },
                                            take:1
                                        }
                                    }
                                }

                            }
                        },

                        shop_inventory:{
                            include:{

                                books_catalog:{
                                    include:{
                                        book_images:{
                                            where:{
                                                is_cover:true
                                            },
                                            take:1
                                        }
                                    }
                                }

                            }
                        }

                    }

                },

                /*
                =========================
                USER COMMANDE
                =========================
                */

                user_commandes:{

                    include:{

                        users:{
                            include:{
                                user_addresses:{
                                    where:{
                                        is_default:true
                                    },
                                    take:1
                                }
                            }
                        }

                    }

                },

                /*
                =========================
                EXCHANGE
                =========================
                */

                exchange_delivery:{

                    include:{

                        exchange_requests:{

                            include:{

                                users_exchange_requests_requester_idTousers:{
                                    include:{
                                        user_addresses:{
                                            where:{
                                                is_default:true
                                            },
                                            take:1
                                        }
                                    }
                                },

                                users_exchange_requests_receiver_idTousers:{
                                    include:{
                                        user_addresses:{
                                            where:{
                                                is_default:true
                                            },
                                            take:1
                                        }
                                    }
                                }

                            }

                        }

                    }

                }

            }

        });

    /*
    ==========================================
    FORMAT ADDRESS
    ==========================================
    */

    function formatAddress(address){

        if(!address){

            return null;

        }

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
    FORMAT RESULT
    ==========================================
    */

    const result = [];

    for(const delivery of deliveries){

        /*
        ======================================
        MAGAZINE
        ======================================
        */

        if(

            delivery.user_commande_id ||

            delivery.book_orders?.shop_inventory_id

        ){

            const order =

                delivery.book_orders;

            const commande =

                delivery.user_commandes;

            const customer =

                commande?.users ||

                order?.users;

            const address =

                customer?.user_addresses?.[0];

            const books = [];

            /*

            ==============================

            BOOK ORDER (single shop book)

            ==============================

            */

            if(

                order?.shop_inventory

            ){

                books.push({

                    title:

                        order.shop_inventory

                        .books_catalog

                        ?.title ||

                        "",

                    author:

                        order.shop_inventory

                        .books_catalog

                        ?.author ||

                        "",

                    quantity:

                        Number(

                            order.quantity

                        ),

                    image:

                        order.shop_inventory

                        .books_catalog

                        ?.book_images?.[0]

                        ?.image_url ||

                        null

                });

            }

            /*

            ==============================

            USER COMMANDE (achats_json)

            ==============================

            */

            if(commande){

                let achats = [];

                try{

                    achats = JSON.parse(

                        commande.achats_json

                    );

                }

                catch(error){

                    console.log(

                        "ACHATS JSON PARSE ERROR",

                        commande.id,

                        error

                    );

                }

                for(const achatId of achats){

                    const achat =

                        await prisma.user_achat

                        .findUnique({

                            where:{

                                id:BigInt(achatId)

                            }

                        });

                    if(!achat){

                        continue;

                    }

                    /*

                    SHOP INVENTORY BOOK

                    */

                    if(

                        achat.shop_inventory_id

                    ){

                        const shopBook =

                            await prisma

                            .shop_inventory

                            .findUnique({

                                where:{

                                    id:BigInt(

                                        achat.shop_inventory_id

                                    )

                                },

                                include:{

                                    books_catalog:{

                                        include:{

                                            book_images:{

                                                where:{

                                                    is_cover:true

                                                },

                                                take:1

                                            }

                                        }

                                    }

                                }

                            });

                        if(shopBook){

                            books.push({

                                title:

                                    shopBook

                                    .books_catalog

                                    ?.title ||

                                    "",

                                author:

                                    shopBook

                                    .books_catalog

                                    ?.author ||

                                    "",

                                quantity:

                                    Number(

                                        achat.quantity

                                    ) || 1,

                                image:

                                    shopBook

                                    .books_catalog

                                    ?.book_images?.[0]

                                    ?.image_url ||

                                    null

                            });

                        }

                    }

                    /*

                    USER BOOK TO SELL

                    */

                    if(

                        achat.user_book_to_sell_id

                    ){

                        const userBook =

                            await prisma

                            .user_books_to_sell

                            .findUnique({

                                where:{

                                    id:BigInt(

                                        achat.user_book_to_sell_id

                                    )

                                },

                                include:{

                                    books_catalog:{

                                        include:{

                                            book_images:{

                                                where:{

                                                    is_cover:true

                                                },

                                                take:1

                                            }

                                        }

                                    }

                                }

                            });

                        if(userBook){

                            books.push({

                                title:

                                    userBook

                                    .books_catalog

                                    ?.title ||

                                    "",

                                author:

                                    userBook

                                    .books_catalog

                                    ?.author ||

                                    "",

                                quantity:

                                    Number(

                                        achat.quantity

                                    ) || 1,

                                image:

                                    userBook

                                    .books_catalog

                                    ?.book_images?.[0]

                                    ?.image_url ||

                                    null

                            });

                        }

                    }

                }

            }

            result.push({

                delivery_id:

                    delivery.id,

                type:

                    "magazine",

                status:

                    delivery.status,

                payment:

                    delivery.payment,

                total:

                    Number(

                        delivery.total

                    ),

                created_at:

                    delivery.created_at,

                delivery_price:

                    Number(

                        order?.delivery_price ||

                        commande?.delivery_price ||

                        0

                    ),

                customer:{

                    id:

                        customer?.id,

                    first_name:

                        customer?.first_name ||

                        "",

                    last_name:

                        customer?.last_name ||

                        "",

                    phone:

                        customer?.phone ||

                        "",

                    address:

                        formatAddress(

                            address

                        )

                },

                books

            });

            continue;

        }

        /*
        ======================================
        USER ORDER
        ======================================
        */

        if(

            delivery.book_orders?.user_book_to_sell_id

        ){

            const order =

                delivery.book_orders;

            const sellerBook =

                order.user_books_to_sell;

            const buyer =

                order.users;

            const seller =

                sellerBook.users;

            result.push({

                delivery_id:

                    delivery.id,

                type:

                    "user",

                status:

                    delivery.status,

                payment:

                    delivery.payment,

                total:

                    Number(

                        delivery.total

                    ),

                created_at:

                    delivery.created_at,

                delivery_price:

                    Number(

                        order.delivery_price

                    ),

                customer:{

                    id:

                        buyer.id,

                    first_name:

                        buyer.first_name,

                    last_name:

                        buyer.last_name,

                    phone:

                        buyer.phone,

                    address:

                        formatAddress(

                            buyer

                            .user_addresses?.[0]

                        )

                },

                seller:{

                    id:

                        seller.id,

                    first_name:

                        seller.first_name,

                    last_name:

                        seller.last_name,

                    phone:

                        seller.phone,

                    address:

                        formatAddress(

                            seller

                            .user_addresses?.[0]

                        )

                },

                books:[{

                    title:

                        sellerBook

                        .books_catalog

                        ?.title ||

                        "",

                    author:

                        sellerBook

                        .books_catalog

                        ?.author ||

                        "",

                    quantity:

                        Number(

                            order.quantity

                        ),

                    image:

                        sellerBook

                        .books_catalog

                        ?.book_images?.[0]

                        ?.image_url ||

                        null

                }]

            });

            continue;

        }
                /*
        ======================================
        EXCHANGE
        ======================================
        */

        if (delivery.exchange_delivery_id) {

            const exchange =
                delivery.exchange_delivery;

            const request =
                exchange.exchange_requests;

            /*
            =============================
            PARSE BOOK IDs FROM JSON
            =============================
            */

            const requesterBookIds =
                JSON.parse(
                    request.requester_books || "[]"
                );

            const receiverBookIds =
                JSON.parse(
                    request.receiver_books || "[]"
                );

            /*
            =============================
            FETCH REQUESTER BOOKS
            =============================
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
            =============================
            FETCH RECEIVER BOOKS
            =============================
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
            =============================
            FORMAT BOOKS
            =============================
            */

            const requesterBooksFormatted =
                requesterBooks.map(book => ({

                    title:
                        book.books_catalog
                        ?.title || "",

                    author:
                        book.books_catalog
                        ?.author || "",

                    image:
                        book.books_catalog
                        ?.book_images?.[0]
                        ?.image_url ||
                        null,

                    quantity: 1

                }));

            const receiverBooksFormatted =
                receiverBooks.map(book => ({

                    title:
                        book.books_catalog
                        ?.title || "",

                    author:
                        book.books_catalog
                        ?.author || "",

                    image:
                        book.books_catalog
                        ?.book_images?.[0]
                        ?.image_url ||
                        null,

                    quantity: 1

                }));

            result.push({

                delivery_id:
                    delivery.id,

                exchange_delivery_id:
                    exchange.id,

                type:
                    "exchange",

                status:
                    delivery.status,

                payment:
                    delivery.payment,

                requester_payment_method:
                    exchange.requester_payment_method
                    || "wallet",

                receiver_payment_method:
                    exchange.receiver_payment_method
                    || "wallet",

                requester_share:
                    Number(
                        exchange.requester_share
                    ),

                receiver_share:
                    Number(
                        exchange.receiver_share
                    ),

                total:
                    Number(delivery.total),

                created_at:
                    delivery.created_at,

                requester: {

                    id:
                        request
                        .users_exchange_requests_requester_idTousers
                        ?.id,

                    first_name:
                        request
                        .users_exchange_requests_requester_idTousers
                        ?.first_name || "",

                    last_name:
                        request
                        .users_exchange_requests_requester_idTousers
                        ?.last_name || "",

                    phone:
                        request
                        .users_exchange_requests_requester_idTousers
                        ?.phone || "",

                    address:
                        formatAddress(

                            request
                            .users_exchange_requests_requester_idTousers
                            ?.user_addresses?.[0]

                        )

                },

                receiver: {

                    id:
                        request
                        .users_exchange_requests_receiver_idTousers
                        ?.id,

                    first_name:
                        request
                        .users_exchange_requests_receiver_idTousers
                        ?.first_name || "",

                    last_name:
                        request
                        .users_exchange_requests_receiver_idTousers
                        ?.last_name || "",

                    phone:
                        request
                        .users_exchange_requests_receiver_idTousers
                        ?.phone || "",

                    address:
                        formatAddress(

                            request
                            .users_exchange_requests_receiver_idTousers
                            ?.user_addresses?.[0]

                        )

                },

                books: {

                    requester:
                        requesterBooksFormatted,

                    receiver:
                        receiverBooksFormatted

                }

            });

        }

    }

    /*
    ==========================================
    RETURN
    ==========================================
    */

    return serializeBigInt({

        data: result

    });

}
/*
==========================================================
COMPLETE DELIVERY
==========================================================
*/

export async function completeDeliveryService(

    deliveryId,

    deliveryPersonId

){

    /*
    ==========================================
    RECUPERATION LIVRAISON
    ==========================================
    */

    const delivery =

        await prisma.deliveries.findUnique({

            where:{

                id:BigInt(deliveryId)

            },

            include:{

                book_orders:true,

                user_commandes:true,

                exchange_delivery:true

            }

        });

    if(!delivery){

        throw new Error(

            "Livraison introuvable."

        );

    }

    if(

        delivery.delivery_person_id !=

        BigInt(deliveryPersonId)

    ){

        throw new Error(

            "Accès refusé."

        );

    }

    if(

        delivery.status==="delivre"

    ){

        throw new Error(

            "Cette livraison est déjà terminée."

        );

    }

    /*
    ==========================================
    WALLET LIVREUR
    ==========================================
    */

    const wallet =

        await prisma.wallets.findUnique({

            where:{

                user_id:

                    BigInt(deliveryPersonId)

            }

        });

    if(!wallet){

        throw new Error(

            "Wallet introuvable."

        );

    }

    /*
    ==========================================
    CALCUL MONTANTS
    ==========================================
    */

    let deliveryPrice = 0;

    let orderPrice = 0;

    /*
    -------------------------
    MAGAZINE
    -------------------------
    */

    if(delivery.book_orders){

        deliveryPrice =

            Number(

                delivery.book_orders

                .delivery_price

            );

        orderPrice =

            Number(

                delivery.book_orders.price

            ) *

            Number(

                delivery.book_orders.quantity

            );

    }

    /*
    -------------------------
    USER COMMANDE
    -------------------------
    */

    if(delivery.user_commandes){

        deliveryPrice =

            Number(

                delivery.user_commandes

                .delivery_price

            );

        orderPrice =

            Number(

                delivery.user_commandes

                .total_price

            ) -

            deliveryPrice;

    }

    /*
    -------------------------
    EXCHANGE
    -------------------------
    */

    if(delivery.exchange_delivery){

        deliveryPrice =

            Number(

                delivery.exchange_delivery

                .delivery_fee

            );

        orderPrice = 0;

    }

    /*
    ==========================================
    LA SUITE PARTIE 5
    ==========================================
    */
    /*
    ==========================================
    TRANSACTION
    ==========================================
    */

    await prisma.$transaction(

        async(tx)=>{

            /*
            ==========================
            WALLET
            ==========================
            */

            if (

                delivery.exchange_delivery_id

            ) {

                /*
                ==========================
                ECHANGE : VERIFIER CHAQUE
                METHODE DE PAIEMENT
                INDIVIDUELLEMENT
                ==========================
                */

                const exchange =

                    delivery.exchange_delivery;

                let totalToAdd = 0;

                let descriptionParts = [];

                /*
                DEMANDEUR
                */

                if (

                    exchange.requester_payment_method

                    === "wallet"

                ) {

                    const requesterShare =

                        Number(

                            exchange.requester_share

                        );

                    totalToAdd +=

                        requesterShare;

                    descriptionParts.push(

                        `Demandeur(wallet):+${requesterShare}DH`

                    );

                }

                else {

                    descriptionParts.push(

                        `Demandeur(espèces):pas d'ajout`

                    );

                }

                /*
                RECEVEUR
                */

                if (

                    exchange.receiver_payment_method

                    === "wallet"

                ) {

                    const receiverShare =

                        Number(

                            exchange.receiver_share

                        );

                    totalToAdd +=

                        receiverShare;

                    descriptionParts.push(

                        `Receveur(wallet):+${receiverShare}DH`

                    );

                }

                else {

                    descriptionParts.push(

                        `Receveur(espèces):pas d'ajout`

                    );

                }

                if (totalToAdd > 0) {

                    await tx.wallets.update({

                        where: {

                            id: wallet.id

                        },

                        data: {

                            balance: {

                                increment:

                                    totalToAdd

                            }

                        }

                    });

                    const exchangeBalanceBefore =

                        Number(wallet.balance);

                    const exchangeBalanceAfter =

                        exchangeBalanceBefore +

                        totalToAdd;

                    await tx

                        .wallet_transactions

                        .create({

                            data: {

                                wallet_id:

                                    wallet.id,

                                transaction_type:

                                    "delivery_fee",

                                amount:

                                    totalToAdd,

                                balance_before:

                                    exchangeBalanceBefore,

                                balance_after:

                                    exchangeBalanceAfter,

                                description:

                                    `Échange #${delivery.id} : ${descriptionParts.join(" | ")}`

                            }

                        });

                }

            }

            else if (

                delivery.payment === "wallet"

            ) {

                /*

                Le client a déjà payé.

                Le livreur reçoit

                uniquement le prix

                de livraison.

                */

                await tx.wallets.update({

                    where: {

                        id: wallet.id

                    },

                    data: {

                        balance: {

                            increment:

                                deliveryPrice

                        }

                    }

                });

                const balanceBefore =

                    Number(wallet.balance);

                const balanceAfter =

                    balanceBefore + deliveryPrice;

                await tx

                    .wallet_transactions

                    .create({

                        data: {

                            wallet_id:

                                wallet.id,

                            transaction_type:

                                "delivery_fee",

                            amount:

                                deliveryPrice,

                            balance_before:

                                balanceBefore,

                            balance_after:

                                balanceAfter,

                            description:

                                `Livraison #${delivery.id}`

                        }

                    });

            }

            else {

                /*

                ==========================

                CASH ON DELIVERY

                ==========================

                */

                /*

                Le livreur récupère

                tout l'argent chez

                le client.

                On retire seulement

                le prix de la commande

                (sans livraison)

                du wallet du livreur.

                */

                await tx.wallets.update({

                    where: {

                        id: wallet.id

                    },

                    data: {

                        balance: {

                            decrement:

                                orderPrice

                        }

                    }

                });

                const cashBalanceBefore =

                    Number(wallet.balance);

                const cashBalanceAfter =

                    cashBalanceBefore - orderPrice;

                await tx

                    .wallet_transactions

                    .create({

                        data: {

                            wallet_id:

                                wallet.id,

                            transaction_type:

                                "delivery_fee",

                            amount:

                                orderPrice,

                            balance_before:

                                cashBalanceBefore,

                            balance_after:

                                cashBalanceAfter,

                            description:

                                `Commande #${delivery.id}`

                        }

                    });

            }

            /*
            =====================================
            LA SUITE PARTIE 6
            =====================================
             /*
            =====================================
            UPDATE DELIVERY
            =====================================
            */

            await tx.deliveries.update({

                where:{

                    id:

                        BigInt(deliveryId)

                },

                data:{

                    status:

                        "delivre"

                }

            });

        }

    );

    /*
    ==========================================
    RETURN
    ==========================================
    */

    return{

        success:true,

        message:

            "Livraison terminée avec succès."

    };

}