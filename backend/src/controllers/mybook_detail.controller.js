import {

    getMyBookDetailService,

    deleteMyBookDetailService

} from "../services/mybook_detail.service.js";

/*
==========================================================
GET DETAIL
==========================================================
*/

export async function getMyBookDetail(req, res) {

    try {

        const { type, id } = req.params;

        const data = await getMyBookDetailService({

            userId: req.user.id,

            type,

            id

        });

        return res.status(200).json({

            success: true,

            ...data

        });

    }

    catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}

/*
==========================================================
DELETE
==========================================================
*/

export async function deleteMyBookDetail(req, res) {

    try {

        const { type, id } = req.params;

        await deleteMyBookDetailService({

            userId: req.user.id,

            type,

            id

        });

        return res.status(200).json({

            success: true,

            message: "Book deleted"

        });

    }

    catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}

