import axios from "axios";

const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

function apiBase() {

    return API || "http://localhost:5000";

}

function config() {

    return {

        headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`

        }

    };

}

/*
==========================================================
GET USER BOOKS TO SELL
==========================================================
*/

export async function getUserBooksToSell({

    page = 1,

    pageSize = 25,

    q,

    status,

    condition

} = {}) {

    const params = {

        page,

        pageSize,

        ...(q ? { q } : {}),

        ...(status ? { status } : {}),

        ...(condition ? { condition } : {})

    };

    const response = await axios.get(

        `${apiBase()}/api/warehouse/user-books-to-sell`,

        {

            ...config(),

            params

        }

    );

    return response.data;

}

/*
==========================================================
GET USER BOOK TO SELL DETAILS
==========================================================
*/

export async function getUserBookToSellDetails(id) {

    const response = await axios.get(

        `${apiBase()}/api/warehouse/user-books-to-sell/${id}`,

        config()

    );

    return response.data;

}

/*
==========================================================
DELETE USER BOOK TO SELL
==========================================================
*/

export async function deleteUserBookToSell(id) {

    const response = await axios.delete(

        `${apiBase()}/api/warehouse/user-books-to-sell/${id}`,

        config()

    );

    return response.data;

}