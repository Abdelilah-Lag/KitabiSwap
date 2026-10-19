import prisma from "../config/prisma.js";


import {

    serializeBigInt

} from "../utils/serializeBigInt.js";





/*
==========================================================
GET WALLET TRANSACTIONS
==========================================================
*/


export async function getWalletTransactionsService({


    page = 1,


    limit = 25,


    search = "",


    type = "",


    date = ""


}) {



    const currentPage = Number(page) || 1;


    const pageSize = Number(limit) || 25;


    const skip =

        (currentPage - 1) * pageSize;





    /*
    ======================================================
    FILTER
    ======================================================
    */


    const where = {};





    /*
    ======================================================
    TYPE FILTER
    ======================================================
    */


    if(type) {


        where.transaction_type = type;


    }








    /*
    ======================================================
    DATE FILTER
    ======================================================
    */


    if(date) {


        const startDate = new Date(date);


        const endDate = new Date(date);


        endDate.setDate(

            endDate.getDate() + 1

        );



        where.created_at = {


            gte: startDate,


            lt: endDate


        };


    }








    /*
    ======================================================
    SEARCH USER
    ======================================================
    */


    if(search) {



        where.wallets = {


            users:{


                OR:[


                    {


                        first_name:{


                            contains: search


                        }


                    },



                    {


                        last_name:{


                            contains: search


                        }


                    },



                    {


                        email:{


                            contains: search


                        }


                    }



                ]


            }


        };


    }










    /*
    ======================================================
    DATABASE QUERY
    ======================================================
    */



    const [


        transactions,


        total



    ] = await Promise.all([




        prisma.wallet_transactions.findMany({



            where,



            include:{



                wallets:{



                    include:{



                        users:{



                            select:{


                                id:true,


                                first_name:true,


                                last_name:true,


                                email:true



                            }



                        }



                    }



                }



            },



            orderBy:{


                created_at:"desc"


            },



            skip,



            take: pageSize



        }),






        prisma.wallet_transactions.count({



            where



        })




    ]);











    /*
    ======================================================
    FORMAT DATA FOR FRONTEND
    ======================================================
    */


    const formattedTransactions =

        transactions.map((transaction)=>({



            id: transaction.id,



            type: transaction.transaction_type,


            amount: transaction.amount,



            balance_before:

                transaction.balance_before,



            balance_after:

                transaction.balance_after,



            description:

                transaction.description,



            created_at:

                transaction.created_at,



            user:

                transaction.wallets?.users || null



        }));











    return serializeBigInt({



        data: formattedTransactions,



        pagination:{



            page: currentPage,



            pageSize,



            total,



            totalPages:

                Math.ceil(

                    total / pageSize

                )



        }



    });



}