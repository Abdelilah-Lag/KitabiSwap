import prisma from "../config/prisma.js";

/* ==========================================================
   LOCALISATION DU MAGASIN KITABISWAP
========================================================== */

const STORE_LOCATION = {

    latitude: 33.892974,
    longitude: -6.932944

};

/* ==========================================================
   CONVERSION BIGINT
========================================================== */

function safeBigInt(value) {

    return BigInt(value);

}

/* ==========================================================
   CALCUL DISTANCE (Haversine)
========================================================== */

function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;

    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =

        Math.sin(dLat / 2) ** 2 +

        Math.cos(lat1 * Math.PI / 180) *

        Math.cos(lat2 * Math.PI / 180) *

        Math.sin(dLon / 2) ** 2;

    return Number(

        (R * 2 * Math.atan2(

            Math.sqrt(a),

            Math.sqrt(1 - a)

        )).toFixed(1)

    );

}

/* ==========================================================
   CALCUL PRIX LIVRAISON
========================================================== */

export function calculateDeliveryPrice(distance) {

    if (distance <= 10) return 15;
    if (distance <= 20) return 20;
    if (distance <= 30) return 25;
    if (distance <= 40) return 30;
    if (distance <= 50) return 35;
    if (distance <= 60) return 40;
    if (distance <= 70) return 45;
    if (distance <= 80) return 50;
    if (distance <= 90) return 55;
    if (distance <= 100) return 60;
    if (distance <= 110) return 65;
    if (distance <= 120) return 70;
    if (distance <= 130) return 75;
    if (distance <= 140) return 80;
    if (distance <= 150) return 85;
    if (distance <= 160) return 90;
    if (distance <= 170) return 95;
    if (distance <= 180) return 100;
    if (distance <= 190) return 105;
    if (distance <= 200) return 110;
    if (distance <= 220) return 120;
    if (distance <= 240) return 130;
    if (distance <= 260) return 140;
    if (distance <= 280) return 150;

    return 160;

}

/* ==========================================================
   CHARGER TOUS LES LIVRES DU MAGAZINE
========================================================== */

export async function getMagazineBooksService(userId) {

    const favorites = userId

        ? await prisma.favorites.findMany({

            where: {

                user_id: safeBigInt(userId)

            }

        })

        : [];

    const favoriteShopIds = favorites.map(f =>

        Number(f.shop_inventory_id)

    );

    const favoriteUserBookIds = favorites.map(f =>

        Number(f.user_book_to_sell_id)

    );

    /* ============================
       LIVRES DU MAGASIN
    ============================ */

    const shopBooks = await prisma.shop_inventory.findMany({

        where: {

            status: "available",

            stock_quantity: {

                gt: 0

            }

        },

        include: {

            books_catalog: true

        },

        orderBy: {

            created_at: "desc"

        }

    });


    /* ============================
       LIVRES DES UTILISATEURS
    ============================ */

    const userBooks = await prisma.user_books_to_sell.findMany({

        where: {

            status: "available"

        },

        include: {

            books_catalog: true,

            users: {

                select: {

                    id: true,

                    first_name: true,

                    last_name: true

                }

            }

        },

        orderBy: {

            created_at: "desc"

        }

    });

    /* ============================
       FORMAT SHOP
    ============================ */

    const formattedShopBooks = await Promise.all(

        shopBooks.map(async (book) => {

            const cover = await prisma.book_images.findFirst({

                where: {
                    book_catalog_id: book.book_catalog_id,
                    
                    is_cover: true

                }

            });

            return {

                id: Number(book.id),

                type: "shop",

                title: book.books_catalog.title,

                author: book.books_catalog.author,

                price: Number(book.selling_price),

                old_price: Number(book.old_price),

                stock: book.stock_quantity,

                featured: book.featured,

                cover: cover?.image_url || null,

                favorite: favoriteShopIds.includes(Number(book.id))

            };

        })

    );


    /* ============================
       FORMAT USER
    ============================ */

    const formattedUserBooks = await Promise.all(

        userBooks.map(async (book) => {

            const cover = await prisma.book_images.findFirst({

                where: {

                    uploaded_by: book.user_id,
                    book_catalog_id: book.book_catalog_id,
                    is_cover: true

                }

            });

            return {

                id: Number(book.id),

                type: "user",

                title: book.books_catalog.title,

                author: book.books_catalog.author,

                price: Number(book.price),

                condition: book.book_condition,

                seller: `${book.users.first_name} ${book.users.last_name}`,

                cover: cover?.image_url || null,

                favorite: favoriteUserBookIds.includes(Number(book.id))

            };

        })

    );


    return {

        shopBooks: formattedShopBooks,

        userBooks: formattedUserBooks

    };

}
/* ==========================================================
   DETAILS D'UN LIVRE
========================================================== */

export async function getBookDetailsService(

    userId,
    type,
    id

) {

    let book = null;

    /* =====================================================
       LIVRE MAGASIN
    ===================================================== */

    if (type === "shop") {

        book = await prisma.shop_inventory.findUnique({

            where: {

                id: safeBigInt(id)

            },

            include: {

                books_catalog: {

                    include: {

                        book_images: true

                    }

                }

            }

        });

        if (!book) {

            throw new Error("Livre introuvable.");

        }

        const images = await prisma.book_images.findMany({

            where: {
                book_catalog_id: book.book_catalog_id

            },

            orderBy: {

                sort_order: "asc"

            }

        });

        return {

            id: Number(book.id),

            type: "shop",

            title: book.books_catalog.title,

            subtitle: book.books_catalog.subtitle,

            author: book.books_catalog.author,

            publisher: book.books_catalog.publisher,

            edition: book.books_catalog.edition,

            publication_year: book.books_catalog.publication_year,

            language: book.books_catalog.language,

            category: book.books_catalog.category,

            isbn: book.books_catalog.isbn,

            description: book.books_catalog.description,

            pages: book.books_catalog.pages,

            cover_type: book.books_catalog.cover_type,

            target_audience: book.books_catalog.target_audience,

            selling_price: Number(book.selling_price),

            old_price: Number(book.old_price),

            stock: book.stock_quantity,

            featured: book.featured,

            seller: "KitabiSwap",

            images: images.map(image => ({

                id: Number(image.id),

                image_url: image.image_url,

                is_cover: image.is_cover

            }))

        };


    }

    /* =====================================================
       LIVRE UTILISATEUR
    ===================================================== */

    if (type === "user") {

        book = await prisma.user_books_to_sell.findUnique({

            where: {

                id: safeBigInt(id)

            },

            include: {

                users: {

                    select: {

                        id: true,

                        first_name: true,

                        last_name: true,

                        phone: true

                    }

                },

                books_catalog: {

                    include: {

                        book_images: true

                    }

                }

            }

        });

        if (!book) {

            throw new Error("Livre introuvable.");

        }

        const images = await prisma.book_images.findMany({

            where: {

                uploaded_by: book.user_id,
               book_catalog_id: book.book_catalog_id


            },

            orderBy: {

                sort_order: "asc"

            }

        });

        return {

            id: Number(book.id),

            type: "user",

            title: book.books_catalog.title,

            subtitle: book.books_catalog.subtitle,

            author: book.books_catalog.author,

            publisher: book.books_catalog.publisher,

            edition: book.books_catalog.edition,

            publication_year: book.books_catalog.publication_year,

            language: book.books_catalog.language,

            category: book.books_catalog.category,

            isbn: book.books_catalog.isbn,

            description: book.books_catalog.description,

            pages: book.books_catalog.pages,

            cover_type: book.books_catalog.cover_type,

            target_audience: book.books_catalog.target_audience,

            condition: book.book_condition,

            price: Number(book.price),

            seller: {

                id: Number(book.users.id),

                name:

                    book.users.first_name +

                    " " +

                    book.users.last_name,

                phone: book.users.phone

            },

            images: images.map(image => ({

                id: Number(image.id),

                image_url: image.image_url,

                is_cover: image.is_cover

            }))

        };


    }

    throw new Error("Type de livre invalide.");

}

/* ==========================================================
   CALCUL LIVRAISON
========================================================== */

export async function getDeliveryInfoService(

    userId,

    type,

    id

) {

    // IMPORTANT: la livraison doit être calculée à partir de l'adresse par défaut
    // (on n'utilise pas l'adresse sélectionnée côté frontend).
    const address = await prisma.user_addresses.findFirst({

        where: {

            user_id: safeBigInt(userId),

            is_default: true

        }

    });


    if (!address) {

        throw new Error(

            "Aucune adresse par défaut."

        );

    }

    if (

        address.latitude === null ||

        address.longitude === null

    ) {

        throw new Error(

            "Votre adresse ne possède pas de coordonnées GPS."

        );

    }

    const distance = calculateDistance(

        Number(address.latitude),

        Number(address.longitude),

        STORE_LOCATION.latitude,

        STORE_LOCATION.longitude

    );

    const deliveryPrice =

        calculateDeliveryPrice(distance);

    return {
        distance,
        deliveryPrice,
        latitude: STORE_LOCATION.latitude,
        longitude: STORE_LOCATION.longitude
    };

}

/* ==========================================================
   AJOUT / SUPPRESSION FAVORIS
========================================================== */

export async function toggleFavoriteService(userId, body) {

    const {

        type,
        id

    } = body;

    let where = {

        user_id: safeBigInt(userId)

    };

    if (type === "shop") {

        where.shop_inventory_id = safeBigInt(id);

    }

    else {

        where.user_book_to_sell_id = safeBigInt(id);

    }

    const favorite = await prisma.favorites.findFirst({

        where

    });

    if (favorite) {

        await prisma.favorites.delete({

            where: {

                id: favorite.id

            }

        });

        return {

            favorite: false

        };

    }

    await prisma.favorites.create({

        data: where

    });

    return {

        favorite: true

    };

}

/* ==========================================================
   CREER UNE COMMANDE
========================================================== */

export async function getBuyBookDataService(

    userId,

    type,

    id

) {

    const book = await getBookDetailsService(userId, type, id);

    // Address (default)

    const address = await prisma.user_addresses.findFirst({

        where: {

            user_id: safeBigInt(userId),

            is_default: true

        }

    });

    if (!address) {

        throw new Error("Aucune adresse par défaut.");

    }

    if (address.latitude === null || address.longitude === null) {

        throw new Error("Votre adresse ne possède pas de coordonnées GPS.");

    }

    const distance = calculateDistance(

        Number(address.latitude),

        Number(address.longitude),

        STORE_LOCATION.latitude,

        STORE_LOCATION.longitude

    );

    const delivery_price = calculateDeliveryPrice(distance);

    const wallet = await prisma.wallets.findFirst({

        where: {

            user_id: safeBigInt(userId)

        }

    });

    const book_price =

        type === "shop"

            ? Number(book.selling_price ?? book.price)

            : Number(book.price);

    // Contract: stock & seller normalization

    const normalizedBook = {

        id: book.id,

        type,

        title: book.title,

        author: book.author,

        cover: book.images?.length > 0 ? book.images[0].image_url : book.cover ?? null,

        price: book_price,

        stock:

            type === "shop"

                ? Number(book.stock)

                : 1,

        seller:

            type === "shop"

                ? null

                : `${book.seller?.name ?? ""}`.trim()

    };

    const formattedAddress = {

        id: Number(address.id),

        recipient_name: address.recipient_name,

        phone: address.phone,

        street: address.street,

        district: address.district,

        city: address.city,

        region: address.region,

        postal_code: address.postal_code,

        latitude: Number(address.latitude),

        longitude: Number(address.longitude)

    };

    const walletPayload = {

        balance: Number(wallet?.balance ?? 0)

    };

    return {

        book: normalizedBook,

        address: formattedAddress,

        wallet: walletPayload,

        delivery: {

            distance,

            price: delivery_price

        },

        summary: {

            book_price,

            delivery_price,

            total: Number(book_price + delivery_price)

        }

    };

}

export async function createBookOrderService(

    userId,

    body

) {

    const {

        type,
        id,
        quantity,
        payment_method

    } = body;

    /* ============================
       Livraison
    ============================ */

    const delivery = await getDeliveryInfoService(

        userId,
        type,
        id

    );

    let bookPrice = 0;

    let totalPrice = 0;

    /* ============================
       Livre magasin
    ============================ */

    if (type === "shop") {

        const shopBook = await prisma.shop_inventory.findUnique({

            where: {

                id: safeBigInt(id)

            }

        });

        if (!shopBook) {

            throw new Error("Livre introuvable.");

        }

        if (shopBook.stock_quantity < quantity) {

            throw new Error(

                "Stock insuffisant."

            );

        }

        bookPrice = Number(

            shopBook.selling_price

        );

        totalPrice =

            bookPrice * quantity +

            delivery.deliveryPrice;

        /* ======================
           Paiement Wallet
        ====================== */

        if (payment_method === "wallet") {

            const wallet = await prisma.wallets.findFirst({

                where: {

                    user_id: safeBigInt(userId)

                }

            });

            if (!wallet) {

                throw new Error(

                    "Wallet introuvable."

                );

            }

            if (

                Number(wallet.balance) < totalPrice

            ) {

                throw new Error(

                    "Solde insuffisant."

                );

            }

            await prisma.wallets.update({

                where: {

                    id: wallet.id

                },

                data: {

                    balance:

                        Number(wallet.balance) -

                        totalPrice

                }

            });

            const balanceBefore = wallet.balance;

            const balanceAfter =

                Number(balanceBefore) - totalPrice;

            await prisma.wallet_transactions.create({

                data: {

                    wallet_id: wallet.id,

                    amount: totalPrice,

                    transaction_type: "purchase",

                    balance_before: balanceBefore,

                    balance_after: balanceAfter,

                    description:

                        "Achat d'un livre",

                    reference: `order_${Date.now()}`

                }

            });

        }

        /* ======================

           Création commande

        ====================== */

        const order = await prisma.book_orders.create({

            data: {

                shop_inventory_id: shopBook.id,

                user_book_to_sell_id: null,

                user_id: safeBigInt(userId),

                quantity,

                price:

                    bookPrice * quantity,

                delivery_price:

                    delivery.deliveryPrice,

                payment_method,

                status: "en_cours"

            }

        });

        /* ======================
           Mise à jour stock
        ====================== */

        await prisma.shop_inventory.update({

            where: {

                id: shopBook.id

            },

            data: {

                stock_quantity:

                    shopBook.stock_quantity -

                    quantity

            }

        });

        return order;

    }

    /* ============================
       Livre utilisateur
    ============================ */

    const userBook =

        await prisma.user_books_to_sell.findUnique({

            where: {

                id: safeBigInt(id)

            }

        });

    if (!userBook) {

        throw new Error(

            "Livre introuvable."

        );

    }

    bookPrice = Number(

        userBook.price

    );

    totalPrice =

        bookPrice +

        delivery.deliveryPrice;

    /* ============================
       Paiement Wallet
    ============================ */

    if (payment_method === "wallet") {

        const wallet =

            await prisma.wallets.findFirst({

                where: {

                    user_id:

                        safeBigInt(userId)

                }

            });

        if (!wallet) {

            throw new Error(

                "Wallet introuvable."

            );

        }

        if (

            Number(wallet.balance) < totalPrice

        ) {

            throw new Error(

                "Solde insuffisant."

            );

        }

        await prisma.wallets.update({

            where: {

                id: wallet.id

            },

            data: {

                balance:

                    Number(wallet.balance) -

                    totalPrice

            }

        });

        const balanceBefore = wallet.balance;

        const balanceAfter =

            Number(balanceBefore) - totalPrice;

        await prisma.wallet_transactions.create({

            data: {

                wallet_id: wallet.id,

                amount: totalPrice,

                transaction_type: "purchase",

                balance_before: balanceBefore,

                balance_after: balanceAfter,

                description:

                    "Achat livre utilisateur",

                reference: `order_${Date.now()}`

            }

        });

    }

    /* ============================

       Création commande

    ============================ */

    const order = await prisma.book_orders.create({

        data: {

            shop_inventory_id: null,

            user_book_to_sell_id: userBook.id,

            user_id: safeBigInt(userId),

            quantity: 1,

            price: bookPrice,

            delivery_price:

                delivery.deliveryPrice,

            payment_method,

            status: "en_cours"

        }

    });

    /* ============================
       Livre vendu
    ============================ */

    await prisma.user_books_to_sell.update({

        where: {

            id: userBook.id

        },

        data: {

            status: "unavailable"

        }

    });

    return order;

}
