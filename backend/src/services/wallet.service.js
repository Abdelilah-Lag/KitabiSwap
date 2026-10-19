import prisma from "../config/prisma.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

/*
==========================================================
GET ACTIVE PAYMENT METHODS
==========================================================
*/
export async function getPaymentMethodsService() {

    return await prisma.payment_methods.findMany({
        where: {
            is_active: true
        },
        orderBy: {
            display_order: "asc"
        }

    });

}

/*
==========================================================
CREATE RECHARGE REQUEST
==========================================================
*/
export async function createRechargeRequestService(

    userId,

    body,

    file

) {

    // amount might be stored as Decimal in DB; keep a JSON-safe representation
    const amount = Number(body.amount);


    /*
    ================================
    Validation
    ================================
    */

    if (!amount || amount < 20) {

        throw new Error(

            "Minimum recharge amount is 20 DH."

        );

    }

    if (!file) {

        throw new Error(

            "Payment proof is required."

        );

    }

    /*
    ================================
    Wallet
    ================================
    */

    const wallet = await prisma.wallets.findUnique({
        where: {
            user_id: BigInt(userId)
        }
    });

    if (!wallet) {

        throw new Error(

            "Wallet not found."

        );

    }

    /*
    ================================
    Upload Proof
    ================================
    */

    const upload = await uploadToCloudinary(

        file.buffer,

        "kitabiswap/payment_proofs"

    );

    /*
    ================================
    Save Request
    ================================
    */

    const request = await prisma.wallet_recharge_requests.create({
        data: {
            wallet_id: wallet.id,
            amount,
            proof_image_url: upload?.secure_url ?? upload?.url,
            proof_public_id: upload.public_id,
            status: "pending"
        }

    });

    // Prisma can return BigInt/Decimal values that Express can't JSON.stringify
    return {
        ...request,
        id: request?.id?.toString?.() ?? request?.id,
        wallet_id: request?.wallet_id?.toString?.() ?? request?.wallet_id,
        amount: request?.amount?.toString?.() ?? request?.amount,
        admin_id: request?.admin_id?.toString?.() ?? request?.admin_id,
    };

}

/*
==========================================================
GET USER RECHARGE HISTORY
==========================================================
*/
export async function getRechargeHistoryService(userId) {

    const userIdBig = BigInt(userId);

    console.log("[wallet] getRechargeHistoryService userId:", userId, "as BigInt:", userIdBig);

    const wallet = await prisma.wallets.findUnique({
        where: {
            user_id: userIdBig
        },
        include: {
            wallet_recharge_requests: {
                orderBy: {
                    created_at: "desc"
                }
            }
        }
    });

    const history = wallet?.wallet_recharge_requests ?? [];
    console.log(
        "[wallet] wallet found:",
        !!wallet,
        "wallet.id:",
        wallet?.id?.toString?.() ?? wallet?.id,
        "recharges:",
        history.length
    );

    // Log un exemple de la première ligne (si existe) pour vérifier la structure renvoyée.
    if (history.length) {
        const first = history[0];
        console.log("[wallet] first recharge raw:", {
            id: first.id?.toString?.() ?? first.id,
            wallet_id: first.wallet_id?.toString?.() ?? first.wallet_id,
            amount: first.amount?.toString?.() ?? first.amount,
            status: first.status,
            proof_image_url: first.proof_image_url,
            created_at: first.created_at,
            validated_at: first.validated_at
        });
    }

    return history.map((r) => ({
        ...r,
        id: r.id?.toString?.() ?? r.id,
        wallet_id: r.wallet_id?.toString?.() ?? r.wallet_id,
        amount: r.amount?.toString?.() ?? r.amount,
        admin_id: r.admin_id?.toString?.() ?? r.admin_id,
        validated_at: r.validated_at ?? null,
    }));

}

/*
==========================================================
GET WALLET BALANCE
==========================================================
*/
export async function getWalletBalanceService(userId) {

    const wallet = await prisma.wallets.findUnique({
        where: {
            user_id: BigInt(userId)
        },
        select: {
            id: true,
            user_id: true,
            balance: true,
            currency: true,
            status: true,
            created_at: true,
            updated_at: true
        }
    });

    if (!wallet) {
        throw new Error("Wallet not found.");
    }

    return wallet;

}

