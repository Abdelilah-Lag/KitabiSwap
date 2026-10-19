import {

    getFavoritesService,
    addFavoriteService,
    removeFavoriteService,
    checkFavoriteService

} from "../services/page_favorite.service.js";





/*
==========================================================
 GET USER FAVORITES
==========================================================
*/

export async function getFavorites(req, res) {


    try {


        const userId = req.user.id;



        const favorites = await getFavoritesService(userId);



        return res.status(200).json({

            success:true,

            favorites

        });



    } catch(error) {


        console.error(
            "GET FAVORITES CONTROLLER ERROR:",
            error
        );


        return res.status(500).json({

            success:false,

            message:"Erreur lors de la récupération des favoris"

        });


    }

}






/*
==========================================================
 ADD FAVORITE
==========================================================
*/

export async function addFavorite(req, res) {


    try {


        const userId = req.user.id;


        const { bookId } = req.params;



        const favorite = await addFavoriteService(

            userId,

            BigInt(bookId)

        );



        return res.status(201).json({

            success:true,

            message:"Livre ajouté aux favoris",

            favorite

        });



    } catch(error) {


        console.error(
            "ADD FAVORITE CONTROLLER ERROR:",
            error
        );



        return res.status(500).json({

            success:false,

            message:error.message

        });


    }

}






/*
==========================================================
 REMOVE FAVORITE
==========================================================
*/

export async function removeFavorite(req, res) {


    try {


        const userId = req.user.id;


        const { bookId } = req.params;



        await removeFavoriteService(

            userId,

            BigInt(bookId)

        );



        return res.status(200).json({

            success:true,

            message:"Livre supprimé des favoris"

        });



    } catch(error) {


        console.error(
            "REMOVE FAVORITE CONTROLLER ERROR:",
            error
        );



        return res.status(500).json({

            success:false,

            message:error.message

        });


    }

}







/*
==========================================================
 CHECK FAVORITE
==========================================================
*/

export async function checkFavorite(req, res) {


    try {


        const userId = req.user.id;


        const { bookId } = req.params;



        const exists = await checkFavoriteService(

            userId,

            BigInt(bookId)

        );



        return res.status(200).json({

            success:true,

            isFavorite:exists

        });



    } catch(error) {


        console.error(
            "CHECK FAVORITE CONTROLLER ERROR:",
            error
        );



        return res.status(500).json({

            success:false,

            message:error.message

        });


    }

}