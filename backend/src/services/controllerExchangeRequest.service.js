import prisma from "../config/prisma.js";

import {
    serializeBigInt
} from "../utils/serializeBigInt.js";


/* ==========================================================
   HELPERS
========================================================== */


function parseBooks(value) {

    if (!value) return [];

    if (Array.isArray(value)) {
        return value.map(Number);
    }

    try {

        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
            return parsed.map(Number);
        }

        return [];

    } catch {

        return [];

    }

}



function getCoverImage(book) {

    const images = book.books_catalog?.book_images;

    if (!images || images.length === 0) {
        return null;
    }

    return images[0].image_url;

}



function getFullName(user) {

    if (!user) return "";

    return `${user.first_name} ${user.last_name}`;

}



function formatBook(book) {

    return {

        id: book.id,

        catalogId: book.book_catalog_id,

        title: book.books_catalog?.title,

        author: book.books_catalog?.author,

        isbn: book.books_catalog?.isbn,

        edition: book.books_catalog?.edition,

        language: book.books_catalog?.language,

        publisher: book.books_catalog?.publisher,

        publicationYear:
            book.books_catalog?.publication_year,

        pages:
            book.books_catalog?.pages,

        condition:
            book.book_condition,

        image:
            getCoverImage(book)

    };

}



function formatAddress(address) {

    if (!address) return null;


    return {

        id: address.id,

        phone: address.phone,

        city: address.city,

        region: address.region,

        postalCode: address.postal_code,

        latitude: address.latitude,

        longitude: address.longitude

    };

}




/* ==========================================================
   GET PENDING EXCHANGE REQUESTS
========================================================== */


export async function getPendingExchangeRequestsService({

    page = 1,
    limit = 10,
    search = ""

}) {


    page = Number(page);
    limit = Number(limit);



    const where = {

        status:"pending"

    };



    const totalItems = await prisma.exchange_delivery.count({

        where

    });



    const deliveries =
        await prisma.exchange_delivery.findMany({

        where,

        skip:(page - 1) * limit,

        take:limit,

        orderBy:{

            created_at:"desc"

        },


        include:{


            exchange_requests:{


                include:{


                    users_exchange_requests_requester_idTousers:true,

                    users_exchange_requests_receiver_idTousers:true


                }


            }


        }


    });




    const exchanges=[];




    for(const delivery of deliveries){


        const exchange =
            delivery.exchange_requests;



        const [
            requesterAddress,
            receiverAddress

        ] = await Promise.all([



            prisma.user_addresses.findFirst({

                where:{

                    user_id:exchange.requester_id,

                    is_default:true

                }

            }),



            prisma.user_addresses.findFirst({

                where:{

                    user_id:exchange.receiver_id,

                    is_default:true

                }

            })


        ]);





        const requesterBookIds =
            parseBooks(exchange.requester_books);



        const receiverBookIds =
            parseBooks(exchange.receiver_books);






        const [

            requesterBooks,

            receiverBooks


        ] = await Promise.all([




            prisma.user_books.findMany({

                where:{

                    id:{

                        in:
                        requesterBookIds.map(
                            id=>BigInt(id)
                        )

                    }

                },


                include:{


                    books_catalog:{


                        include:{


                            book_images:{


                                orderBy:{

                                    id:"asc"

                                }

                            }


                        }


                    }


                }


            }),





            prisma.user_books.findMany({

                where:{

                    id:{

                        in:
                        receiverBookIds.map(
                            id=>BigInt(id)
                        )

                    }

                },


                include:{


                    books_catalog:{


                        include:{


                            book_images:{


                                orderBy:{

                                    id:"asc"

                                }

                            }


                        }


                    }


                }


            })



        ]);








        exchanges.push({



            id:delivery.id,


            exchangeRequestId:
                delivery.exchange_request_id,


            status:
                delivery.status,


            notes:
                delivery.notes,



            createdAt:
                delivery.created_at,



            delivery:{


                fee:Number(delivery.delivery_fee),


                requesterShare:
                    Number(delivery.requester_share),


                receiverShare:
                    Number(delivery.receiver_share),


                requesterPaymentMethod:
                    delivery.requester_payment_method,


                receiverPaymentMethod:
                    delivery.receiver_payment_method,


                requesterPaid:
                    delivery.requester_paid,


                receiverPaid:
                    delivery.receiver_paid


            },





            requester:{


                id:exchange.requester_id,


                fullName:
                    getFullName(
                    exchange.users_exchange_requests_requester_idTousers
                    ),


                email:
                    exchange.users_exchange_requests_requester_idTousers.email,


                phone:
                    exchange.users_exchange_requests_requester_idTousers.phone,


                avatar:
                    exchange.users_exchange_requests_requester_idTousers.avatar_url,



                address:
                    formatAddress(requesterAddress),



                books:
                    requesterBooks.map(formatBook)


            },





            receiver:{


                id:exchange.receiver_id,


                fullName:
                    getFullName(
                    exchange.users_exchange_requests_receiver_idTousers
                    ),


                email:
                    exchange.users_exchange_requests_receiver_idTousers.email,


                phone:
                    exchange.users_exchange_requests_receiver_idTousers.phone,


                avatar:
                    exchange.users_exchange_requests_receiver_idTousers.avatar_url,



                address:
                    formatAddress(receiverAddress),



                books:
                    receiverBooks.map(formatBook)


            }



        });



    }





    return serializeBigInt({

        exchanges,

        currentPage:page,

        totalPages:
            Math.ceil(totalItems / limit),

        totalItems


    });



}







/* ==========================================================
   START COLLECTING BOOKS
========================================================== */


export async function startCollectingBooksService(

    deliveryId,

    controllerId

){


    const delivery =
        await prisma.exchange_delivery.findUnique({

        where:{
            id:BigInt(deliveryId)
        }

    });



    if(!delivery){

        throw new Error(
            "Demande introuvable."
        );

    }



    const updated =
        await prisma.exchange_delivery.update({

        where:{
            id:BigInt(deliveryId)
        },


        data:{


            status:"collecting_books",

            delivery_person_id:
                BigInt(controllerId),


            updated_at:new Date()


        }


    });



    return serializeBigInt(updated);


}







/* ==========================================================
   REJECT EXCHANGE REQUEST
========================================================== */


export async function rejectExchangeRequestService(

    deliveryId,

    controllerId,

    reason

){


    const delivery =
        await prisma.exchange_delivery.findUnique({

        where:{
            id:BigInt(deliveryId)
        }

    });



    if(!delivery){

        throw new Error(
            "Demande introuvable."
        );

    }




    const updated =
        await prisma.exchange_delivery.update({

        where:{
            id:BigInt(deliveryId)
        },


        data:{


            status:"cancelled",


            notes:
                reason ||
                "Demande refusée par le contrôleur.",


            delivery_person_id:
                BigInt(controllerId),


            updated_at:new Date()


        }


    });



    return serializeBigInt(updated);


}