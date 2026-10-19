import {
    getExchangeChatService,
    sendExchangeMessageService,
    sendExchangeImageService,
    chooseDeliveryMethodService,
    payDeliveryService
} from "../services/exchangeChat.service.js";

/* ==========================================
   Charger la conversation
========================================== */

export async function getExchangeChat(req, res) {

    try {

        const result = await getExchangeChatService(
            req.user.id,
            req.params.exchangeRequestId
        );

        return res.status(200).json({
            success: true,
            messages: result.messages,
            exchange: result.exchange,
            requesterAddress: result.requesterAddress,
            receiverAddress: result.receiverAddress,
            delivery: result.delivery
        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

/* ==========================================
   Envoyer un message texte
========================================== */

export async function sendExchangeMessage(req, res) {

    try {

        const message = await sendExchangeMessageService(

            req.user.id,

            req.params.exchangeRequestId,

            req.body

        );

        return res.status(201).json({

            success: true,

            message

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

/* ==========================================
   Envoyer une image
========================================== */

export async function sendExchangeImage(req, res) {

    try {

        const image = await sendExchangeImageService(

            req.user.id,

            req.params.exchangeRequestId,

            req.file

        );

        return res.status(201).json({

            success: true,

            image

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

/* ==========================================
   Choisir la méthode de livraison
========================================== */

export async function chooseDeliveryMethod(req, res) {

    try {

        const result = await chooseDeliveryMethodService(

            req.user.id,

            req.params.exchangeRequestId,

            req.body.delivery_method

        );

        return res.status(200).json({

            success: true,

            exchange: result

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

/* ==========================================
   Paiement livraison
========================================== */

export async function payDelivery(req, res) {

    try {

        const result = await payDeliveryService(
            req.user.id,
            req.params.exchangeRequestId,
            req.body.payment_method
        );

        return res.status(200).json({
            success: true,
            delivery: result
        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


