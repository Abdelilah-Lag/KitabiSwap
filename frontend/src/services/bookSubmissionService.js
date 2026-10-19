import axios from "axios";

/* ==========================================================
   API CONFIGURATION
========================================================== */

const API_URL = "http://localhost:5000/api/book-submissions";

/* ==========================================================
   AXIOS INSTANCE
========================================================== */

const api = axios.create({

    baseURL: API_URL,

    headers: {

        "Content-Type": "multipart/form-data"

    }

});

/* ==========================================================
   AUTH HEADER
========================================================== */

function getConfig() {

    const token = localStorage.getItem("token");

    return {

        headers: {

            Authorization: `Bearer ${token}`

        }

    };

}

/* ==========================================================
   CREATE FORM DATA
========================================================== */

function buildFormData({

    formData,

    images,

    coverIndex

}) {

    const data = new FormData();
        /* ==========================================================
       BOOK INFORMATIONS
    ========================================================== */

    data.append("book_catalog_id", formData.bookCatalogId || "");

    data.append("request_type", formData.requestType);

    data.append("book_condition", formData.book_condition);

    data.append("estimated_price", formData.estimatedPrice || "");

    data.append("price", formData.price || "");

    data.append("isbn", formData.isbn || "");

    data.append("title", formData.title || "");

    data.append("subtitle", formData.subtitle || "");

    data.append("author", formData.author || "");

    data.append("publisher", formData.publisher || "");

    data.append("edition", formData.edition || "");

    data.append("publication_year", formData.publicationYear || "");

    data.append("language", formData.language || "");

    data.append("category", formData.category || "");

    data.append("book_type", formData.bookType || "");

    data.append("cover_type", formData.coverType || "");

    data.append("target_audience", formData.targetAudience || "");

    data.append("pages", formData.pages || "");

    data.append("pages_color", formData.pagesColor || "");

    data.append("dimensions", formData.dimensions || "");

    data.append("weight", formData.weight || "");

    data.append("description", formData.description || "");

    data.append("summary", formData.summary || "");

    data.append("search_keywords", formData.searchKeywords || "");
        /* ==========================================================
       BOOK IMAGES
    ========================================================== */

    

images.forEach((image, index) => {



    data.append("images", image.file);

});

    /* ==========================================================
       COVER IMAGE INDEX
    ========================================================== */

    data.append("cover_index", coverIndex);

    return data;

}

/* ==========================================================
   CREATE BOOK SUBMISSION
========================================================== */

export async function createBookSubmission({

    formData,

    images,

    coverIndex

}) {

    const data = buildFormData({

        formData,

        images,

        coverIndex

    });

    const response = await api.post(

        "/",

        data,

        getConfig()

    );

    return response.data;

}

/* ==========================================================
   SEARCH BOOK CATALOG
========================================================== */

export async function searchBookCatalog(search) {

    const response = await axios.get(

        "http://localhost:5000/api/book-submissions/catalog/search",

        {

            params: {

                q: search

            }

        }

    );

    return response.data;

}

/* ==========================================================
   GET MY SUBMISSIONS
========================================================== */

export async function getMyBookSubmissions() {

    const response = await api.get(

        "/my-submissions",

        getConfig()

    );

    return response.data;

}

/* ==========================================================
   GET SUBMISSION DETAILS
========================================================== */

export async function getBookSubmission(id) {

    const response = await api.get(

        `/${id}`,

        getConfig()

    );

    return response.data;

}

/* ==========================================================
   DELETE SUBMISSION
========================================================== */

export async function deleteBookSubmission(id) {

    const response = await api.delete(

        `/${id}`,

        getConfig()

    );

    return response.data;

}