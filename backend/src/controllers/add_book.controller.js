import * as addBookService from "../services/add_book.service.js";

/*
==========================================================
SEARCH BOOK CATALOG
GET:
/api/book-submissions/catalog/search?q=value
==========================================================
*/

export async function searchBookCatalog(req, res) {

    try {

        const search = req.query.q || "";

        const books = await addBookService.searchBookCatalog(search);

        return res.status(200).json(books);

    } catch (error) {

        console.error("SEARCH BOOK CATALOG ERROR:", error);

        return res.status(500).json({

            success: false,

            message: "Erreur lors de la recherche des livres."

        });

    }

}

/*
==========================================================
CREATE BOOK SUBMISSION
POST:
/api/book-submissions
multipart/form-data
==========================================================
*/

export async function createBookSubmission(req, res) {

    try {

 

        if (!req.user) {

            return res.status(401).json({

                success: false,

                message: "Utilisateur non authentifié."

            });

        }

        if (req.files && req.files.length > 0) {


            console.log({
                fieldname: req.files[0].fieldname,
                originalname: req.files[0].originalname,
                mimetype: req.files[0].mimetype,
                size: req.files[0].size,
                isBuffer: Buffer.isBuffer(req.files[0].buffer)
            });

        }

        const userId = req.user.id;


        const submission = await addBookService.createBookSubmission({

            userId,

            data: req.body,

            files: req.files || [],

            coverIndex: req.body.cover_index

        });


        return res.status(201).json({

            success: true,

            message: "Demande de livre créée avec succès.",

            data: submission

        });

    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message || "Erreur lors de la création de la demande."

        });

    }

}

/*
==========================================================
GET USER SUBMISSIONS
GET:
/api/book-submissions/my-submissions
==========================================================
*/

export async function getMyBookSubmissions(req, res) {

    try {

        if (!req.user) {

            return res.status(401).json({

                success: false,

                message: "Utilisateur non authentifié."

            });

        }

        const userId = req.user.id;

        const submissions = await addBookService.getUserSubmissions(userId);

        return res.status(200).json({

            success: true,

            data: submissions

        });

    } catch (error) {

        console.error("GET MY SUBMISSIONS ERROR:", error);

        return res.status(500).json({

            success: false,

            message: error.message || "Erreur récupération des demandes."

        });

    }

}

/*
==========================================================
GET SUBMISSION DETAILS
GET:
/api/book-submissions/:id
==========================================================
*/

export async function getBookSubmissionById(req, res) {

    try {

        if (!req.user) {

            return res.status(401).json({

                success: false,

                message: "Utilisateur non authentifié."

            });

        }

        const userId = req.user.id;

        const { id } = req.params;

        const submission = await addBookService.getSubmissionById({

            id,

            userId

        });

        if (!submission) {

            return res.status(404).json({

                success: false,

                message: "Demande introuvable."

            });

        }

        return res.status(200).json({

            success: true,

            data: submission

        });

    } catch (error) {

        console.error("GET SUBMISSION DETAILS ERROR:", error);

        return res.status(500).json({

            success: false,

            message: error.message || "Erreur lors de la récupération."

        });

    }

}

/*
==========================================================
DELETE SUBMISSION
DELETE:
/api/book-submissions/:id
==========================================================
*/

export async function deleteBookSubmission(req, res) {

    try {

        if (!req.user) {

            return res.status(401).json({

                success: false,

                message: "Utilisateur non authentifié."

            });

        }

        const userId = req.user.id;

        const { id } = req.params;

        const result = await addBookService.deleteSubmission({

            id,

            userId

        });

        return res.status(200).json({

            success: true,

            message: "Demande supprimée avec succès.",

            data: result

        });

    } catch (error) {

        console.error("DELETE SUBMISSION ERROR:", error);

        return res.status(400).json({

            success: false,

            message: error.message || "Impossible de supprimer la demande."

        });

    }

}