import prisma from "../config/prisma.js";

import {
    serializeBigInt
} from "../utils/serializeBigInt.js";


function getCoverImage(book) {

    if (
        !book.books_catalog ||
        !book.books_catalog.book_images
    ) {

        return null;

    }


    const image =
        book.books_catalog.book_images
            .find(img => img.is_cover)
        ||
        book.books_catalog.book_images[0];


    return image?.image_url || null;

}



function formatBook(book) {

    return {

        id: book.id,

        title:
            book.books_catalog?.title,

        author:
            book.books_catalog?.author,

        isbn:
            book.books_catalog?.isbn,

        language:
            book.books_catalog?.language,

        category:
            book.books_catalog?.category,


        condition:
            book.book_condition,


        status:
            book.status,


        image:
            getCoverImage(book),


        owner: {

            id:
                book.users.id,

            name:
                `${book.users.first_name} ${book.users.last_name}`,

            email:
                book.users.email,

            phone:
                book.users.phone,

            avatar:
                book.users.avatar_url

        },


        createdAt:
            book.created_at

    };

}



/*
====================================================
GET BOOKS TO EXCHANGE
====================================================
*/

export async function getControllerExchangeBooksService({

    page = 1,
    limit = 10,
    search = ""

}) {


    page = Number(page);
    limit = Number(limit);



    const where = {


        status: "available",


        OR: search

        ?

        [

            {

                books_catalog: {

                    title: {

                        contains: search

                    }

                }

            },

            {

                books_catalog: {

                    author: {

                        contains: search

                    }

                }

            },

            {

                users: {

                    first_name: {

                        contains: search

                    }

                }

            },

            {

                users: {

                    last_name: {

                        contains: search

                    }

                }

            }

        ]

        :

        undefined


    };



    const totalItems =
        await prisma.user_books.count({

            where

        });




    const books =
        await prisma.user_books.findMany({

            where,


            skip:
                (page - 1) * limit,


            take:
                limit,


            orderBy: {

                created_at:"desc"

            },


            include: {


                books_catalog: {


                    include: {


                        book_images: {


                            orderBy:{

                                id:"asc"

                            }


                        }


                    }


                },


                users:true


            }


        });





    return serializeBigInt({

        books:
            books.map(formatBook),


        currentPage:
            page,


        totalPages:
            Math.ceil(
                totalItems / limit
            ),


        totalItems


    });


}





/*
====================================================
DELETE BOOK
====================================================
*/

export async function deleteControllerExchangeBookService(id){


    const book =
        await prisma.user_books.findUnique({

            where:{
                id:BigInt(id)
            }

        });



    if(!book){

        throw new Error(
            "Livre introuvable."
        );

    }



    await prisma.user_books.delete({

        where:{
            id:BigInt(id)
        }

    });



    return {

        message:
            "Livre supprimé avec succès."

    };


}
