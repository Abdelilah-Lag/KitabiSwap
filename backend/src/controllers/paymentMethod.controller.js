import {

    getPaymentMethodsService,
    createPaymentMethodService,
    updatePaymentMethodService,
    deletePaymentMethodService

} from "../services/paymentMethod.service.js";

/*
==========================================================
GET PAYMENT METHODS
==========================================================
*/

export async function getPaymentMethodsController(

    req,

    res

) {

    try {

        const data =
            await getPaymentMethodsService();

        res.status(200).json(data);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message:

                "Erreur lors du chargement des méthodes de paiement."

        });

    }

}

/*
==========================================================
CREATE PAYMENT METHOD
==========================================================
*/

export async function createPaymentMethodController(

    req,

    res

) {

    try {

        const data =
            await createPaymentMethodService(

                req.body,

                req.file

            );

        res.status(201).json(data);

    }

    catch (error) {

        console.error(error);

        res.status(400).json({

            message:

                error.message

        });

    }

}

/*
==========================================================
UPDATE PAYMENT METHOD
==========================================================
*/

export async function updatePaymentMethodController(

    req,

    res

) {

    try {

        const data =
            await updatePaymentMethodService(

                req.params.id,

                req.body,

                req.file

            );

        res.status(200).json(data);

    }

    catch (error) {

        console.error(error);

        res.status(400).json({

            message:

                error.message

        });

    }

}

/*
==========================================================
DELETE PAYMENT METHOD
==========================================================
*/

export async function deletePaymentMethodController(

    req,

    res

) {

    try {

        const data =
            await deletePaymentMethodService(

                req.params.id

            );

        res.status(200).json(data);

    }

    catch (error) {

        console.error(error);

        res.status(400).json({

            message:

                error.message

        });

    }

}