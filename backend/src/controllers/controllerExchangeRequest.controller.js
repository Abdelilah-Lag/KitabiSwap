import {

    getPendingExchangeRequestsService,
    startCollectingBooksService,
    rejectExchangeRequestService

} from "../services/controllerExchangeRequest.service.js";

/* ==========================================================
   GET
   DEMANDES D'ECHANGE EN ATTENTE
========================================================== */

export async function getPendingExchangeRequestsController(

    req,
    res

) {

    try {

        const data = await getPendingExchangeRequestsService(

            req.query

        );

        return res.json({

            success: true,

            ...data

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

/* ==========================================================
   PUT
   COMMENCER LA COLLECTE
========================================================== */

export async function startCollectingBooksController(

    req,
    res

) {

    try {

        const result = await startCollectingBooksService(

            req.params.deliveryId,
            req.user.id

        );

        return res.json({

            success: true,

            message: "Collecte démarrée avec succès.",

            data: result

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

/* ==========================================================
   PUT
   REFUSER UNE DEMANDE
========================================================== */

export async function rejectExchangeRequestController(

    req,
    res

) {

    try {

        const result = await rejectExchangeRequestService(

            req.params.deliveryId,
            req.user.id,
            req.body.reason

        );

        return res.json({

            success: true,

            message: "Demande d'échange refusée.",

            data: result

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}