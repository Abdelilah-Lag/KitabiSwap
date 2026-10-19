import { Router } from "express";


import {

    getWalletTransactionsController

} from "../controllers/paymentTransaction.controller.js";



import {

    authenticate,

    authorize

} from "../middleware/auth.middleware.js";





const router = Router();





/*
==========================================================
WALLET TRANSACTIONS
==========================================================
*/



/*
    GET
    Toutes les transactions wallet

    Pagination:
    ?page=1
    ?limit=25

    Recherche:
    ?search=nom/email

    Filtre:
    ?type=recharge
    ?date=2026-07-19

*/


router.get(

    "/",

    authenticate,

    authorize("payment_manager"),

    getWalletTransactionsController

);





export default router;