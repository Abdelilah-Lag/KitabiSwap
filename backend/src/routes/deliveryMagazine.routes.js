import express from "express";


import {

    getDeliveryMagazineOrdersController,

    takeDeliveryMagazineOrderController,

    getDeliveryMagazineUserCommandesController

} from "../controllers/deliveryMagazine.controller.js";



import { authenticate } from "../middleware/auth.middleware.js";



const router = express.Router();





/*
====================================================
 GET COMMANDES DISPONIBLES LIVRAISON MAGAZINE
====================================================
*/

router.get(

    "/orders",

    authenticate,

    getDeliveryMagazineOrdersController

);




router.get(

    "/user-commandes",

    authenticate,

    getDeliveryMagazineUserCommandesController

);





/*
====================================================
 PRENDRE UNE COMMANDE
====================================================
*/

router.post(

    "/take",

    authenticate,

    takeDeliveryMagazineOrderController

);






export default router;