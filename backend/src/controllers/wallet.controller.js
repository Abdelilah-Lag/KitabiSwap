import {

    getPaymentMethodsService,

    createRechargeRequestService,

    getRechargeHistoryService,

    getWalletBalanceService

} from "../services/wallet.service.js";

/*
==========================================================
GET PAYMENT METHODS
==========================================================
*/

export async function getPaymentMethods(req, res) {

    try {

        const methods = await getPaymentMethodsService();

        return res.status(200).json({

            success: true,

            methods

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Unable to load payment methods."

        });

    }

}

/*
==========================================================
CREATE RECHARGE REQUEST
==========================================================
*/

export async function createRechargeRequest(req, res) {

    try {

        const result = await createRechargeRequestService(

            req.user.id,

            req.body,

            req.file

        );

        return res.status(201).json({

            success: true,

            message: "Recharge request submitted successfully.",

            request: result

        });

    }

    catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}

/*
==========================================================
GET RECHARGE HISTORY
==========================================================
*/

export async function getRechargeHistory(req, res) {

    try {

        const history = await getRechargeHistoryService(

            req.user.id

        );

        return res.status(200).json({

            success: true,

            history

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Unable to load recharge history."

        });

    }

}

/*
==========================================================
GET WALLET BALANCE
==========================================================
*/

export async function getWalletBalance(req, res) {

    try {

        const wallet = await getWalletBalanceService(req.user.id);

        const safeWallet = {
            ...wallet,
            id: wallet?.id?.toString?.() ?? wallet?.id,
            user_id: wallet?.user_id?.toString?.() ?? wallet?.user_id,
        };

        return res.status(200).json({

            success: true,

            wallet: safeWallet,

            balance: safeWallet?.balance ?? 0

        });

    }

    catch (error) {

        console.error(error);

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }

}

