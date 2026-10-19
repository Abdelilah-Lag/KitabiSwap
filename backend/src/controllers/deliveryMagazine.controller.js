import {

    getDeliveryMagazineOrdersService,
    getDeliveryMagazineUserCommandesService,
    takeDeliveryMagazineOrderService

} from "../services/deliveryMagazine.service.js";

import {

    serializeBigInt

} from "../utils/serializeBigInt.js";



/*
====================================================
 GET DELIVERY MAGAZINE ORDERS
====================================================
*/

export async function getDeliveryMagazineOrdersController(
    req,
    res
){

    try {


        const data =

            await getDeliveryMagazineOrdersService();



        return res.status(200).json(data);



    }

    catch(error){


        console.error(
            "GET DELIVERY MAGAZINE ERROR:",
            error
        );



        return res.status(500).json({

            message:
            "Erreur récupération commandes livraison"

        });


    }

}







/*
====================================================
 PRENDRE UNE COMMANDE
====================================================
*/

export async function takeDeliveryMagazineOrderController(

    req,

    res

){


    try {



        const {

            source,

            id

        } = req.body;





        /*
        ==================================
        LIVREUR CONNECTE
        ==================================
        */


        const delivery_person_id =

            req.user.id;








        if(!source || !id){


            return res.status(400).json({

                message:
                "source et id obligatoires"

            });


        }







        const delivery =


            await takeDeliveryMagazineOrderService({


                source,


                id,


                delivery_person_id


            });







        return res.status(201).json({

    message:
    "Commande prise avec succès",

    data:
    serializeBigInt(delivery)

});






    }


    catch(error){



        console.error(

            "TAKE DELIVERY MAGAZINE ERROR:",

            error

        );





        return res.status(400).json({


            message:
            error.message


        });



    }


}
export async function getDeliveryMagazineUserCommandesController(
req,
res
){

    try{


        const data =

        await getDeliveryMagazineUserCommandesService();



        return res.status(200).json(data);



    }

    catch(error){


        console.error(
            "USER COMMANDES DELIVERY ERROR:",
            error
        );


        return res.status(500).json({

            message:
            "Erreur récupération commandes utilisateurs"

        });


    }

}