import {

    getPaymentDashboardService

} from "../services/paymentDashboard.service.js";

/*
==========================================================
PAYMENT MANAGER DASHBOARD
==========================================================
*/

export async function getPaymentDashboardController(req, res) {

    try {

        const data = await getPaymentDashboardService();

        return res.status(200).json(data);

    }

    catch (error) {

        console.error(

            "PAYMENT_DASHBOARD_ERROR:",

            error

        );

        return res.status(500).json({

            success: false,

            message:

                "Erreur lors du chargement du tableau de bord."

        });

    }

}