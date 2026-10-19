import {

    getDeliveryDashboardService

} from "../services/deliveryDashboard.service.js";

/*
==========================================================
GET DELIVERY DASHBOARD
==========================================================
*/

export async function getDeliveryDashboardController(

    req,

    res

) {

    try {

        const data =
            await getDeliveryDashboardService(

                req.user.id

            );

        res.status(200).json(data);

    }

    catch (error) {

        console.error(

            "DELIVERY_DASHBOARD_ERROR",

            error

        );

        res.status(500).json({

            success: false,

            message:

                error.message ||

                "Erreur lors du chargement du tableau de bord."

        });

    }

}