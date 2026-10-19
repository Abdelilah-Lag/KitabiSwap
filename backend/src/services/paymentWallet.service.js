import prisma from "../config/prisma.js";


import {

    serializeBigInt

} from "../utils/serializeBigInt.js";






/*
==========================================================
GET USER WALLETS
==========================================================
*/


export async function getUserWalletsService({


    page = 1,


    limit = 25,


    search = ""


}) {



    const currentPage = Number(page) || 1;


    const pageSize = Number(limit) || 25;



    const skip =

        (currentPage - 1) * pageSize;







    const where = {};







    /*
    ======================================================
    SEARCH USER
    ======================================================
    */



    if(search) {



        where.users = {


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



        };


    }









    const [


        wallets,


        total



    ] = await Promise.all([




        prisma.wallets.findMany({



            where,



            include:{



                users:{



                    select:{


                        id:true,


                        first_name:true,


                        last_name:true,


                        email:true


                    }


                }



            },



            orderBy:{


                id:"desc"


            },



            skip,



            take:pageSize



        }),







        prisma.wallets.count({


            where


        })




    ]);









    return serializeBigInt({



        data: wallets.map((wallet)=>({



            id: wallet.id,



            balance: wallet.balance,



            created_at: wallet.created_at,



            updated_at: wallet.updated_at,



            user: wallet.users



        })),



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
/*
==========================================================
CREDIT USER WALLET
==========================================================
*/


export async function creditWalletService(

    walletId,

    data

) {


    const amount = Number(data.amount);



    if(!amount || amount <= 0) {


        throw new Error(

            "Le montant doit être supérieur à zéro."

        );


    }







    return await prisma.$transaction(async (tx)=>{





        /*
        ==================================================
        GET WALLET
        ==================================================
        */


        const wallet =

            await tx.wallets.findUnique({



                where:{


                    id: BigInt(walletId)


                }



            });






        if(!wallet) {



            throw new Error(

                "Wallet introuvable."

            );



        }








        const balanceBefore =

            Number(wallet.balance);





        const balanceAfter =

            balanceBefore + amount;









        /*
        ==================================================
        UPDATE WALLET
        ==================================================
        */



        const updatedWallet =

            await tx.wallets.update({



                where:{


                    id: BigInt(walletId)


                },



                data:{



                    balance: balanceAfter



                }



            });









        /*
        ==================================================
        CREATE TRANSACTION
        ==================================================
        */



        await tx.wallet_transactions.create({



            data:{



                wallet_id:

                    BigInt(walletId),




                transaction_type:

                   "admin_adjustment",



                amount: amount,




                balance_before:

                    balanceBefore,




                balance_after:

                    balanceAfter,




                description:

                    data.description || "Crédit administratif"




            }



        });








        return {


            message:

                "Wallet crédité avec succès.",



            wallet: updatedWallet



        };





    });




}
/*
==========================================================
DEBIT USER WALLET
==========================================================
*/


export async function debitWalletService(

    walletId,

    data

) {


    const amount = Number(data.amount);




    if(!amount || amount <= 0) {


        throw new Error(

            "Le montant doit être supérieur à zéro."

        );


    }








    return await prisma.$transaction(async (tx)=>{





        /*
        ==================================================
        GET WALLET
        ==================================================
        */


        const wallet =

            await tx.wallets.findUnique({



                where:{


                    id: BigInt(walletId)


                }



            });







        if(!wallet) {


            throw new Error(

                "Wallet introuvable."

            );


        }









        const balanceBefore =

            Number(wallet.balance);






        const balanceAfter =

            balanceBefore - amount;







        /*
        ==================================================
        CHECK BALANCE
        ==================================================
        */


        if(balanceAfter < 0) {



            throw new Error(

                "Solde insuffisant pour effectuer ce débit."

            );



        }









        /*
        ==================================================
        UPDATE WALLET
        ==================================================
        */


        const updatedWallet =

            await tx.wallets.update({



                where:{


                    id: BigInt(walletId)


                },



                data:{



                    balance: balanceAfter



                }



            });









        /*
        ==================================================
        CREATE TRANSACTION
        ==================================================
        */


        await tx.wallet_transactions.create({



            data:{



                wallet_id:

                    BigInt(walletId),




                transaction_type:

                    "admin_adjustment",




                amount:

                    -amount,




                balance_before:

                    balanceBefore,




                balance_after:

                    balanceAfter,




                description:

                    data.description ||

                    "Débit administratif"




            }



        });









        return {



            message:

                "Wallet débité avec succès.",



            wallet: updatedWallet



        };





    });




}