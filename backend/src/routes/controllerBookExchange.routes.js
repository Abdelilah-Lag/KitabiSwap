import { Router } from "express";


import {

    getControllerExchangeBooksController,
    deleteControllerExchangeBookController

} from "../controllers/controllerBookExchange.controller.js";


import {

    authenticate,
    authorize

} from "../middleware/auth.middleware.js";



const router = Router();



router.get(

    "/",

    authenticate,

    authorize("controller"),

    getControllerExchangeBooksController

);



router.delete(

    "/:id",

    authenticate,

    authorize("controller"),

    deleteControllerExchangeBookController

);



export default router;