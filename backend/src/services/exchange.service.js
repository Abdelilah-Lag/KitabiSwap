import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";


const prisma = new PrismaClient();



/* =====================================================
   HELPERS
===================================================== */


function toNumber(value) {

    return value == null ? 0 : Number(value);

}



/*
=====================================================
GET COVER IMAGE
=====================================================
*/

function getCoverImage(bookCatalog) {

    return (

        bookCatalog.book_images.find(

            image => image.is_cover

        )?.image_url

        ||

        bookCatalog.book_images[0]?.image_url

        ||

        null

    );

}



/*
=====================================================
MAP IMAGES
=====================================================
*/

function mapImages(bookCatalog) {

    return bookCatalog.book_images.map(image => ({

        id: Number(image.id),

        image_url: image.image_url,

        cover: image.is_cover

    }));

}



/*
=====================================================
MAP BOOK RESPONSE
=====================================================
*/

function mapBook(book) {


    const city =
        book.users?.user_addresses?.[0]?.city || null;



    return {


        id: Number(book.id),


        catalog_id:
            Number(book.books_catalog.id),



        condition:
            book.book_condition,



        estimated_price:
            toNumber(book.estimated_price),



        created_at:
            book.created_at,



        status:
            book.status,



        owner:

            book.users

                ?

            `${book.users.first_name} ${book.users.last_name}`

                :

            null,



        owner_id:

            book.users

                ?

            Number(book.users.id)

                :

            null,



        owner_avatar:

            book.users?.avatar_url || null,



        /*
        ===============================
        CITY CORRECTED
        ===============================
        */

        city,



        isbn:
            book.books_catalog.isbn,



        title:
            book.books_catalog.title,



        subtitle:
            book.books_catalog.subtitle,



        author:
            book.books_catalog.author,



        publisher:
            book.books_catalog.publisher,



        edition:
            book.books_catalog.edition,



        publication_year:
            book.books_catalog.publication_year,



        language:
            book.books_catalog.language,



        category:
            book.books_catalog.category,



        cover_type:
            book.books_catalog.cover_type,



        target_audience:
            book.books_catalog.target_audience,



        pages:
            book.books_catalog.pages,



        dimensions:
            book.books_catalog.dimensions,



        weight:
            book.books_catalog.weight,



        description:
            book.books_catalog.description,



        summary:
            book.books_catalog.summary,



        average_rating:

            toNumber(

                book.books_catalog.average_rating

            ),



        total_reviews:

            book.books_catalog.total_reviews,



        cover:

            getCoverImage(

                book.books_catalog

            ),



        images:

            mapImages(

                book.books_catalog

            )


    };


}







/* =====================================================
   LISTE DES LIVRES DISPONIBLES
===================================================== */


export async function getExchangeBooksService(

    filters,

    currentUserId

) {


    const where = {


        status: "available",


        is_visible: true,



        NOT: {


            user_id:

                BigInt(currentUserId)


        }


    };



    if(filters.condition){


        where.book_condition =
            filters.condition;


    }





    if(filters.search){


        where.books_catalog = {


            OR:[


                {


                    title:{


                        contains:
                            filters.search


                    }


                },


                {


                    author:{


                        contains:
                            filters.search


                    }


                },


                {


                    isbn:{


                        contains:
                            filters.search


                    }


                }


            ]


        };


    }
    const books = await prisma.user_books.findMany({


        where,


        orderBy:{


            created_at:"desc"


        },



        include:{



            users:{


                select:{


                    id:true,


                    first_name:true,


                    last_name:true,


                    avatar_url:true,



                    user_addresses:{


                        where:{


                            is_default:true


                        },


                        take:1,


                        select:{


                            city:true


                        }


                    }


                }


            },



            books_catalog:{


                include:{


                    book_images:{


                        orderBy:{


                            sort_order:"asc"


                        }


                    }


                }


            }


        }


    });





    const mappedBooks = books.map(mapBook);



    console.log(
        "========== MAPPED BOOKS =========="
    );



    console.dir(

        mappedBooks[0],

        {
            depth:3
        }

    );



    return mappedBooks;



}








/* =====================================================
   DETAILS D'UN LIVRE
===================================================== */


export async function getExchangeBookService(


    bookId,


    currentUserId


){



    const book = await prisma.user_books.findUnique({



        where:{


            id:BigInt(bookId)


        },



        include:{



            users:{


                select:{


                    id:true,


                    first_name:true,


                    last_name:true,


                    avatar_url:true,



                    user_addresses:{


                        where:{


                            is_default:true


                        },


                        take:1,


                        select:{


                            city:true


                        }


                    }


                }


            },



            books_catalog:{


                include:{


                    book_images:{


                        orderBy:{


                            sort_order:"asc"


                        }


                    }


                }


            }


        }



    });





    if(!book){


        return null;


    }




    return mapBook(book);



}








/* =====================================================
   MES LIVRES DISPONIBLES
===================================================== */



export async function getMyBooksService(


    currentUserId


){



    const books = await prisma.user_books.findMany({



        where:{


            user_id:BigInt(currentUserId),


            status:"available",


            is_visible:true


        },



        orderBy:{


            created_at:"desc"


        },



        include:{



            users:{


                select:{


                    id:true,


                    first_name:true,


                    last_name:true,


                    avatar_url:true,



                    user_addresses:{


                        where:{


                            is_default:true


                        },


                        take:1,


                        select:{


                            city:true


                        }


                    }


                }


            },



            books_catalog:{


                include:{


                    book_images:{


                        orderBy:{


                            sort_order:"asc"


                        }


                    }


                }


            }


        }



    });



    return books.map(mapBook);



}
/* =====================================================
   PAGE DE CREATION D'UNE DEMANDE D'ECHANGE
===================================================== */


export async function getExchangeRequestPageService(

    bookId,

    currentUserId

){



    const requestedBook = await prisma.user_books.findUnique({


        where:{


            id:BigInt(bookId)


        },


        select:{


            user_id:true


        }


    });



    if(!requestedBook){


        return null;


    }




    const ownerId = Number(requestedBook.user_id);




    const [

        ownerBooks,

        myBooks,

        ownerUser

    ] = await Promise.all([





        prisma.user_books.findMany({



            where:{


                user_id:BigInt(ownerId),


                status:"available",


                is_visible:true


            },



            orderBy:{


                created_at:"desc"


            },



            include:{



                users:{


                    select:{


                        id:true,


                        first_name:true,


                        last_name:true,


                        avatar_url:true,



                        user_addresses:{


                            where:{


                                is_default:true


                            },


                            take:1,


                            select:{


                                city:true


                            }


                        }


                    }


                },



                books_catalog:{


                    include:{


                        book_images:{


                            orderBy:{


                                sort_order:"asc"


                            }


                        }


                    }


                }


            }



        }),





        prisma.user_books.findMany({



            where:{


                user_id:BigInt(currentUserId),


                status:"available",


                is_visible:true


            },



            orderBy:{


                created_at:"desc"


            },



            include:{



                users:{


                    select:{


                        id:true,


                        first_name:true,


                        last_name:true,


                        avatar_url:true,



                        user_addresses:{


                            where:{


                                is_default:true


                            },


                            take:1,


                            select:{


                                city:true


                            }


                        }


                    }


                },



                books_catalog:{


                    include:{


                        book_images:{


                            orderBy:{


                                sort_order:"asc"


                            }


                        }


                    }


                }


            }



        }),





        prisma.users.findUnique({



            where:{


                id:BigInt(ownerId)


            },



            select:{


                id:true,


                first_name:true,


                last_name:true,


                avatar_url:true,



                user_addresses:{


                    where:{


                        is_default:true


                    },


                    take:1,


                    select:{


                        city:true


                    }


                }


            }



        })



    ]);






    return {



        owner:

            ownerUser

            ?

            {


                id:Number(ownerUser.id),



                name:

                    `${ownerUser.first_name} ${ownerUser.last_name}`,



                avatar_url:

                    ownerUser.avatar_url,



                city:

                    ownerUser.user_addresses?.[0]?.city || null


            }


            :

            null,





        requestedBooks:


            ownerBooks.map(mapBook),





        myBooks:


            myBooks.map(mapBook)



    };

}









/* =====================================================
   CREER UNE DEMANDE D'ECHANGE
===================================================== */


export async function createExchangeRequestService(

    currentUserId,

    data

){


    const {


        requestedBooks,


        offeredBooks,


        message


    } = data;





    if(

        !Array.isArray(requestedBooks)

        ||

        requestedBooks.length === 0

    ){


        throw new Error(

            "Sélectionnez au moins un livre demandé."

        );


    }




    if(

        !Array.isArray(offeredBooks)

        ||

        offeredBooks.length === 0

    ){


        throw new Error(

            "Sélectionnez au moins un livre offert."

        );


    }




    if(requestedBooks.length > 5){


        throw new Error(

            "Maximum 5 livres demandés."

        );


    }




    if(offeredBooks.length > 5){


        throw new Error(

            "Maximum 5 livres offerts."

        );


    }






    const requestedRows = await prisma.user_books.findMany({



        where:{


            id:{


                in:

                requestedBooks.map(

                    id=>BigInt(id)

                )


            }


        },



        select:{


            id:true,


            user_id:true,


            status:true


        }



    });






    if(

        requestedRows.length !== requestedBooks.length

    ){


        throw new Error(

            "Un ou plusieurs livres demandés sont invalides."

        );


    }






    for(const row of requestedRows){



        if(row.status !== "available"){


            throw new Error(

                "Un ou plusieurs livres demandés ne sont plus disponibles."

            );


        }



        if(

            Number(row.user_id)

            ===

            Number(currentUserId)

        ){


            throw new Error(

                "Vous ne pouvez pas demander votre propre livre."

            );


        }


    }






    const receiverIds = [



        ...new Set(


            requestedRows.map(

                row=>Number(row.user_id)

            )


        )


    ];





    if(receiverIds.length !== 1){


        throw new Error(

            "Tous les livres demandés doivent appartenir au même utilisateur."

        );


    }





    const receiverId = receiverIds[0];






    const offeredRows = await prisma.user_books.findMany({



        where:{


            id:{


                in:

                offeredBooks.map(

                    id=>BigInt(id)

                )


            }


        },



        select:{


            id:true,


            user_id:true,


            status:true


        }



    });






    if(

        offeredRows.length !== offeredBooks.length

    ){


        throw new Error(

            "Un ou plusieurs livres offerts sont invalides."

        );


    }






    for(const row of offeredRows){



        if(

            Number(row.user_id)

            !==

            Number(currentUserId)

        ){


            throw new Error(

                "Tous les livres offerts doivent vous appartenir."

            );


        }



        if(row.status !== "available"){


            throw new Error(

                "Un de vos livres n'est plus disponible."

            );


        }


    }






    const existingRequest = await prisma.exchange_requests.findFirst({



        where:{


            requester_id:BigInt(currentUserId),


            receiver_id:BigInt(receiverId),


            status:"pending"


        }



    });






    if(existingRequest){


        throw new Error(

            "Une demande est déjà en attente pour cet utilisateur."

        );


    }






    const expiresAt = new Date();


    expiresAt.setDate(

        expiresAt.getDate()+10

    );






    const exchange = await prisma.exchange_requests.create({



        data:{



            uuid:randomUUID(),



            requester_id:BigInt(currentUserId),



            receiver_id:BigInt(receiverId),



            requester_books:

                JSON.stringify(offeredBooks),



            receiver_books:

                JSON.stringify(requestedBooks),



            requester_message:

                message || null,



            status:"pending",



            receiver_confirmed:false,



            expires_at:expiresAt



        }



    });






    return {



        id:Number(exchange.id),


        status:exchange.status,


        receiver_confirmed:

            exchange.receiver_confirmed,



        expires_at:

            exchange.expires_at



    };

}