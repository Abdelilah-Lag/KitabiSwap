import {

    getMagazineBooksService,
    getBookDetailsService,
    toggleFavoriteService,
    getDeliveryInfoService,
    createBookOrderService,
    getBuyBookDataService

} from "../services/magazine_user.service.js";

/* =====================================================
   JSON SERIALIZE BIGINT (prisma)
===================================================== */

function serializeBigInt(value) {

    return JSON.parse(JSON.stringify(value, (_key, v) =>

        typeof v === "bigint" ? v.toString() : v

    ));

}

/* =====================================================
   Charger tous les livres
===================================================== */

export async function getMagazineBooks(req, res) {

    try {

        const userId = req.user?.id || null;

        const books = await getMagazineBooksService(userId);

        return res.status(200).json({

            success: true,

            shopBooks: books.shopBooks,

            userBooks: books.userBooks

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

/* =====================================================
   Détails d'un livre
===================================================== */

export async function getBookDetails(req, res) {

    try {

        const userId = req.user?.id || null;

        const { type, id } = req.params;

        const book = await getBookDetailsService(

            userId,

            type,

            id

        );

        return res.status(200).json({

            success: true,

            book

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

/* =====================================================
   Ajouter / supprimer favoris
===================================================== */

export async function toggleFavorite(req, res) {

    try {

        const result = await toggleFavoriteService(

            req.user.id,

            req.body

        );

        return res.status(200).json({

            success: true,

            favorite: result

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

/* =====================================================
   Calcul livraison
===================================================== */

export async function getDeliveryInfo(req, res) {

    try {

        const delivery = await getDeliveryInfoService(

            req.user.id,

            req.params.type,

            req.params.id

        );

        return res.status(200).json({

            success: true,

            delivery

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

/* =====================================================
   BUY BOOK (shop + user)
===================================================== */

export async function getBuyBook(req, res) {

    try {

        const userId = req.user?.id || null;

        const { type, id } = req.params;

        const data = await getBuyBookDataService(userId, type, id);

        return res.status(200).json({

            success: true,

            ...data

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

/* =====================================================
   Commander un livre
===================================================== */

export async function createBookOrder(req, res) {

    try {

        const order = await createBookOrderService(

            req.user.id,

            req.body

        );

        return res.status(201).json({

            success: true,

            order: serializeBigInt(order)

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
