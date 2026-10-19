import express from "express";

import {

    authenticate

} from "../middleware/auth.middleware.js";

import {

    getMyBookDetail,

    deleteMyBookDetail

} from "../controllers/mybook_detail.controller.js";

const router = express.Router();

/*
==========================================================
MY BOOK DETAIL (FOR DELETE)
==========================================================
*/

router.get(

    "/:type/:id",

    authenticate,

    getMyBookDetail

);

router.delete(

    "/:type/:id",

    authenticate,

    deleteMyBookDetail

);

export default router;

