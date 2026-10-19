import axios from "axios";

/* ==========================================================
   API
========================================================== */

const API_URL = "http://localhost:5000/api/user/commande";

/* ==========================================================
   Token
========================================================== */

function getAuthConfig() {

    const token = localStorage.getItem("token");

    return {

        headers: {

            Authorization: `Bearer ${token}`

        }

    };

}

/* ==========================================================
   GET
   Initialisation de la page
========================================================== */

export async function getCommandeInit() {

    const response = await axios.get(

        `${API_URL}/init`,

        getAuthConfig()

    );

    return response.data;

}

/* ==========================================================
   GET
   Recherche des livres
========================================================== */

export async function searchBooks(keyword) {

    const response = await axios.get(

        `${API_URL}/search`,

        {

            ...getAuthConfig(),

            params: {

                q: keyword

            }

        }

    );

    return response.data;

}

/* ==========================================================
   POST
   Création commande
========================================================== */

export async function createCommande(payload) {

    const response = await axios.post(

        API_URL,

        payload,

        getAuthConfig()

    );

    return response.data;

}


