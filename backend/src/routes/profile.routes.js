import express from "express";
import multer from "multer";

import { authenticate } from "../middleware/auth.middleware.js";

import {

    getProfile,
    updatePersonalInformation,
    updateAddress,
    uploadAvatar,
    changePassword,
    deleteAccount

} from "../controllers/profile.controller.js";

const router = express.Router();

/*
==========================================================
MULTER CONFIGURATION
==========================================================
*/

const upload = multer({

    storage: multer.memoryStorage(),

    limits: {

        fileSize: 10 * 1024 * 1024

    }

});

/*
==========================================================
GET PROFILE
==========================================================
*/

router.get(

    "/",

    authenticate,

    getProfile

);

/*
==========================================================
UPDATE PERSONAL INFORMATION
==========================================================
*/

router.put(

    "/personal",

    authenticate,

    updatePersonalInformation

);

/*
==========================================================
UPDATE ADDRESS
==========================================================
*/

router.put(

    "/address",

    authenticate,

    updateAddress

);

/*
==========================================================
UPLOAD AVATAR
==========================================================
*/

router.post(

    "/avatar",

    authenticate,

    upload.single("avatar"),

    uploadAvatar

);

/*
==========================================================
CHANGE PASSWORD
==========================================================
*/

router.put(

    "/password",

    authenticate,

    changePassword

);

/*
==========================================================
DELETE ACCOUNT
==========================================================
*/

router.put(

    "/delete",

    authenticate,

    deleteAccount

);

export default router;