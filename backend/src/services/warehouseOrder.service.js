import prisma from "../config/prisma.js";

/* ==========================================================
   HELPERS
========================================================== */

function safeBigInt(value) {
    return BigInt(value);
}

function toNumber(value) {
    if (value === null || value === undefined) return 0;
    return Number(value);
}

/* ==========================================================
   FORMAT: book_orders (legacy)
========================================================== */

function formatBookOrder(order) {
    const buyer = order.users;
    const buyerAddress = buyer.user_addresses[0] || null;

    /* =====================================================
       SHOP BOOK
    ===================================================== */

    if (order.shop_inventory) {
        const inventory = order.shop_inventory;
        const catalog = inventory.books_catalog;

        const cover =
            catalog.book_images.find((image) => image.is_cover) ||
            catalog.book_images[0] ||
            null;

        return {
            id: Number(order.id),
            source: "book_orders",
            type: "shop",
            status: order.status,
            payment_method: order.payment_method,
            quantity: order.quantity,
            price: toNumber(order.price),
            delivery_price: toNumber(order.delivery_price),
            total: toNumber(order.price) + toNumber(order.delivery_price),
            created_at: order.created_at,
            book: {
                id: Number(inventory.id),
                title: catalog.title,
                author: catalog.author,
                cover: cover?.image_url || null,
            },
            buyer: {
                id: Number(buyer.id),
                first_name: buyer.first_name,
                last_name: buyer.last_name,
                phone: buyer.phone,
                address: buyerAddress
                    ? {
                          recipient_name: buyerAddress.recipient_name,
                          phone: buyerAddress.phone,
                          street: buyerAddress.street,
                          district: buyerAddress.district,
                          city: buyerAddress.city,
                          region: buyerAddress.region,
                          postal_code: buyerAddress.postal_code,
                      }
                    : null,
            },
        };
    }

    /* =====================================================
       USER BOOK
    ===================================================== */

    if (order.user_books_to_sell) {
        const userBook = order.user_books_to_sell;
        const catalog = userBook.books_catalog;

        const cover =
            catalog.book_images.find((image) => image.is_cover) ||
            catalog.book_images[0] ||
            null;

        return {
            id: Number(order.id),
            source: "book_orders",
            type: "user",
            status: order.status,
            payment_method: order.payment_method,
            quantity: 1,
            price: toNumber(order.price),
            delivery_price: toNumber(order.delivery_price),
            total: toNumber(order.price) + toNumber(order.delivery_price),
            created_at: order.created_at,
            book: {
                id: Number(userBook.id),
                title: catalog.title,
                author: catalog.author,
                condition: userBook.book_condition,
                cover: cover?.image_url || null,
            },
            buyer: {
                id: Number(buyer.id),
                first_name: buyer.first_name,
                last_name: buyer.last_name,
                phone: buyer.phone,
                address: buyerAddress
                    ? {
                          recipient_name: buyerAddress.recipient_name,
                          phone: buyerAddress.phone,
                          street: buyerAddress.street,
                          district: buyerAddress.district,
                          city: buyerAddress.city,
                          region: buyerAddress.region,
                          postal_code: buyerAddress.postal_code,
                      }
                    : null,
            },
            seller: {
                id: Number(userBook.users.id),
                first_name: userBook.users.first_name,
                last_name: userBook.users.last_name,
                phone: userBook.users.phone,
            },
        };
    }

    return null;
}

/* ==========================================================
   FORMAT: user_commandes
========================================================== */

function formatUserCommandeRow(commande, achatsDetail) {
    const buyer = commande.users;
    const buyerAddress = buyer.user_addresses?.[0] || null;

    // Keep existing single-book fields for backward compatibility,
    // but also expose all requested books/images in `books`.
    const achats = Array.isArray(achatsDetail) ? achatsDetail.filter(Boolean) : [];
    const firstAchat = achats[0] || null;

    return {
        id: Number(commande.id),
        source: "user_commandes",
        type: firstAchat?.type || "shop",
        status: commande.order_status,
        payment_method: commande.payment_type,
        delivery_price: toNumber(commande.delivery_price),
        total: toNumber(commande.total_price),
        created_at: commande.created_at,

        // Legacy (used by current UI)
        quantity: firstAchat?.quantity || 1,
        price: toNumber(firstAchat?.unit_price || firstAchat?.price || 0),
        book: {
            id: Number(firstAchat?.book_id || 0),
            title: firstAchat?.title || "",
            author: firstAchat?.author || "",
            condition: firstAchat?.condition,
            cover: firstAchat?.cover || null,
        },

        // New: all books for this order
        books: achats.map((a) => ({
            type: a.type,
            id: Number(a.book_id),
            title: a.title,
            author: a.author,
            condition: a.condition,
            cover: a.cover,
            quantity: a.quantity,
            unit_price: toNumber(a.unit_price),
            seller: a.seller || null,
        })),

        buyer: {
            id: Number(buyer.id),
            first_name: buyer.first_name,
            last_name: buyer.last_name,
            phone: buyer.phone,
            address: buyerAddress
                ? {
                      recipient_name: buyerAddress.recipient_name,
                      phone: buyerAddress.phone,
                      street: buyerAddress.street,
                      district: buyerAddress.district,
                      city: buyerAddress.city,
                      region: buyerAddress.region,
                      postal_code: buyerAddress.postal_code,
                  }
                : null,
        },
        // optional seller info is in achatsDetail per item
        seller: firstAchat?.seller || null,
    };
}

/* ==========================================================
   GET ALL PENDING ORDERS (book_orders + user_commandes)
========================================================== */

export async function getWarehouseOrdersService() {
    const [legacyOrders, userOrders] = await Promise.all([
        prisma.book_orders.findMany({
            where: { status: "en_cours" },
            include: {
                users: {
                    include: {
                        user_addresses: {
                            where: { is_default: true },
                        },
                    },
                },
                shop_inventory: {
                    include: {
                        books_catalog: {
                            include: { book_images: true },
                        },
                    },
                },
                user_books_to_sell: {
                    include: {
                        books_catalog: {
                            include: { book_images: true },
                        },
                        users: true,
                    },
                },
            },
            orderBy: { created_at: "desc" },
        }),
        prisma.user_commandes.findMany({
            where: {
                order_status: "pending",
            },
            include: {
                users: {
                    include: {
                        user_addresses: {
                            where: { is_default: true },
                            take: 1,
                        },
                    },
                },
                // We will parse achats_json manually.
            },
            orderBy: { created_at: "desc" },
        }),
    ]);

    const result = [];

    for (const order of legacyOrders) {
        const formatted = formatBookOrder(order);
        if (formatted) result.push(formatted);
    }

    // Expand achats for user_commandes
    for (const commande of userOrders) {
        let achatsIds = [];
        try {
            achatsIds = JSON.parse(commande.achats_json || "[]");
        } catch {
            achatsIds = [];
        }

        const achats = achatsIds.length
            ? await prisma.user_achat.findMany({
                  where: { id: { in: achatsIds.map((x) => BigInt(x)) } },
                  include: {
                      shop_inventory: {
                          include: {
                              books_catalog: {
                                  include: { book_images: true },
                              },
                          },
                      },
                      user_books_to_sell: {
                          include: {
                              books_catalog: {
                                  include: { book_images: true },
                              },
                              users: true,
                          },
                      },
                  },
              })
            : [];

        const achatsDetail = achats.map((a) => {
            if (a.shop_inventory) {
                const catalog = a.shop_inventory.books_catalog;
                const cover =
                    catalog.book_images.find((img) => img.is_cover) ||
                    catalog.book_images[0] ||
                    null;

                return {
                    type: "shop",
                    shop_inventory_id: a.shop_inventory_id,
                    book_id: a.shop_inventory_id,
                    title: catalog.title,
                    author: catalog.author,
                    cover: cover?.image_url || null,
                    quantity: a.quantity,
                    unit_price: a.unit_price,
                    price: toNumber(a.unit_price),
                    seller: null,
                    condition: null,
                };
            }

            if (a.user_books_to_sell) {
                const ub = a.user_books_to_sell;
                const catalog = ub.books_catalog;
                const cover =
                    catalog.book_images.find((img) => img.is_cover) ||
                    catalog.book_images[0] ||
                    null;

                return {
                    type: "user",
                    user_book_to_sell_id: a.user_book_to_sell_id,
                    book_id: ub.id,
                    title: catalog.title,
                    author: catalog.author,
                    cover: cover?.image_url || null,
                    quantity: 1,
                    unit_price: a.unit_price,
                    price: toNumber(a.unit_price),
                    seller: {
                        id: Number(ub.users.id),
                        first_name: ub.users.first_name,
                        last_name: ub.users.last_name,
                        phone: ub.users.phone,
                    },
                    condition: ub.book_condition,
                };
            }

            return null;
        }).filter(Boolean);

        result.push(formatUserCommandeRow(commande, achatsDetail));
    }

    // Merge by date desc
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return result;
}

/* ==========================================================
   APPROVE ORDER (legacy + user)
========================================================== */

export async function approveWarehouseOrderService(source, orderId) {
    return await prisma.$transaction(async (tx) => {
        if (source !== "book_orders" && source !== "user_commandes") {
            throw new Error("source invalide. Utiliser: book_orders ou user_commandes.");
        }

        if (source === "book_orders") {

            const legacy = await tx.book_orders.findUnique({
                where: { id: safeBigInt(orderId) },
            });

            if (!legacy) {
                throw new Error("Commande introuvable.");
            }

            if (legacy.status !== "en_cours") {
                throw new Error("Cette commande a déjà été traitée.");
            }

            const updatedOrder = await tx.book_orders.update({
                where: { id: legacy.id },
                data: { status: "valide" },
            });

            return {
                success: true,
                message: "Commande validée avec succès.",
                order: {
                    id: Number(updatedOrder.id),
                    status: updatedOrder.status,
                    source: "book_orders",
                },
            };
        }

        // source === "user_commandes"
        const userCommande = await tx.user_commandes.findUnique({
            where: { id: safeBigInt(orderId) },
        });

        if (!userCommande) {
            throw new Error("Commande introuvable.");
        }

        if (userCommande.order_status !== "pending") {
            throw new Error("Cette commande a déjà été traitée.");
        }

        const updated = await tx.user_commandes.update({
            where: { id: userCommande.id },
            data: { order_status: "confirmed" },
        });

        return {
            success: true,
            message: "Commande validée avec succès.",
            order: {
                id: Number(updated.id),
                status: updated.order_status,
                source: "user_commandes",
            },
        };
    });
}


/* ==========================================================
   REFUSE ORDER (legacy only for now)
========================================================== */

export async function rejectWarehouseOrderService(source, orderId) {
    return await prisma.$transaction(async (tx) => {
        if (source !== "book_orders" && source !== "user_commandes") {
            throw new Error("source invalide. Utiliser: book_orders ou user_commandes.");
        }

        if (source === "book_orders") {

            const legacy = await tx.book_orders.findUnique({
                where: { id: safeBigInt(orderId) },
            });

            if (!legacy) {
                throw new Error("Commande introuvable.");
            }

            if (legacy.status !== "en_cours") {
                throw new Error("Cette commande a déjà été traitée.");
            }

            const totalAmount =
                Number(legacy.price) + Number(legacy.delivery_price);

            // refund wallet
            if (legacy.payment_method === "wallet") {
                const wallet = await tx.wallets.findUnique({
                    where: { user_id: legacy.user_id },
                });

                if (!wallet) {
                    throw new Error("Wallet introuvable.");
                }

                const balanceBefore = Number(wallet.balance);
                const balanceAfter = balanceBefore + totalAmount;

                await tx.wallets.update({
                    where: { id: wallet.id },
                    data: { balance: balanceAfter },
                });

                await tx.wallet_transactions.create({
                    data: {
                        wallet_id: wallet.id,
                        transaction_type: "refund",
                        amount: totalAmount,
                        balance_before: balanceBefore,
                        balance_after: balanceAfter,
                        description: `Refund order #${Number(legacy.id)}`,
                        reference: `refund_order_${Number(legacy.id)}`,
                    },
                });
            }

            await tx.book_orders.update({
                where: { id: legacy.id },
                data: { status: "refuse" },
            });

            return {
                success: true,
                message: "Commande refusée.",
                refunded: legacy.payment_method === "wallet",
                source: "book_orders",
            };
        }

        // source === "user_commandes"
        const userCommande = await tx.user_commandes.findUnique({
            where: { id: safeBigInt(orderId) },
        });

        if (!userCommande) {
            throw new Error("Commande introuvable.");
        }

        if (userCommande.order_status !== "pending") {
            throw new Error("Cette commande a déjà été traitée.");
        }

        const updated = await tx.user_commandes.update({
            where: { id: userCommande.id },
            data: { order_status: "cancelled" },
        });

        return {
            success: true,
            message: "Commande refusée.",
            order: {
                id: Number(updated.id),
                status: updated.order_status,
                source: "user_commandes",
            },
        };
    });
}


