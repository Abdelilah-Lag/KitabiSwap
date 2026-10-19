import prisma from "../config/prisma.js";

const EXCHANGE_FEE_DH = 5;

function toNumber(value) {
  return value == null ? 0 : Number(value);
}

async function createWalletTransactionTx({ tx, walletId, transactionType, amount, description, reference }) {
  const wallet = await tx.wallets.findUnique({
    where: { id: walletId },
    select: { balance: true }
  });

  if (!wallet) {
    throw new Error("Wallet introuvable.");
  }

  const before = toNumber(wallet.balance);
  const after = before - amount;

  if (after < 0) {
    throw new Error("Solde insuffisant pour accepter l'échange.");
  }

  await tx.wallets.update({
    where: { id: walletId },
    data: { balance: after }
  });

  await tx.wallet_transactions.create({
    data: {
      wallet_id: walletId,
      transaction_type: transactionType,
      amount: amount,
      balance_before: before,
      balance_after: after,
      description: description || null,
      reference: reference || null
    }
  });
}

export async function acceptExchangeRequestService(currentUserId, exchangeRequestId) {
  const safeUserId = BigInt(currentUserId);
  const safeRequestId = BigInt(exchangeRequestId);

  return prisma.$transaction(async (tx) => {
    const request = await tx.exchange_requests.findUnique({
      where: { id: safeRequestId },
      select: {
        id: true,
        requester_id: true,
        receiver_id: true,
        status: true,
        receiver_confirmed: true
      }
    });

    if (!request) {
      throw new Error("Demande d'échange introuvable.");
    }

    if (request.receiver_id !== safeUserId) {
      throw new Error("Vous n'êtes pas le receveur de cette demande.");
    }

    if (request.receiver_confirmed) {
      return { id: Number(request.id), receiver_confirmed: true, status: request.status };
    }

    // Load both wallets
    const [requesterWallet, receiverWallet] = await Promise.all([
      tx.wallets.findUnique({
        where: { user_id: request.requester_id },
        select: { id: true, balance: true }
      }),
      tx.wallets.findUnique({
        where: { user_id: request.receiver_id },
        select: { id: true, balance: true }
      })
    ]);

    if (!requesterWallet || !receiverWallet) {
      throw new Error("Wallet introuvable.");
    }

    // Update request confirmation + (optionally) status
    await tx.exchange_requests.update({
      where: { id: safeRequestId },
      data: {
        receiver_confirmed: true,
      }
    });

    const reference = `exchange_request_${exchangeRequestId}`;

    // Charge 5 DH from each wallet
    await createWalletTransactionTx({
      tx,
      walletId: requesterWallet.id,
      transactionType: "exchange_fee",
      amount: EXCHANGE_FEE_DH,
      description: "Frais échange (acception)",
      reference
    });

    await createWalletTransactionTx({
      tx,
      walletId: receiverWallet.id,
      transactionType: "exchange_fee",
      amount: EXCHANGE_FEE_DH,
      description: "Frais échange (acception)",
      reference
    });

    return {
      id: Number(request.id),
      receiver_confirmed: true,
      status: "accepted"
    };
  });
}

