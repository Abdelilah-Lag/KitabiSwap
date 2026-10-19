import {

    toggleFavorite,
    getUserFavorites

} from "../services/favorite.service.js";

/* ==========================================
   TOGGLE FAVORITE
========================================== */

async function toggle(req, res) {

    try {

        const result = await toggleFavorite(

            req.user.id,

            req.body

        );

        return res.status(200).json({

            success: true,

            ...result

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

/* ==========================================
   GET USER FAVORITES
========================================== */

async function getFavorites(req, res) {

    try {

        const favorites = await getUserFavorites(

            req.user.id

        );

        return res.status(200).json({

            success: true,

            favorites

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

export {

    toggle,

    getFavorites

};