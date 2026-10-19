import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";
import { calculateDistance, getDeliveryPrice } from "../utils/deliveryCalculator.js";

function safeBigInt(value) {
  if (value === null || value === undefined) return null;
  if (value === "") return null;
  return BigInt(value);
}

function normalizeDeliveryMethod(value) {
  // Prisma enum échange_requests_delivery_method: admin_delivery | self_delivery
  // Si DB contient "" (ou autre valeur invalide), on force à null pour éviter l'erreur Prisma.
  if (value === null || value === undefined || value === "") return null;
  if (value === "admin_delivery" || value === "self_delivery") return value;
  if (value === "kitabiswap_delivery") return "admin_delivery";
  return null;
}


/* ===================================================
   Vérifier que l'utilisateur appartient à l'échange
=================================================== */

async function getExchange(exchangeRequestId, userId) {
  const exchange = await prisma.exchange_requests.findUnique({
    where: {
      id: safeBigInt(exchangeRequestId)
    },
    select: {
      id: true,
      requester_id: true,
      receiver_id: true,
      status: true,
      // Récupérer delivery_method pour permettre au frontend de calculer distance/prix et d'afficher paiement.
      // Si DB contient "" (valeur invalide pour l'enum), on la normalise après.
      delivery_method: true
    }
  });

  if (!exchange) {
    throw new Error("Demande d'échange introuvable.");
  }

  const currentUser = safeBigInt(userId);
  if (exchange.requester_id !== currentUser && exchange.receiver_id !== currentUser) {
    throw new Error("Accès refusé.");
  }

  // Normaliser au cas où la valeur arrive déjà depuis une autre sélection/DB.
  if (exchange && "delivery_method" in exchange) {
    exchange.delivery_method = normalizeDeliveryMethod(exchange.delivery_method);
  }

  return exchange;
}

/* ===================================================
   Charger toute la conversation
=================================================== */

function safeAddress(addr) {
  if (!addr) return null;
  return {
    id: addr.id ? Number(addr.id) : null,
    user_id: addr.user_id ? Number(addr.user_id) : null,
    label: addr.label,
    recipient_name: addr.recipient_name,
    phone: addr.phone,
    country: addr.country,
    region: addr.region,
    city: addr.city,
    district: addr.district,
    street: addr.street,
    building: addr.building,
    apartment: addr.apartment,
    postal_code: addr.postal_code,
    latitude: addr.latitude !== null && addr.latitude !== undefined ? Number(addr.latitude) : null,
    longitude: addr.longitude !== null && addr.longitude !== undefined ? Number(addr.longitude) : null,
    location_source: addr.location_source,
    is_default: addr.is_default,
    is_active: addr.is_active,
    created_at: addr.created_at,
    updated_at: addr.updated_at
  };
}

export async function getExchangeChatService(userId, exchangeRequestId) {
  const exchange = await getExchange(exchangeRequestId, userId);
  if (!exchange.delivery_method) {
    // Si livraison vide/invalidée dans la DB (""), éviter les calculs et le mapping.
    exchange.delivery_method = null;
  }

  const requesterAddress = await prisma.user_addresses.findFirst({
    where: {
      user_id: exchange.requester_id,
      is_default: true,
      is_active: true
    }
  });

  const receiverAddress = await prisma.user_addresses.findFirst({
    where: {
      user_id: exchange.receiver_id,
      is_default: true,
      is_active: true
    }
  });

  // Calcul distance + prix (fallback si exchange_delivery introuvable)
  let distance = null;
  let deliveryPrice = null;

  if (
    exchange.delivery_method === "admin_delivery" &&
    requesterAddress?.latitude &&
    requesterAddress?.longitude &&
    receiverAddress?.latitude &&
    receiverAddress?.longitude
  ) {
    distance = calculateDistance(
      Number(requesterAddress.latitude),
      Number(requesterAddress.longitude),
      Number(receiverAddress.latitude),
      Number(receiverAddress.longitude)
    );
    deliveryPrice = getDeliveryPrice(distance);
  }

  const messages = await prisma.exchange_chat.findMany({
    where: {
      exchange_request_id: exchange.id
    },
    include: {
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          avatar_url: true
        }
      }
    },
    orderBy: {
      created_at: "asc"
    }
  });

  const mappedMessages = messages.map((message) => ({
    id: Number(message.id),
    sender_id: Number(message.sender_id),
    sender: {
      id: Number(message.users.id),
      first_name: message.users.first_name,
      last_name: message.users.last_name,
      avatar_url: message.users.avatar_url
    },
    message: message.message,
    attachment_url: message.attachment_url,
    attachment_public_id: message.attachment_public_id,
    is_read: message.is_read,
    created_at: message.created_at
  }));

  // Récupérer les infos persistées de livraison
  let deliveryRow = null;
  if (exchange.delivery_method === "admin_delivery") {
    deliveryRow = await prisma.exchange_delivery.findFirst({
      where: { exchange_request_id: exchange.id },
      select: {
        id: true,
        delivery_fee: true,
        requester_share: true,
        receiver_share: true,
        requester_payment_method: true,
        receiver_payment_method: true,
        requester_paid: true,
        receiver_paid: true
      }
    });
  }

  const total_price = deliveryRow
    ? Number(deliveryRow.delivery_fee)
    : deliveryPrice != null
      ? deliveryPrice * 2
      : null;
  const requester_share = deliveryRow
    ? Number(deliveryRow.requester_share)
    : deliveryPrice != null
      ? deliveryPrice
      : null;
  const receiver_share = deliveryRow
    ? Number(deliveryRow.receiver_share)
    : deliveryPrice != null
      ? deliveryPrice
      : null;

  const currentUserId = safeBigInt(userId);
  const isRequester = exchange.requester_id === currentUserId;
  const isReceiver = exchange.receiver_id === currentUserId;

  const requester_payment_method = deliveryRow?.requester_payment_method ?? null;
  const receiver_payment_method = deliveryRow?.receiver_payment_method ?? null;

  const requester_paid = deliveryRow?.requester_paid ?? "non";
  const receiver_paid = deliveryRow?.receiver_paid ?? "non";

  const current_user_share = isRequester ? requester_share : isReceiver ? receiver_share : null;
  const current_user_payment_method = isRequester
    ? requester_payment_method
    : isReceiver
      ? receiver_payment_method
      : null;
  const current_user_paid = isRequester ? requester_paid : isReceiver ? receiver_paid : null;

  return {
    exchange: {
      id: Number(exchange.id),
      requester_id: Number(exchange.requester_id),
      receiver_id: Number(exchange.receiver_id),
      status: exchange.status,
      delivery_method: exchange.delivery_method
    },
    requesterAddress: safeAddress(requesterAddress),
    receiverAddress: safeAddress(receiverAddress),
    delivery: {
      id: deliveryRow ? Number(deliveryRow.id) : null,
      distance,
      total_price,
      requester_share,
      receiver_share,
      requester_payment_method,
      receiver_payment_method,
      requester_paid,
      receiver_paid,
      current_user_share,
      current_user_payment_method,
      current_user_paid
    },
    messages: mappedMessages
  };
}

/* ===================================================
   Envoyer un message texte
=================================================== */

export async function sendExchangeMessageService(userId, exchangeRequestId, body) {
  const exchange = await getExchange(exchangeRequestId, userId);

  if (exchange.delivery_method) {
    throw new Error("La méthode de livraison a déjà été choisie.");
  }

  const message = body.message?.trim();
  if (!message) {
    throw new Error("Le message est obligatoire.");
  }

  const newMessage = await prisma.exchange_chat.create({
    data: {
      exchange_request_id: exchange.id,
      sender_id: safeBigInt(userId),
      message,
      attachment_url: null,
      attachment_public_id: null,
      is_read: false
    },
    include: {
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          avatar_url: true
        }
      }
    }
  });

  return {
    id: Number(newMessage.id),
    sender_id: Number(newMessage.sender_id),
    sender: {
      id: Number(newMessage.users.id),
      first_name: newMessage.users.first_name,
      last_name: newMessage.users.last_name,
      avatar_url: newMessage.users.avatar_url
    },
    message: newMessage.message,
    attachment_url: newMessage.attachment_url,
    attachment_public_id: newMessage.attachment_public_id,
    is_read: newMessage.is_read,
    created_at: newMessage.created_at
  };
}

/* ===================================================
   Envoyer une image
=================================================== */

export async function sendExchangeImageService(userId, exchangeRequestId, file) {
  const exchange = await getExchange(exchangeRequestId, userId);

  if (exchange.delivery_method) {
    throw new Error("La méthode de livraison est déjà choisie.");
  }

  if (!file) {
    throw new Error("Aucune image envoyée.");
  }

  const result = await cloudinary.uploader.upload(file.buffer, {
    folder: "kitabiswap/chat_images",
    resource_type: "image",
    filename: `exchange_${exchangeRequestId}_${Date.now()}.jpg`
  });

  const imageMessage = await prisma.exchange_chat.create({
    data: {
      exchange_request_id: exchange.id,
      sender_id: safeBigInt(userId),
      message: null,
      attachment_url: result.secure_url,
      attachment_public_id: result.public_id,
      is_read: false
    },
    include: {
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          avatar_url: true
        }
      }
    }
  });

  return {
    id: Number(imageMessage.id),
    sender_id: Number(imageMessage.sender_id),
    sender: {
      id: Number(imageMessage.users.id),
      first_name: imageMessage.users.first_name,
      last_name: imageMessage.users.last_name,
      avatar_url: imageMessage.users.avatar_url
    },
    message: imageMessage.message,
    attachment_url: imageMessage.attachment_url,
    attachment_public_id: imageMessage.attachment_public_id,
    is_read: imageMessage.is_read,
    created_at: imageMessage.created_at
  };
}

/* ===================================================
   Choisir la méthode de livraison + création exchange_delivery
=================================================== */

export async function chooseDeliveryMethodService(userId, exchangeRequestId, deliveryMethod) {
  const exchange = await getExchange(exchangeRequestId, userId);

  if (exchange.delivery_method) {
    throw new Error("La méthode de livraison est déjà choisie.");
  }

  const normalizedDeliveryMethod =
    deliveryMethod === "kitabiswap_delivery" ? "admin_delivery" : deliveryMethod;

  if (normalizedDeliveryMethod !== "admin_delivery" && normalizedDeliveryMethod !== "self_delivery") {
    throw new Error("Méthode de livraison invalide.");
  }

  const updatedExchange = await prisma.exchange_requests.update({
    where: { id: exchange.id },
    data: {
      delivery_method: normalizedDeliveryMethod,
      status: "completed"
    }
  });

  // Création automatique de exchange_delivery (sinon le paiement échoue)
  if (normalizedDeliveryMethod === "admin_delivery") {
    const requesterAddress = await prisma.user_addresses.findFirst({
      where: {
        user_id: exchange.requester_id,
        is_default: true,
        is_active: true
      }
    });

    const receiverAddress = await prisma.user_addresses.findFirst({
      where: {
        user_id: exchange.receiver_id,
        is_default: true,
        is_active: true
      }
    });

    let distance = null;
    let deliveryFee = null;

    if (
      requesterAddress?.latitude != null &&
      requesterAddress?.longitude != null &&
      receiverAddress?.latitude != null &&
      receiverAddress?.longitude != null
    ) {
      distance = calculateDistance(
        Number(requesterAddress.latitude),
        Number(requesterAddress.longitude),
        Number(receiverAddress.latitude),
        Number(receiverAddress.longitude)
      );
      deliveryFee = getDeliveryPrice(distance);
    }

    const requesterShare = deliveryFee != null ? deliveryFee : 0;
    const receiverShare = deliveryFee != null ? deliveryFee : 0;

    // Prisma upsert() nécessite un champ unique dans `where`.
    // Comme exchange_request_id n'est pas unique dans `schema.prisma`, on fait find puis update/create.
    const existingDelivery = await prisma.exchange_delivery.findFirst({
      where: { exchange_request_id: exchange.id },
      select: { id: true }
    });

    if (existingDelivery) {
      await prisma.exchange_delivery.update({
        where: { id: existingDelivery.id },
        data: {
          delivery_fee: deliveryFee != null ? deliveryFee * 2 : 0,
          requester_share: requesterShare,
          receiver_share: receiverShare,
          requester_payment_method: null,
          receiver_payment_method: null,
          requester_paid: "non",
          receiver_paid: "non",
          // delivery_person_id est requis dans la DB/Prisma (selon schema). On met "0".
          delivery_person_id: "0",
          status: "pending",
          notes: null
        }
      });
    } else {
      await prisma.exchange_delivery.create({
        data: {
          exchange_request_id: exchange.id,
          delivery_person_id: null,
          delivery_fee: deliveryFee != null ? deliveryFee * 2 : 0,
          requester_share: requesterShare,
          receiver_share: receiverShare,
          requester_payment_method: null,
          receiver_payment_method: null,
          requester_paid: "non",
          receiver_paid: "non",
          status: "pending",
          notes: null
        }
      });
    }


  }

  const systemMessage =
    deliveryMethod === "admin_delivery"
      ? "Les deux utilisateurs ont choisi la livraison KitabiSwap."
      : "Les deux utilisateurs prennent en charge eux-mêmes la livraison.";

  await prisma.exchange_chat.create({
    data: {
      exchange_request_id: exchange.id,
      sender_id: safeBigInt(userId),
      message: systemMessage,
      attachment_url: null,
      attachment_public_id: null,
      is_read: false
    }
  });


  return {
    id: Number(updatedExchange.id),
    delivery_method: updatedExchange.delivery_method,
    status: updatedExchange.status
  };
}

/* ===================================================
   Paiement livraison (wallet ou cash_on_delivery)
=================================================== */

export async function payDeliveryService(userId, exchangeRequestId, paymentMethod) {
  const exchange = await getExchange(exchangeRequestId, userId);

  if (!paymentMethod || (paymentMethod !== "wallet" && paymentMethod !== "cash_on_delivery")) {
    throw new Error("payment_method invalide.");
  }

  if (exchange.delivery_method !== "admin_delivery") {
    throw new Error("Paiement uniquement pour KitabiSwap Delivery.");
  }

  const currentUserId = safeBigInt(userId);
  const isRequester = exchange.requester_id === currentUserId;
  const isReceiver = exchange.receiver_id === currentUserId;

  if (!isRequester && !isReceiver) {
    throw new Error("Accès refusé.");
  }

  return prisma.$transaction(async (tx) => {
    const delivery = await tx.exchange_delivery.findFirst({
      where: { exchange_request_id: exchange.id },
      select: {
        id: true,
        requester_share: true,
        receiver_share: true,
        requester_payment_method: true,
        receiver_payment_method: true,
        requester_paid: true,
        receiver_paid: true,
        delivery_fee: true
      }
    });

    if (!delivery) {
      throw new Error("Infos de livraison introuvables.");
    }

    const share = isRequester ? Number(delivery.requester_share) : Number(delivery.receiver_share);

    // Wallet: débit + transaction wallet_transactions uniquement si paymentMethod === wallet
    if (paymentMethod === "wallet") {
      const alreadyPaid = isRequester ? delivery.requester_paid === "oui" : delivery.receiver_paid === "oui";
      if (alreadyPaid) {
        return { alreadyPaid: true };
      }

      const wallet = await tx.wallets.findUnique({
        where: { user_id: currentUserId },
        select: { id: true, balance: true, status: true }
      });

      if (!wallet) throw new Error("Wallet introuvable.");
      if (wallet.status !== "active") throw new Error("Wallet non active.");

      const before = Number(wallet.balance);
      const after = before - share;
      if (after < 0) throw new Error("Solde insuffisant pour payer la livraison.");

      await tx.wallets.update({
        where: { id: wallet.id },
        data: { balance: after }
      });

      await tx.wallet_transactions.create({
        data: {
          wallet_id: wallet.id,
          transaction_type: "delivery_fee",
          amount: share,
          balance_before: before,
          balance_after: after,
          description: "Paiement livraison échange",
          reference: `exchange_delivery_${exchangeRequestId}`
        }
      });
    }

    // cash_on_delivery: aucune transaction wallet, juste marquer paiement côté livraison
    const updateData = isRequester
      ? {
          requester_payment_method: paymentMethod,
          requester_paid: paymentMethod === "wallet" ? "oui" : "non"
        }
      : {
          receiver_payment_method: paymentMethod,
          receiver_paid: paymentMethod === "wallet" ? "oui" : "non"
        };

    await tx.exchange_delivery.update({
      where: { id: delivery.id },
      data: updateData
    });

    return { ok: true };
  });
}


