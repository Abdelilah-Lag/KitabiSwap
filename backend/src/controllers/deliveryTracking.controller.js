import {

    getMyDeliveriesService,

    completeDeliveryService

} from "../services/deliveryTracking.service.js";

/*
==========================================================
GET MY DELIVERIES
==========================================================
*/

export async function getMyDeliveriesController(

    req,

    res

){

    try{

        const data =

            await getMyDeliveriesService(

                req.user.id

            );

        res.json(data);

    }

    catch(error){

        console.error(

            "GET_MY_DELIVERIES_ERROR",

            error

        );

        res.status(500).json({

            message:

                "Erreur récupération des livraisons."

        });

    }

}

/*
==========================================================
COMPLETE DELIVERY
==========================================================
*/

export async function completeDeliveryController(

    req,

    res

){

    try{

        const result =

            await completeDeliveryService(

                req.params.id,

                req.user.id

            );

        res.json(result);

    }

    catch(error){

        console.error(

            "COMPLETE_DELIVERY_ERROR",

            error

        );

        res.status(400).json({

            message:

                error.message

        });

    }

}