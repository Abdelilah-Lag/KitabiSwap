import {
    getCommandeInitService,
    searchBooksService,
    createCommandeService
} from "../services/userCommande.service.js";

/* ==========================================================
   GET
   Initialisation de la page commande
========================================================== */

export async function getCommandeInitController(req, res) {

    try {

        const userId = req.user.id;

        const data = await getCommandeInitService(userId);

        return res.status(200).json({
            success: true,
            ...data
        });

    } catch (error) {

        console.error("GET COMMANDE INIT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Erreur lors du chargement des données."
        });

    }

}

/* ==========================================================
   GET
   Recherche des livres
========================================================== */

export async function searchBooksController(req, res) {

    try {

        const keyword = req.query.q || "";

        const books = await searchBooksService(keyword);

        return res.status(200).json({
            success: true,
            books
        });

    } catch (error) {

        console.error("SEARCH BOOKS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Erreur lors de la recherche."
        });

    }

}

/* ==========================================================
   POST
   Création d'une commande
========================================================== */

export async function createCommandeController(req, res) {

    try {

        const userId = req.user.id;

        const {
            addressId,
            paymentType,
            items
        } = req.body;

        const commande = await createCommandeService({
            userId,
            addressId,
            paymentType,
            items
        });

        return res.status(201).json({
            success: true,
            message: "Commande créée avec succès.",
            commande
        });

    } catch (error) {

        console.error("CREATE COMMANDE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Erreur lors de la création de la commande."
        });

    }

}