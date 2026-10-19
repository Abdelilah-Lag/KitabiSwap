import prisma from "../config/prisma.js";
import { getDeliveryInfoService } from "./magazine_user.service.js";

/* ==========================================================
   Helpers
========================================================== */

function toNumber(value) {

    return value == null ? 0 : Number(value);

}

function getCoverImage(images) {

    if (!images || images.length === 0) {
        return null;
    }

    return (
        images.find(image => image.is_cover) ||
        images[0]
    );

}

function serializeWallet(wallet) {

    if (!wallet) {

        return {
            balance: 0,
            currency: "MAD"
        };

    }

    return {

        id: Number(wallet.id),

        balance: toNumber(wallet.balance),

        currency: wallet.currency,

        status: wallet.status

    };

}

/* ==========================================================
   GET
   Initialisation de la page commande
========================================================== */

export async function getCommandeInitService(userId) {

    /* ===============================
       Favoris
    =============================== */

    const favorites = await prisma.favorites.findMany({

        where: {
            user_id: BigInt(userId)
        },

        include: {

            shop_inventory: {

                include: {

                    books_catalog: {

                        include: {
                            book_images: true
                        }

                    }

                }

            },

            user_books_to_sell: {

                include: {

                    books_catalog: {

                        include: {
                            book_images: true
                        }

                    },

                    users: {

                        select: {

                            id: true,

                            first_name: true,

                            last_name: true,

                            avatar_url: true

                        }

                    }

                }

            }

        },

        orderBy: {
            created_at: "desc"
        }

    });

    /* ===============================
       Adresses
    =============================== */

    const addresses = await prisma.user_addresses.findMany({

        where: {
            user_id: BigInt(userId),
            is_active: true
        },

        orderBy: [
            {
                is_default: "desc"
            },
            {
                created_at: "desc"
            }
        ]

    });

    /* ===============================
       Wallet
    =============================== */

    const wallet = await prisma.wallets.findUnique({

        where: {
            user_id: BigInt(userId)
        }

    });

    /* ===============================
       Format Favoris
    =============================== */

    const formattedFavorites = favorites.map(favorite => {

        /* ---------- Livre magasin ---------- */

        if (favorite.shop_inventory) {

            const book = favorite.shop_inventory.books_catalog;

            const cover = getCoverImage(book.book_images);

            return {

                type: "shop",

                favoriteId: Number(favorite.id),

                id: Number(favorite.shop_inventory.id),

                title: book.title,

                author: book.author,

                publisher: book.publisher,

                category: book.category,

                price: toNumber(
                    favorite.shop_inventory.selling_price
                ),

                stock: Number(
                    favorite.shop_inventory.stock_quantity || 0
                ),

                image: cover?.image_url || null

            };

        }

        /* ---------- Livre utilisateur ---------- */

        if (favorite.user_books_to_sell) {

            const book = favorite.user_books_to_sell.books_catalog;

            const cover = getCoverImage(book.book_images);

            return {

                type: "user",

                favoriteId: Number(favorite.id),

                id: Number(favorite.user_books_to_sell.id),

                title: book.title,

                author: book.author,

                publisher: book.publisher,

                category: book.category,

                price: toNumber(
                    favorite.user_books_to_sell.price
                ),

                stock: 1,

                seller: {

                    id: Number(
                        favorite.user_books_to_sell.users.id
                    ),

                    first_name:
                        favorite.user_books_to_sell.users.first_name,

                    last_name:
                        favorite.user_books_to_sell.users.last_name,

                    avatar:
                        favorite.user_books_to_sell.users.avatar_url

                },

                image: cover?.image_url || null

            };

        }

        return null;

    }).filter(Boolean);

    /* ===============================
       Retour
    =============================== */

    return {

        favorites: formattedFavorites,

        addresses: addresses.map(address => ({

            id: Number(address.id),

            uuid: address.uuid,

            label: address.label,

            recipient_name: address.recipient_name,

            phone: address.phone,

            country: address.country,

            region: address.region,

            city: address.city,

            district: address.district,

            street: address.street,

            building: address.building,

            apartment: address.apartment,

            postal_code: address.postal_code,

            latitude: address.latitude
                ? Number(address.latitude)
                : null,

            longitude: address.longitude
                ? Number(address.longitude)
                : null,

            is_default: address.is_default

        })),

        wallet: serializeWallet(wallet),

        deliveryPrice: 0

    };

}
/* ==========================================================
   GET
   Recherche des livres
========================================================== */

export async function searchBooksService(keyword = "") {

    const search = keyword.trim();

    /* ===============================
       Recherche magasin
    =============================== */

    const shopBooks = await prisma.shop_inventory.findMany({

        where: {

            status: "available",

            stock_quantity: {
                gt: 0
            },

            books_catalog: {

                is_active: true,

                OR: [

                    {
                        title: {
                            contains: search
                        }
                    },

                    {
                        author: {
                            contains: search
                        }
                    },

                    {
                        publisher: {
                            contains: search
                        }
                    },

                    {
                        category: {
                            contains: search
                        }
                    },

                    {
                        isbn: {
                            contains: search
                        }
                    }

                ]

            }

        },

        include: {

            books_catalog: {

                include: {
                    book_images: true
                }

            }

        },

        take: 30,

        orderBy: {
            created_at: "desc"
        }

    });

    /* ===============================
       Recherche livres utilisateurs
    =============================== */

    const userBooks = await prisma.user_books_to_sell.findMany({

        where: {

            status: "available",

            books_catalog: {

                is_active: true,

                OR: [

                    {
                        title: {
                            contains: search
                        }
                    },

                    {
                        author: {
                            contains: search
                        }
                    },

                    {
                        publisher: {
                            contains: search
                        }
                    },

                    {
                        category: {
                            contains: search
                        }
                    },

                    {
                        isbn: {
                            contains: search
                        }
                    }

                ]

            }

        },

        include: {

            books_catalog: {

                include: {
                    book_images: true
                }

            },

            users: {

                select: {

                    id: true,

                    first_name: true,

                    last_name: true,

                    avatar_url: true

                }

            }

        },

        take: 30,

        orderBy: {
            created_at: "desc"
        }

    });

    /* ===============================
       Format livres magasin
    =============================== */

    const formattedShopBooks = shopBooks.map(item => {

        const book = item.books_catalog;

        const cover = getCoverImage(
            book.book_images
        );

        return {

            type: "shop",

            id: Number(item.id),

            title: book.title,

            author: book.author,

            publisher: book.publisher,

            category: book.category,

            price: toNumber(
                item.selling_price
            ),

            stock: Number(
                item.stock_quantity || 0
            ),

            image: cover?.image_url || null,

            created_at: item.created_at

        };

    });

    /* ===============================
       Format livres utilisateurs
    =============================== */

    const formattedUserBooks = userBooks.map(item => {

        const book = item.books_catalog;

        const cover = getCoverImage(
            book.book_images
        );

        return {

            type: "user",

            id: Number(item.id),

            title: book.title,

            author: book.author,

            publisher: book.publisher,

            category: book.category,

            price: toNumber(
                item.price
            ),

            stock: 1,

            seller: {

                id: Number(item.users.id),

                first_name:
                    item.users.first_name,

                last_name:
                    item.users.last_name,

                avatar:
                    item.users.avatar_url

            },

            image: cover?.image_url || null,

            created_at: item.created_at

        };

    });

    /* ===============================
       Fusion
    =============================== */

    const books = [

        ...formattedShopBooks,

        ...formattedUserBooks

    ];

    books.sort((a, b) => {

        return (
            new Date(b.created_at) -
            new Date(a.created_at)
        );

    });

    return books;

}
/* ==========================================================
   Helpers
========================================================== */

async function validateCommandeItems(items = []) {

    if (!Array.isArray(items) || items.length === 0) {

        throw new Error("Aucun livre sélectionné.");

    }

    const validatedItems = [];

    let productsTotal = 0;

    for (const item of items) {

        const quantity = Number(item.quantity || 1);

        if (quantity <= 0) {

            throw new Error("Quantité invalide.");

        }

        /* =====================================================
           LIVRE MAGASIN
        ===================================================== */

        if (item.type === "shop") {

            const shopBook = await prisma.shop_inventory.findUnique({

                where: {
                    id: BigInt(item.id)
                },

                include: {

                    books_catalog: {

                        include: {
                            book_images: true
                        }

                    }

                }

            });

            if (!shopBook) {

                throw new Error("Livre magasin introuvable.");

            }

            if (shopBook.status !== "available") {

                throw new Error(
                    `${shopBook.books_catalog.title} n'est plus disponible.`
                );

            }

            if (Number(shopBook.stock_quantity) < quantity) {

                throw new Error(
                    `Stock insuffisant pour ${shopBook.books_catalog.title}.`
                );

            }

            const unitPrice = toNumber(shopBook.selling_price);

            const subtotal = unitPrice * quantity;

            productsTotal += subtotal;

            validatedItems.push({

                type: "shop",

                shop_inventory_id: Number(shopBook.id),

                user_book_to_sell_id: null,

                quantity,

                unitPrice,

                subtotal,

                title: shopBook.books_catalog.title,

                stock: Number(shopBook.stock_quantity)

            });

            continue;

        }

        /* =====================================================
           LIVRE UTILISATEUR
        ===================================================== */

        if (item.type === "user") {

            const userBook = await prisma.user_books_to_sell.findUnique({

                where: {
                    id: BigInt(item.id)
                },

                include: {

                    books_catalog: {

                        include: {
                            book_images: true
                        }

                    }

                }

            });

            if (!userBook) {

                throw new Error("Livre utilisateur introuvable.");

            }

            if (userBook.status !== "available") {

                throw new Error(
                    `${userBook.books_catalog.title} n'est plus disponible.`
                );

            }

            if (quantity > 1) {

                throw new Error(
                    `Le livre "${userBook.books_catalog.title}" est un exemplaire unique.`
                );

            }

            const unitPrice = toNumber(userBook.price);

            const subtotal = unitPrice;

            productsTotal += subtotal;

            validatedItems.push({

                type: "user",

                shop_inventory_id: null,

                user_book_to_sell_id: Number(userBook.id),

                quantity: 1,

                unitPrice,

                subtotal,

                title: userBook.books_catalog.title

            });

            continue;

        }

        throw new Error("Type de livre invalide.");

    }

    return {

        items: validatedItems,

        productsTotal

    };

}

/* ==========================================================
   Helpers
========================================================== */

async function validateAddress(userId, addressId) {

    const address = await prisma.user_addresses.findFirst({

        where: {

            id: BigInt(addressId),

            user_id: BigInt(userId),

            is_active: true

        }

    });

    if (!address) {

        throw new Error("Adresse de livraison introuvable.");

    }

    return address;

}

/* ==========================================================
   Helpers
========================================================== */

async function validateWallet(userId, paymentType, totalPrice) {

    const wallet = await prisma.wallets.findUnique({

        where: {

            user_id: BigInt(userId)

        }

    });

    if (paymentType !== "wallet") {

        return wallet;

    }

    if (!wallet) {

        throw new Error("Wallet introuvable.");

    }

    if (wallet.status !== "active") {

        throw new Error("Votre wallet est bloqué.");

    }

    if (toNumber(wallet.balance) < totalPrice) {

        throw new Error("Solde insuffisant.");

    }

    return wallet;

}
/* ==========================================================
   POST
   Création d'une commande
========================================================== */

export async function createCommandeService({

    userId,
    addressId,
    paymentType,
    items

}) {

    /* ==========================================
       Validation des livres
    ========================================== */

    const {

        items: validatedItems,

        productsTotal

    } = await validateCommandeItems(items);

    /* ==========================================
       Adresse
    ========================================== */

    const address = await validateAddress(
        userId,
        addressId
    );

    /* ==========================================
       Calcul livraison (aligné avec magazine-user)
       On calcule à partir de l'adresse par défaut,
       comme le fait getDeliveryInfoService.
    ========================================== */

    const delivery = await getDeliveryInfoService(
        userId,
        "shop",
        addressId
    );

    const deliveryPrice = Number(delivery.deliveryPrice);

    const totalPrice = productsTotal + deliveryPrice;

    /* ==========================================
       Wallet
    ========================================== */

    const wallet = await validateWallet(

        userId,

        paymentType,

        totalPrice

    );

    /* ==========================================
       Transaction
    ========================================== */

    return await prisma.$transaction(async (tx) => {

        /* ======================================
           Tableau des achats créés
        ====================================== */

        const achatsIds = [];

        /* ======================================
           Création user_achat
        ====================================== */

        for (const item of validatedItems) {

            const achat = await tx.user_achat.create({

                data: {

                    user_id: BigInt(userId),

                    shop_inventory_id:

                        item.shop_inventory_id
                            ? BigInt(item.shop_inventory_id)
                            : null,

                    user_book_to_sell_id:

                        item.user_book_to_sell_id
                            ? BigInt(item.user_book_to_sell_id)
                            : null,

                    quantity: item.quantity,

                    unit_price: item.unitPrice

                }

            });

            achatsIds.push(

                Number(achat.id)

            );

        }

        /* ======================================
           Suite
           (commande + wallet + stock)
        ====================================== */
                /* ======================================
           Création user_commandes
        ====================================== */

        const commande = await tx.user_commandes.create({

            data: {

                user_id: BigInt(userId),

                achats_json: JSON.stringify(achatsIds),

                delivery_price: deliveryPrice,

                total_price: totalPrice,

                payment_type: paymentType,

                payment_status:
                    paymentType === "wallet"
                        ? "paid"
                        : "pending",

                order_status: "pending"
            }

        });

        /* ======================================
           Paiement Wallet
        ====================================== */

        if (paymentType === "wallet") {

            const balanceBefore = toNumber(
                wallet.balance
            );

            const balanceAfter =
                balanceBefore - totalPrice;

            await tx.wallets.update({

                where: {

                    id: wallet.id

                },

                data: {

                    balance: balanceAfter

                }

            });

            await tx.wallet_transactions.create({

                data: {

                    wallet_id: wallet.id,

                    transaction_type: "purchase",

                    amount: totalPrice,

                    balance_before: balanceBefore,

                    balance_after: balanceAfter,

                    description:
                        `Commande #${commande.id}`,

                    reference:
                        `USER_COMMANDE_${commande.id}`

                }

            });

        }

        /* ======================================
           Mise à jour du stock
        ====================================== */

        for (const item of validatedItems) {

            /* ---------- Livre magasin ---------- */

            if (item.type === "shop") {

                const newStock =
                    item.stock - item.quantity;

                await tx.shop_inventory.update({

                    where: {

                        id: BigInt(
                            item.shop_inventory_id
                        )

                    },

                    data: {

                        stock_quantity: newStock,

                        status:
                            newStock > 0
                                ? "available"
                                : "out_of_stock"

                    }

                });

                continue;

            }

            /* ---------- Livre utilisateur ---------- */

            await tx.user_books_to_sell.update({

                where: {

                    id: BigInt(
                        item.user_book_to_sell_id
                    )

                },

                data: {

                    status: "unavailable"

                }

            });

        }
                /* ======================================
           Retour
        ====================================== */

        return {

            id: Number(commande.id),

            userId: Number(userId),

            achats: achatsIds,

            address: {

                id: Number(address.id),

                recipient_name: address.recipient_name,

                phone: address.phone,

                city: address.city,

                district: address.district,

                street: address.street,

                building: address.building,

                apartment: address.apartment,

                postal_code: address.postal_code

            },

            productsTotal,

            deliveryPrice,

            totalPrice,

            paymentType,

            paymentStatus:

                paymentType === "wallet"
                    ? "paid"
                    : "pending",

            orderStatus: "pending"

        };

    });

}
