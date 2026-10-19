import axios from "axios";

/*
==========================================================
GET DELIVERY DASHBOARD
==========================================================
*/

export async function getDeliveryDashboard() {

    const token = localStorage.getItem("token");

    const { data } = await axios.get(

        "http://localhost:5000/api/delivery",

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    return data;

}