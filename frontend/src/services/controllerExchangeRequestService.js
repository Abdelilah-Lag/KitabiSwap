import axios from "axios";


/* ======================================================
   API CONFIGURATION
====================================================== */


const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");


function apiBase() {

    return API || "http://localhost:5000";

}



function authConfig() {

    return {

        headers: {

            Authorization:
                `Bearer ${localStorage.getItem("token")}`

        }

    };

}



/* ======================================================
   GET PENDING EXCHANGE REQUESTS
====================================================== */

/*
    Récupérer toutes les demandes
    d'échange en attente
*/


export async function getPendingExchangeRequests() {


    const response = await axios.get(

        `${apiBase()}/api/controller/exchange-request`,

        authConfig()

    );


    return response.data;

}





/* ======================================================
   START COLLECTING BOOKS
====================================================== */

/*
    Commencer la collecte des livres
*/


export async function startCollectingBooks(

    deliveryId

) {


    const response = await axios.put(

        `${apiBase()}/api/controller/exchange-request/${deliveryId}/collect`,

        {},

        authConfig()

    );


    return response.data;

}





/* ======================================================
   REJECT EXCHANGE REQUEST
====================================================== */

/*
    Refuser une demande d'échange
*/


export async function rejectExchangeRequest(

    deliveryId,

    reason

) {


    const response = await axios.put(

        `${apiBase()}/api/controller/exchange-request/${deliveryId}/reject`,

        {

            reason

        },

        authConfig()

    );


    return response.data;

}