// services/deliveryMagazine.service.js

import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serializeBigInt.js";


/*
====================================================
 GET MAGAZINE DELIVERY ORDERS
====================================================
*/

export async function getDeliveryMagazineOrdersService() {


    /*
    ==========================================
    COMMANDES DEJA PRISES PAR UN LIVREUR
    ==========================================
    */

    const existingDeliveries =
        await prisma.deliveries.findMany({

            where: {

                OR: [

                    {
                        book_order_id: {
                            not: null
                        }
                    },

                    {
                        user_commande_id: {
                            not: null
                        }
                    }

                ]

            },

            select: {

                book_order_id: true,

                user_commande_id: true

            }

        });



    const deliveredBookOrderIds =
        existingDeliveries

        .filter(
            item => item.book_order_id !== null
        )

        .map(
            item => item.book_order_id
        );




    /*
    ==========================================
    BOOK ORDERS MAGAZINE
    ==========================================
    */

    const bookOrders =

        await prisma.book_orders.findMany({

            where: {

                user_book_to_sell_id: null,


                status: "valide",


                id: {

                    notIn:

                        deliveredBookOrderIds.length

                        ? deliveredBookOrderIds

                        : [BigInt(0)]

                }

            },


            include: {


                users: true,


                shop_inventory: {


                    include: {


                        books_catalog: {


                            include: {


                                book_images: true


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


    const formattedBookOrders =

        bookOrders.map(order => {


            const book =
                order.shop_inventory
                ?.books_catalog;



            return {


                source: "book_order",


                id: order.id,


                customer: {


                    id: order.user_id,


                    name:
                    `${order.users.first_name}
                     ${order.users.last_name}`,


                    phone:
                    order.users.phone

                },



                books: [


                    {


                        title:
                        book?.title || "",



                        images:
                        book?.book_images || []


                    }


                ],



                books_count:
                    order.quantity,



                total:
                    order.price,



                delivery_price:
                    order.delivery_price,



                payment:
                    order.payment_method,



                created_at:
                    order.created_at


            };


        });





    /*
    ==========================================
    USER COMMANDES DEJA PRISES
    ==========================================
    */


    const deliveredUserCommandeIds =

        existingDeliveries

        .filter(
            item => item.user_commande_id !== null
        )

        .map(
            item => item.user_commande_id
        );





    /*
    ==========================================
    USER COMMANDES
    ==========================================
    */


    const userCommandes =

        await prisma.user_commandes.findMany({


            where: {


                order_status: {

                    in: [

                        "confirmed",

                        "shipping"

                    ]

                },


                id: {


                    notIn:

                        deliveredUserCommandeIds.length

                        ? deliveredUserCommandeIds

                        : [BigInt(0)]

                }


            },


            include: {


                users: true


            },


            orderBy: {


                created_at: "desc"


            }


        });






    /*
    ==========================================
    FORMAT USER COMMANDES
    ==========================================
    */


    const formattedUserCommandes = [];





    for (const order of userCommandes) {



        let achats = [];



        try {


            achats = JSON.parse(
                order.achats_json
            );


        }

        catch(error){


            console.log(
                "ACHATS JSON ERROR",
                order.id,
                error
            );


            continue;


        }






        const books = [];





        for (const achatId of achats) {

            const achat = await prisma.user_achat.findUnique({
                where: { id: BigInt(achatId) }
            });

            if (!achat) {
                continue;
            }

            /*
            ==============================
            LIVRE MAGAZINE
            ==============================
            */

            if (achat.shop_inventory_id) {

                const shopBook =
                    await prisma.shop_inventory.findUnique({

                        where: {

                            id: BigInt(achat.shop_inventory_id)

                        },

                        include: {

                            books_catalog: {

                                include: {

                                    book_images: true

                                }

                            }

                        }

                    });

                if (shopBook) {

                    books.push({

                        title: shopBook.books_catalog.title,

                        images: shopBook.books_catalog.book_images || [],

                        quantity: Number(achat.quantity) || 1

                    });

                }

            }

            /*
            ==============================
            LIVRE USER TO SELL
            ==============================
            */

            if (achat.user_book_to_sell_id) {

                const userBook =
                    await prisma.user_books_to_sell.findUnique({

                        where: {

                            id: BigInt(achat.user_book_to_sell_id)

                        },

                        include: {

                            books_catalog: {

                                include: {

                                    book_images: true

                                }

                            }

                        }

                    });

                if (userBook) {

                    books.push({

                        title: userBook.books_catalog.title,

                        images: userBook.books_catalog.book_images || [],

                        quantity: Number(achat.quantity) || 1

                    });

                }

            }

        }






        formattedUserCommandes.push({



            source:
            "user_commande",



            id:
            order.id,



            customer:{


                id:
                order.user_id,


                name:
                `${order.users.first_name}
                 ${order.users.last_name}`,


                phone:
                order.users.phone


            },



            books,



            books_count:

                books.reduce(

                    (total,book)=>

                        total + Number(book.quantity),

                    0

                ),




            total:
            order.total_price,



            delivery_price:
            order.delivery_price,



            payment:
            order.payment_type,



            created_at:
            order.created_at



        });

    }
    /*
    ==========================================
    MERGE ALL DELIVERY ORDERS
    ==========================================
    */


    const orders = [

        ...formattedBookOrders,

        ...formattedUserCommandes

    ];





    /*
    ==========================================
    SORT BY DATE
    ==========================================
    */


    orders.sort(

        (a,b) =>

            new Date(b.created_at)

            -

            new Date(a.created_at)

    );






    /*
    ==========================================
    RETURN
    ==========================================
    */


    return serializeBigInt({

        data: orders

    });

}
/*
====================================================
 PRENDRE UNE COMMANDE MAGAZINE
====================================================
*/


export async function takeDeliveryMagazineOrderService({

    source,

    id,

    delivery_person_id

}) {



    /*
    ==========================================
    VERIFICATION EXISTENCE DELIVERY
    ==========================================
    */


    const existingDelivery =

        await prisma.deliveries.findFirst({

            where:


                source === "book_order"

                ?

                {

                    book_order_id:
                    BigInt(id)

                }

                :

                {

                    user_commande_id:
                    BigInt(id)

                }


        });




    if(existingDelivery){


        throw new Error(
            "Cette commande est déjà prise"
        );


    }







    /*
    ==========================================
    BOOK ORDER
    ==========================================
    */


    if(source === "book_order"){



        const order =

            await prisma.book_orders.findUnique({


                where:{


                    id:
                    BigInt(id)


                }


            });





        if(!order){


            throw new Error(
                "Commande introuvable"
            );


        }





        const delivery =

            await prisma.deliveries.create({



                data:{


                    delivery_person_id:
                    BigInt(delivery_person_id),



                    book_order_id:
                    BigInt(id),



                    status:
                    "en_cours",



                    total:
                    order.price,



                    payment:
                    order.payment_method


                }



            });


        


        return delivery;

    }

    /*
    ==========================================
    USER COMMANDE
    ==========================================
    */


    if(source === "user_commande"){



        const order =

            await prisma.user_commandes.findUnique({


                where:{


                    id:
                    BigInt(id)


                }


            });






        if(!order){


            throw new Error(
                "Commande introuvable"
            );


        }







        const delivery =

            await prisma.deliveries.create({



                data:{


                    delivery_person_id:
                    BigInt(delivery_person_id),




                    user_commande_id:
                    BigInt(id),




                    status:
                    "en_cours",




                    total:
                    order.total_price,




                    payment:
                    order.payment_type



                }



            });






        return delivery;



    }






    throw new Error(
        "Source invalide"
    );


}
/*
====================================================
 GET USER COMMANDES DELIVERY
====================================================
*/

export async function getDeliveryMagazineUserCommandesService(){

    const deliveries =

        await prisma.deliveries.findMany({

            where:{

                user_commande_id:{
                    not:null
                }

            },

            select:{

                user_commande_id:true

            }

        });



    const assignedIds =

        deliveries.map(

            item=>item.user_commande_id

        );





    const commandes =

        await prisma.user_commandes.findMany({

            where:{


                order_status:"confirmed",


                id:{

                    notIn:

                    assignedIds.length

                    ?

                    assignedIds

                    :

                    [BigInt(0)]

                }


            },


            include:{


                users:true


            },


            orderBy:{


                created_at:"desc"


            }


        });





    const result=[];





    for(const commande of commandes){


        let achats=[];


        try{


            achats = JSON.parse(
                commande.achats_json
            );


        }

        catch(error){

            continue;

        }





        const books=[];





        for (const achatId of achats) {

            const achat = await prisma.user_achat.findUnique({
                where: { id: BigInt(achatId) }
            });

            if (!achat) {
                continue;
            }

            /*
            ==============================
            LIVRE MAGAZINE
            ==============================
            */

            if (achat.shop_inventory_id) {

                const shopBook =
                    await prisma.shop_inventory.findUnique({

                        where: {
                            id: BigInt(achat.shop_inventory_id)
                        },

                        include: {

                            books_catalog: {

                                include: {

                                    book_images: true

                                }

                            }

                        }

                    });

                if (shopBook) {

                    books.push({

                        title: shopBook.books_catalog.title,

                        images: shopBook.books_catalog.book_images,

                        quantity: Number(achat.quantity) || 1

                    });

                }

            }

            /*
            ==============================
            LIVRE USER TO SELL
            ==============================
            */

            if (achat.user_book_to_sell_id) {

                const userBook =
                    await prisma.user_books_to_sell.findUnique({

                        where: {
                            id: BigInt(achat.user_book_to_sell_id)
                        },

                        include: {

                            books_catalog: {

                                include: {

                                    book_images: true

                                }

                            }

                        }

                    });

                if (userBook) {

                    books.push({

                        title: userBook.books_catalog.title,

                        images: userBook.books_catalog.book_images,

                        quantity: Number(achat.quantity) || 1

                    });

                }

            }

        }






        result.push({


            source:"user_commande",


            id:commande.id,



            customer:{


                name:

                `${commande.users.first_name} ${commande.users.last_name}`,



                phone:

                commande.users.phone


            },



            books,



            books_count:

            books.reduce(

                (sum,b)=>

                sum + Number(b.quantity),

                0

            ),



            total:

            commande.total_price,



            delivery_price:

            commande.delivery_price,



            payment:

            commande.payment_type,



            created_at:

            commande.created_at


        });



    }





    return serializeBigInt({

        data:result

    });


}