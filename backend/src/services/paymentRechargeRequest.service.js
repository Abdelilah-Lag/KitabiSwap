import prisma from "../config/prisma.js";

import {

    serializeBigInt

} from "../utils/serializeBigInt.js";

/*
==========================================================
GET RECHARGE REQUESTS
==========================================================
*/

export async function getRechargeRequestsService({

    page = 1,

    limit = 25,

    search = "",

    status = ""

}) {

    page = Number(page);

    limit = Number(limit);

    const where = {};

    /*
    =====================================
    STATUS FILTER
    =====================================
    */

    if (

        status &&

        status.trim() !== ""

    ) {

        where.status = status;

    }

    /*
    =====================================
    SEARCH
    =====================================
    */

    if (

        search &&

        search.trim() !== ""

    ) {

        where.wallets = {

            users: {

                OR: [

                    {

                        first_name: {

                            contains: search

                        }

                    },

                    {

                        last_name: {

                            contains: search

                        }

                    },

                    {

                        email: {

                            contains: search

                        }

                    }

                ]

            }

        };

    }

    /*
    =====================================
    TOTAL
    =====================================
    */

    const total =

        await prisma.wallet_recharge_requests.count({

            where

        });

    /*
    =====================================
    REQUESTS
    =====================================
    */

    const requests =

        await prisma.wallet_recharge_requests.findMany({

            where,

            skip:

                (page - 1) * limit,

            take: limit,

            orderBy: {

                created_at: "desc"

            },

            include: {

                wallets: {

                    include: {

                        users: {

                            select: {

                                id: true,

                                first_name: true,

                                last_name: true,

                                email: true,

                                phone: true

                            }

                        }

                    }

                }

            }

        });
            /*
/*
=====================================
FORMAT RESPONSE
=====================================
*/

const data = requests.map((request) => ({

    id: request.id,

    wallet_id: request.wallet_id,

    amount: request.amount,

    proof_image_url:
        request.proof_image_url,

    proof_public_id:
        request.proof_public_id,

    status:
        request.status,

    admin_id:
        request.admin_id,

    created_at:
        request.created_at,

    validated_at:
        request.validated_at,

    rejection_reason:
        request.rejection_reason,

    user: {

        id:
            request.wallets.users.id,

        first_name:
            request.wallets.users.first_name,

        last_name:
            request.wallets.users.last_name,

        email:
            request.wallets.users.email,

        phone:
            request.wallets.users.phone

    }

}));

/*
=====================================
RETURN
=====================================
*/

return serializeBigInt({

    data,

    pagination: {

        page,

        pageSize: limit,

        total,

        totalPages:
            Math.ceil(total / limit)

    }

});
    /*
    =====================================
    RETURN
    =====================================
    */

    return serializeBigInt({

        data,

        pagination: {

            page,

            pageSize: limit,

            total,

            totalPages:

                Math.ceil(total / limit)

        }

    });

}

/*
==========================================================
APPROVE RECHARGE REQUEST
==========================================================
*/

export async function approveRechargeRequestService(

    rechargeRequestId,

    adminId

) {

    const rechargeRequest =
        await prisma.wallet_recharge_requests.findUnique({

            where: {

                id: BigInt(rechargeRequestId)

            },

            include: {

                wallets: {

                    include: {

                        users: true

                    }

                }

            }

        });

    if (!rechargeRequest) {

        throw new Error(

            "Demande introuvable."

        );

    }

    if (rechargeRequest.status !== "pending") {

        throw new Error(

            "Cette demande est déjà traitée."

        );

    }

    return await prisma.$transaction(async (tx) => {

        /*
        =====================================
        CALCUL BALANCE
        =====================================
        */

        const balanceBefore =
            Number(rechargeRequest.wallets.balance);

        const amount =
            Number(rechargeRequest.amount);

        const balanceAfter =
            balanceBefore + amount;

        /*
        =====================================
        UPDATE WALLET
        =====================================
        */

        await tx.wallets.update({

            where: {

                id: rechargeRequest.wallet_id

            },

            data: {

                balance: balanceAfter

            }

        });

        /*
        =====================================
        CREATE WALLET TRANSACTION
        =====================================
        */

        await tx.wallet_transactions.create({

            data: {

                wallet_id:
                    rechargeRequest.wallet_id,

                transaction_type:
                    "deposit",

                amount:
                    rechargeRequest.amount,

                balance_before:
                    balanceBefore,

                balance_after:
                    balanceAfter,

                description:
                    "Recharge validée par le gestionnaire.",

                reference:
                    `RCH-${Date.now()}`

            }

        });

        /*
        =====================================
        UPDATE RECHARGE REQUEST
        =====================================
        */

        await tx.wallet_recharge_requests.update({

            where: {

                id: rechargeRequest.id

            },

            data: {

                status: "approved",

                admin_id: BigInt(adminId),

                validated_at: new Date(),

                rejection_reason: null

            }

        });

        /*
        =====================================
        CREATE MESSAGE
        =====================================
        */

        await tx.messages.create({

            data: {

                sender_id: BigInt(adminId),

                receiver_id:
                    rechargeRequest.wallets.user_id,

                message:
`Bonjour ${rechargeRequest.wallets.users.first_name},

Votre demande de recharge de ${rechargeRequest.amount} DH a été validée avec succès.

Le montant a été ajouté à votre portefeuille KitabiSwap.

Merci de votre confiance.`,

                is_read: false

            }

        });

        /*
        =====================================
        RETURN
        =====================================
        */

        return {

            success: true,

            message:
                "Demande de recharge approuvée avec succès."

        };

    });

}
    /*
/*
==========================================================
REJECT RECHARGE REQUEST
==========================================================
*/

export async function rejectRechargeRequestService(

    rechargeRequestId,

    adminId,

    reason

) {

    const rechargeRequest =
        await prisma.wallet_recharge_requests.findUnique({

            where: {

                id: BigInt(rechargeRequestId)

            },

            include: {

                wallets: {

                    include: {

                        users: true

                    }

                }

            }

        });

    if (!rechargeRequest) {

        throw new Error(

            "Demande introuvable."

        );

    }

    if (rechargeRequest.status !== "pending") {

        throw new Error(

            "Cette demande est déjà traitée."

        );

    }

    return await prisma.$transaction(async (tx) => {

        /*
        =====================================
        UPDATE REQUEST
        =====================================
        */

        await tx.wallet_recharge_requests.update({

            where: {

                id: rechargeRequest.id

            },

            data: {

                status: "rejected",

                admin_id: BigInt(adminId),

                validated_at: new Date(),

                rejection_reason:
                    reason || "Aucun motif n'a été précisé."

            }

        });

        /*
        =====================================
        CREATE MESSAGE
        =====================================
        */

        await tx.messages.create({

            data: {

                sender_id: BigInt(adminId),

                receiver_id:
                    rechargeRequest.wallets.user_id,

                message:
`Bonjour ${rechargeRequest.wallets.users.first_name},

Votre demande de recharge de ${rechargeRequest.amount} DH a été refusée.

Motif :

${reason || "Aucun motif n'a été précisé."}

Si vous pensez qu'il s'agit d'une erreur, vous pouvez soumettre une nouvelle demande de recharge avec une preuve de paiement valide.

Merci de votre compréhension.`,

                is_read: false

            }

        });

        /*
        =====================================
        RETURN
        =====================================
        */

        return {

            success: true,

            message:
                "Demande de recharge refusée avec succès."

        };

    });

}