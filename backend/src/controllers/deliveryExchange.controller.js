import {

    getDeliveryExchangeOrdersService,

    takeDeliveryExchangeService

} from "../services/deliveryExchange.service.js";

/*
==========================================================
GET DELIVERY EXCHANGE ORDERS
==========================================================
*/

export async function getDeliveryExchangeOrdersController(

    req,

    res

) {

    try {

        const data =

            await getDeliveryExchangeOrdersService();

        res.json(data);

    }

    catch (error) {

        console.error(

            "GET_DELIVERY_EXCHANGE_ORDERS_ERROR",

            error

        );

        res.status(500).json({

            message:

                "Erreur récupération des échanges."

        });

    }

}

/*
==========================================================
TAKE DELIVERY EXCHANGE
==========================================================
*/

export async function takeDeliveryExchangeController(

    req,

    res

) {

    try {

        const result =

            await takeDeliveryExchangeService(

                req.params.id,

                req.user.id

            );

        res.json(result);

    }

    catch (error) {

        console.error(

            "TAKE_DELIVERY_EXCHANGE_ERROR",

            error

        );

        res.status(400).json({

            message:

                error.message

        });

    }

}