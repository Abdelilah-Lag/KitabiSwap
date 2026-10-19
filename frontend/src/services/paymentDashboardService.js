import axios from "axios";

/*
==========================================================
GET PAYMENT DASHBOARD
==========================================================
*/

export async function getPaymentDashboard() {

    const token = localStorage.getItem("token");

    const response = await axios.get(

        "http://localhost:5000/api/payment-manager/dashboard",

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    return response.data;

}