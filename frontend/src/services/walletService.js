import axios from "axios";

const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

function apiBase() {
    // VITE_API_URL doit pointer vers le backend (ex: http://localhost:5000)
    // Les routes côté backend sont montées sous /api.
    if (API) return API;
    return "http://localhost:5000";
}



/*
==========================================================
AUTH HEADER
==========================================================
*/

function getConfig(isMultipart = false) {

    const token = localStorage.getItem("token");

    return {

        headers: {

            Authorization: `Bearer ${token}`,

            ...(isMultipart
                ? {
                    "Content-Type": "multipart/form-data"
                }
                : {})

        }

    };

}

/*
==========================================================
GET PAYMENT METHODS
==========================================================
*/

export async function getPaymentMethods() {

    const response = await axios.get(

        `${apiBase()}/api/wallet/payment-methods`,

        getConfig()


    );

    return response.data;

}

/*
==========================================================
CREATE RECHARGE REQUEST
==========================================================
*/

export async function createRechargeRequest({

    amount,

    proof

}) {

    const formData = new FormData();

    formData.append(

        "amount",

        amount

    );

    formData.append(

        "proof",

        proof

    );

    const response = await axios.post(

        `${apiBase()}/api/wallet/recharge`,

        formData,

        getConfig(true)

    );


    return response.data;

}

/*
==========================================================
GET RECHARGE HISTORY
==========================================================
*/

export async function getRechargeHistory() {

    const response = await axios.get(

        `${apiBase()}/api/wallet/history`,

        {
            ...getConfig(),
            headers: {
                ...getConfig().headers,
                // prevent browser/XHR caching that can cause 304 and stale/empty UI
                'Cache-Control': 'no-cache, no-store, max-age=0',
                Pragma: 'no-cache',
            },
        }
    );

    return response.data;

}


/*
==========================================================
GET WALLET BALANCE
==========================================================
*/

export async function getWalletBalance() {

    const response = await axios.get(

        `${apiBase()}/api/wallet`,

        getConfig()


    );

    return response.data;

}

