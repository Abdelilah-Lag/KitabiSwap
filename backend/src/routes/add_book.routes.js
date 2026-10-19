import express from "express";


import {

    searchBookCatalog,

    createBookSubmission,

    getMyBookSubmissions,

    getBookSubmissionById,

    deleteBookSubmission

} from "../controllers/add_book.controller.js";


import { authenticate } from "../middleware/auth.middleware.js";


import upload from "../middleware/upload.middleware.js";



const router = express.Router();





/*
==========================================================

SEARCH BOOK CATALOG

Utilisé par :

BookCatalogSearch.jsx


Méthode :

GET


URL :

/api/book-submissions/catalog/search?q=clean


Description :

Recherche les livres disponibles dans :

- books_catalog
- book_images


==========================================================
*/


router.get(

    "/catalog/search",

    searchBookCatalog

);







/*
==========================================================

CREATE BOOK SUBMISSION


Utilisé par :

AddBookSubmission.jsx


Méthode :

POST


URL :

/api/book-submissions


Content-Type :

multipart/form-data



Champs reçus :

BOOK INFORMATION

- book_catalog_id
- isbn
- title
- subtitle
- author
- publisher
- edition
- publication_year
- language
- category


BOOK DETAILS

- book_type
- cover_type
- target_audience
- pages
- pages_color
- dimensions
- weight


REQUEST

- request_type
- book_condition
- estimated_price
- price


DESCRIPTION

- summary
- description
- search_keywords


FILES

images[]


COVER

cover_index


==========================================================
*/


router.post(

    "/",

    authenticate,

    upload.array(

        "images",

        10

    ),

    createBookSubmission

);







/*
==========================================================

GET MY BOOK SUBMISSIONS


Méthode :

GET


URL :

/api/book-submissions/my-submissions


Retour :

Toutes les demandes du user connecté


==========================================================
*/


router.get(

    "/my-submissions",

    authenticate,

    getMyBookSubmissions

);







/*
==========================================================

GET BOOK SUBMISSION DETAILS


Méthode :

GET


URL :

/api/book-submissions/:id


Exemple :

/api/book-submissions/15


==========================================================
*/


router.get(

    "/:id",

    authenticate,

    getBookSubmissionById

);







/*
==========================================================

DELETE BOOK SUBMISSION


Méthode :

DELETE


URL :

/api/book-submissions/:id


Conditions dans service :

- utilisateur propriétaire
- status = pending


==========================================================
*/


router.delete(

    "/:id",

    authenticate,

    deleteBookSubmission

);






export default router;