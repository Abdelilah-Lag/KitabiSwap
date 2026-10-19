import {
    getExchangeBooksService,
    getExchangeBookService,
    getMyBooksService,
    createExchangeRequestService,
    getExchangeRequestPageService
} from "../services/exchange.service.js";

import { acceptExchangeRequestService } from "../services/exchangeRequests.service.js";


/* ===================================================
   Liste des livres disponibles pour échange
=================================================== */

export async function getExchangeBooks(req, res) {

    try {

        const books = await getExchangeBooksService(

            req.query,
            req.user.id

        );

        return res.status(200).json({

            success: true,

            books

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Erreur serveur."

        });

    }

}

/* ===================================================
   Détails d'un livre
=================================================== */

export async function getExchangeBook(req, res) {

    try {

        const book = await getExchangeBookService(

            Number(req.params.id),

            req.user.id

        );

        if (!book) {

            return res.status(404).json({

                success: false,

                message: "Livre introuvable."

            });

        }

        return res.status(200).json(book);

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Erreur serveur."

        });

    }

}

/* ===================================================
   Mes livres disponibles
=================================================== */

export async function getMyBooks(req, res) {

    try {

        const books = await getMyBooksService(

            req.user.id

        );

        return res.status(200).json({

            success: true,

            books

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Erreur serveur."

        });

    }

}

/* ===================================================
   Créer une demande d'échange
=================================================== */

export async function createExchangeRequest(req, res) {

    try {

        const exchange = await createExchangeRequestService(

            req.user.id,

            req.body

        );

        return res.status(201).json({

            success: true,

            message: "Demande d'échange envoyée.",

            exchange

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message || "Erreur serveur."

        });

    }

}

/* ===================================================
   Page de sélection (livres demandés + mes livres)
=================================================== */
export async function getExchangeRequestPage(req, res) {

    try {

        const data = await getExchangeRequestPageService(

            Number(req.params.bookId),

            req.user.id

        );

        if (!data) {

            return res.status(404).json({

                success: false,

                message: "Livre introuvable."

            });

        }

        return res.status(200).json({

            success: true,

            ...data

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Erreur serveur."

        });

    }

}

/* ===================================================
   Accepter une demande d'échange (receiver)
=================================================== */
export async function acceptExchangeRequest(req, res) {

    try {

        const result = await acceptExchangeRequestService(

            req.user.id,

            req.params.id

        );

        return res.status(200).json({

            success: true,

            message: "Demande acceptée.",

            exchangeRequest: result

        });

    }

    catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message || "Erreur lors de l'acceptation."

        });

    }

}


