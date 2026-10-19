import {

    getDeliveryUserOrdersService,

    takeDeliveryUserOrderService

} from "../services/deliveryUserOrders.service.js";

/*
==========================================================
GET USER ORDERS
==========================================================
*/

export async function getDeliveryUserOrdersController(

    req,

    res

) {

    try {

        const orders =
            await getDeliveryUserOrdersService();

        res.json(orders);

    }

    catch (error) {

        console.error(

            "GET_DELIVERY_USER_ORDERS_ERROR",

            error

        );

        res.status(500).json({

            message:

                error.message ||

                "Erreur serveur."

        });

    }

}

/*
==========================================================
TAKE USER ORDER
==========================================================
*/

export async function takeDeliveryUserOrderController(

    req,

    res

) {

    try {

        const result =
            await takeDeliveryUserOrderService(

                req.params.id,

                req.user.id

            );

        res.json(result);

    }

    catch (error) {

        console.error(

            "TAKE_DELIVERY_USER_ORDER_ERROR",

            error

        );

        res.status(400).json({

            message:

                error.message ||

                "Erreur serveur."

        });

    }

}