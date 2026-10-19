import axios from "axios";

/*
==========================================================
   CONFIGURATION API
==========================================================
*/

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

/*
==========================================================
   AJOUT JWT AUTOMATIQUE
==========================================================
*/

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);

/*
==========================================================
   GET ORDERS
==========================================================
*/

export async function listWarehouseOrders() {

    try {

        const response = await api.get("/warehouse/orders/");

        return response.data;

    } catch (error) {

        console.error(
            "Erreur récupération commandes warehouse :",
            error
        );

        throw error;
    }

}

/*
==========================================================
   APPROVE ORDER
==========================================================
*/

export async function approveWarehouseOrder(orderIdOrPayload, maybeSource) {

    const payload =
        typeof orderIdOrPayload === "object"
            ? orderIdOrPayload
            : {
                  orderId: orderIdOrPayload,
                  source: maybeSource,
              };

    const { orderId, source } = payload;

    console.log("Payload =", payload);
    console.log(
        "URL =",
        `/warehouse/orders/${source}/${orderId}/approve`
    );

    try {

        const response = await api.patch(
            `/warehouse/orders/${source}/${orderId}/approve`
        );

        console.log(
            "approveWarehouseOrder response.data =",
            response?.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "Erreur validation commande :",
            error
        );

        throw error;
    }

}

/*
==========================================================
   REJECT ORDER
==========================================================
*/

export async function rejectWarehouseOrder(orderIdOrPayload, maybeSource) {

    const payload =
        typeof orderIdOrPayload === "object"
            ? orderIdOrPayload
            : {
                  orderId: orderIdOrPayload,
                  source: maybeSource,
              };

    const { orderId, source } = payload;

    console.log("Payload =", payload);
    console.log(
        "URL =",
        `/warehouse/orders/${source}/${orderId}/reject`
    );

    try {

        const response = await api.patch(
            `/warehouse/orders/${source}/${orderId}/reject`
        );

        console.log(
            "rejectWarehouseOrder response.data =",
            response?.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "Erreur refus commande :",
            error
        );

        throw error;
    }

}

export default api;