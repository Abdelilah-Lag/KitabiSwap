import {

    getWalletTransactionsService

} from "../services/paymentTransaction.service.js";



/*
==========================================================
GET WALLET TRANSACTIONS
==========================================================
*/

export async function getWalletTransactionsController(

    req,

    res

) {


    try {



        const data =

            await getWalletTransactionsService({


                page: req.query.page,


                limit: req.query.limit,


                search: req.query.search || "",


                type: req.query.type || "",


                date: req.query.date || ""


            });





        res.status(200).json(data);



    }


    catch(error) {



        console.error(

            "GET_WALLET_TRANSACTIONS_ERROR",

            error

        );



        res.status(500).json({


            message:

                "Erreur lors du chargement des transactions wallet."


        });



    }



}