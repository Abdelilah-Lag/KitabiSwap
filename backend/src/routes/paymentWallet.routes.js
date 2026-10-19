import { Router } from "express";


import {

    getUserWalletsController,

    creditWalletController,

    debitWalletController

} from "../controllers/paymentWallet.controller.js";



import {

    authenticate,

    authorize

} from "../middleware/auth.middleware.js";



const router = Router();





/*
==========================================================
PAYMENT MANAGER - USER WALLETS
==========================================================
*/







/*
==========================================================
GET ALL USER WALLETS
==========================================================

GET

/api/payment-manager/wallets

*/

router.get(

    "/",

    authenticate,

    authorize("payment_manager"),

    getUserWalletsController

);








/*
==========================================================
CREDIT WALLET
==========================================================

PATCH

/api/payment-manager/wallets/:id/credit

BODY:

{
    amount:100,
    description:"..."
}

*/

router.patch(

    "/:id/credit",

    authenticate,

    authorize("payment_manager"),

    creditWalletController

);










/*
==========================================================
DEBIT WALLET
==========================================================

PATCH

/api/payment-manager/wallets/:id/debit

BODY:

{
    amount:50,
    description:"..."
}

*/

router.patch(

    "/:id/debit",

    authenticate,

    authorize("payment_manager"),

    debitWalletController

);





export default router;