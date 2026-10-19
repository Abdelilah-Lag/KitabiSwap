import prisma from "../config/prisma.js";

import {

    serializeBigInt

} from "../utils/serializeBigInt.js";

/*
==========================================================
PAYMENT MANAGER DASHBOARD
==========================================================
*/

export async function getPaymentDashboardService() {

    /*
    =====================================
    GLOBAL STATISTICS
    =====================================
    */

    const [

        totalWallets,

        emptyWallets,

        chargedWallets,

        walletBalance,

        totalTransactions,

        totalRechargeRequests,

        pendingRequests,

        approvedRequests,

        rejectedRequests

    ] = await Promise.all([

        /*
        -------------------------
        TOTAL WALLETS
        -------------------------
        */

        prisma.wallets.count(),

        /*
        -------------------------
        EMPTY WALLETS
        -------------------------
        */

        prisma.wallets.count({

            where: {

                balance: 0

            }

        }),

        /*
        -------------------------
        CHARGED WALLETS
        -------------------------
        */

        prisma.wallets.count({

            where: {

                balance: {

                    gt: 0

                }

            }

        }),

        /*
        -------------------------
        TOTAL MONEY
        -------------------------
        */

        prisma.wallets.aggregate({

            _sum: {

                balance: true

            }

        }),

        /*
        -------------------------
        TOTAL TRANSACTIONS
        -------------------------
        */

        prisma.wallet_transactions.count(),

        /*
        -------------------------
        TOTAL RECHARGE REQUESTS
        -------------------------
        */

        prisma.wallet_recharge_requests.count(),

        /*
        -------------------------
        PENDING REQUESTS
        -------------------------
        */

        prisma.wallet_recharge_requests.count({

            where: {

                status: "pending"

            }

        }),

        /*
        -------------------------
        APPROVED REQUESTS
        -------------------------
        */

        prisma.wallet_recharge_requests.count({

            where: {

                status: "approved"

            }

        }),

        /*
        -------------------------
        REJECTED REQUESTS
        -------------------------
        */

        prisma.wallet_recharge_requests.count({

            where: {

                status: "rejected"

            }

        })

    ]);

    /*
    =====================================
    DASHBOARD STATISTICS
    =====================================
    */

    const statistics = {

        total_wallets:

            totalWallets,

        empty_wallets:

            emptyWallets,

        charged_wallets:

            chargedWallets,

        total_wallet_balance:

            walletBalance._sum.balance || 0,

        total_transactions:

            totalTransactions,

        total_recharge_requests:

            totalRechargeRequests,

        pending_requests:

            pendingRequests,

        approved_requests:

            approvedRequests,

        rejected_requests:

            rejectedRequests

    };

    /*
    =====================================
    LATEST RECHARGE REQUESTS
    =====================================
    */

    const latestRechargeRequests =
        await prisma.wallet_recharge_requests.findMany({

            take: 5,

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

                                email: true

                            }

                        }

                    }

                }

            }

        });
            /*
    =====================================
    FORMAT RECHARGE REQUESTS
    =====================================
    */

    const formattedRechargeRequests =
        latestRechargeRequests.map((request) => ({

            id: request.id,

            amount: request.amount,

            status: request.status,

            proof_image_url: request.proof_image_url,

            created_at: request.created_at,

            user: {

                id: request.wallets.users.id,

                first_name:

                    request.wallets.users.first_name,

                last_name:

                    request.wallets.users.last_name,

                email:

                    request.wallets.users.email

            }

        }));

    /*
    =====================================
    LATEST TRANSACTIONS
    =====================================
    */

    const latestTransactions =
        await prisma.wallet_transactions.findMany({

            take: 5,

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

                                email: true

                            }

                        }

                    }

                }

            }

        });
            /*
    =====================================
    FORMAT TRANSACTIONS
    =====================================
    */

    const formattedTransactions =
        latestTransactions.map((transaction) => ({

            id: transaction.id,

            amount: transaction.amount,

            transaction_type:

                transaction.transaction_type,

            description:

                transaction.description,

            reference:

                transaction.reference,

            created_at:

                transaction.created_at,

            user: {

                id:

                    transaction.wallets.users.id,

                first_name:

                    transaction.wallets.users.first_name,

                last_name:

                    transaction.wallets.users.last_name,

                email:

                    transaction.wallets.users.email

            }

        }));

    /*
    =====================================
    RICHEST WALLETS
    =====================================
    */

    const richestWallets =
        await prisma.wallets.findMany({

            take: 5,

            orderBy: {

                balance: "desc"

            },

            include: {

                users: {

                    select: {

                        id: true,

                        first_name: true,

                        last_name: true,

                        email: true

                    }

                }

            }

        });

    /*
    =====================================
    FORMAT WALLETS
    =====================================
    */

    const formattedWallets =
        richestWallets.map((wallet) => ({

            id: wallet.id,

            balance: wallet.balance,

            user: {

                id: wallet.users.id,

                first_name:

                    wallet.users.first_name,

                last_name:

                    wallet.users.last_name,

                email:

                    wallet.users.email

            }

        }));
            /*
    =====================================
    RETURN
    =====================================
    */

    return serializeBigInt({

        statistics,

        latest_recharge_requests:

            formattedRechargeRequests,

        latest_transactions:

            formattedTransactions,

        richest_wallets:

            formattedWallets

    });

}