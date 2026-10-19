import {

    getRechargeRequestsService,
    approveRechargeRequestService,
    rejectRechargeRequestService

} from "../services/paymentRechargeRequest.service.js";

/*
==========================================================
GET RECHARGE REQUESTS
==========================================================
*/

export async function getRechargeRequestsController(req, res) {

    try {

        const data =
            await getRechargeRequestsService({

                page: req.query.page,

                limit: req.query.limit,

                search: req.query.search || "",

                status: req.query.status || ""

            });

        res.json(data);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Erreur lors du chargement des demandes de recharge."

        });

    }

}

/*
==========================================================
APPROVE RECHARGE REQUEST
==========================================================
*/

export async function approveRechargeRequestController(req, res) {

    try {

        const data =
            await approveRechargeRequestService(

                req.params.id,

                req.user.id

            );

        res.json(data);

    }

    catch (error) {

        console.error(error);

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

}

/*
==========================================================
REJECT RECHARGE REQUEST
==========================================================
*/

export async function rejectRechargeRequestController(req, res) {

    try {

        const data =
            await rejectRechargeRequestService(

                req.params.id,

                req.user.id,

                req.body.reason

            );

        res.json(data);

    }

    catch (error) {

        console.error(error);

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

}