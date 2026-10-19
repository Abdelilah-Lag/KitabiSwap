import axios from "axios";

const API_URL = "http://localhost:5000/api/payment-manager/recharge-requests";

/*
==========================================================
GET RECHARGE REQUESTS
==========================================================
*/

export async function getRechargeRequests({

    page = 1,

    limit = 25,

    search = "",

    status = ""

}) {

    const token = localStorage.getItem("token");

    const response = await axios.get(

        API_URL,

        {

            headers: {

                Authorization: `Bearer ${token}`

            },

            params: {

                page,

                limit,

                search,

                status

            }

        }

    );

    return response.data;

}

/*
==========================================================
APPROVE RECHARGE REQUEST
==========================================================
*/

export async function approveRechargeRequest(id) {

    const token = localStorage.getItem("token");

    const response = await axios.patch(

        `${API_URL}/${id}/approve`,

        {},

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    return response.data;

}

/*
==========================================================
REJECT RECHARGE REQUEST
==========================================================
*/

export async function rejectRechargeRequest(

    id,

    reason

) {

    const token = localStorage.getItem("token");

    const response = await axios.patch(

        `${API_URL}/${id}/reject`,

        {

            reason

        },

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    return response.data;

}