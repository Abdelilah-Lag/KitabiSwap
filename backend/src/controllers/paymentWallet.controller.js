import {

    getUserWalletsService,
    creditWalletService,
    debitWalletService

} from "../services/paymentWallet.service.js";
import {

    serializeBigInt

} from "../utils/serializeBigInt.js";




/*
==========================================================
GET USER WALLETS
==========================================================
*/

export async function getUserWalletsController(

    req,

    res

) {


    try {


        const data =

            await getUserWalletsService({


                page:

                    req.query.page,


                limit:

                    req.query.limit,


                search:

                    req.query.search || ""


            });




        res.status(200).json(data);



    }


    catch(error) {



        console.error(

            "GET_USER_WALLETS_ERROR",

            error

        );



        res.status(500).json({


            message:

                "Erreur lors du chargement des wallets utilisateurs."


        });



    }


}
/*
==========================================================
CREDIT USER WALLET
==========================================================
*/

export async function creditWalletController(req,res){


    try{


        const data = await creditWalletService(

            req.params.id,

            req.body,

            req.user

        );



        res.status(200).json(

            serializeBigInt(data)

        );



    }


    catch(error){


        console.error(

            "CREDIT_WALLET_ERROR",

            error

        );


        res.status(400).json({

            message:error.message

        });


    }


}
/*
==========================================================
DEBIT USER WALLET
==========================================================
*/

export async function debitWalletController(

    req,

    res

) {


    try {



        const data =

            await debitWalletService(



                req.params.id,



                req.body



            );





        res.status(200).json(serializeBigInt(data));



    }


    catch(error) {



        console.error(

            "DEBIT_WALLET_ERROR",

            error

        );




        res.status(400).json({



            message:

                error.message



        });



    }



}