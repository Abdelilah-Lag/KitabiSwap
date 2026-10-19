import {

    listUserBooksToSellService,

    getUserBookToSellDetailsService,

    deleteUserBookToSellService

} from "../services/warehouseUserBooksToSell.service.js";

/*
==========================================================
GET USER BOOKS TO SELL
==========================================================
*/

export async function getUserBooksToSell(req, res) {

    try {

        const {

            page = 1,

            pageSize = 25,

            q = "",

            status,

            condition

        } = req.query;

        const data = await listUserBooksToSellService({

            page: Number(page),

            pageSize: Number(pageSize),

            q,

            status,

            condition

        });

        return res.status(200).json({

            success: true,

            ...data

        });

    } catch (error) {

        console.error(

            "GET_USER_BOOKS_TO_SELL_ERROR:",

            error

        );

        return res.status(400).json({

            success: false,

            message:

                error.message ||

                "Erreur lors du chargement."

        });

    }

}

/*
==========================================================
GET USER BOOK TO SELL DETAILS
==========================================================
*/

export async function getUserBookToSellDetails(req, res) {

    try {

        const data = await getUserBookToSellDetailsService(

            req.params.id

        );

        return res.status(200).json({

            success: true,

            data

        });

    } catch (error) {

        console.error(

            "GET_USER_BOOK_TO_SELL_DETAILS_ERROR:",

            error

        );

        return res.status(400).json({

            success: false,

            message:

                error.message ||

                "Erreur lors du chargement."

        });

    }

}

/*
==========================================================
DELETE USER BOOK TO SELL
==========================================================
*/

export async function deleteUserBookToSell(req, res) {

    try {

        const data = await deleteUserBookToSellService(

            req.params.id

        );

        return res.status(200).json(data);

    } catch (error) {

        console.error(

            "DELETE_USER_BOOK_TO_SELL_ERROR:",

            error

        );

        return res.status(400).json({

            success: false,

            message:

                error.message ||

                "Erreur lors de la suppression."

        });

    }

}