import {

    getMyBooksService

} from "../services/my_books.service.js";

/*
==========================================================
MES LIVRES
==========================================================
*/

export async function getMyBooks(req, res) {

    try {

        const books = await getMyBooksService(

            req.user.id

        );

        return res.status(200).json({

            success: true,

            ...books

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