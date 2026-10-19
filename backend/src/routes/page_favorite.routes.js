import express from "express";


import {

    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite

} from "../controllers/page_favorite.controller.js";


import {
    authenticate
} from "../middleware/auth.middleware.js";



const router = express.Router();





/*
==========================================================
 GET USER FAVORITES
==========================================================
*/

router.get(

    "/",

    authenticate,

    getFavorites

);





/*
==========================================================
 ADD BOOK TO FAVORITES
==========================================================
*/

router.post(

    "/:bookId",

    authenticate,

    addFavorite

);





/*
==========================================================
 REMOVE BOOK FROM FAVORITES
==========================================================
*/

router.delete(

    "/:bookId",

    authenticate,

    removeFavorite

);





/*
==========================================================
 CHECK IF BOOK IS FAVORITE
==========================================================
*/

router.get(

    "/check/:bookId",

    authenticate,

    checkFavorite

);





export default router;