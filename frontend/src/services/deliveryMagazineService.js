import axios from "axios";


const API_URL = "http://localhost:5000/api";



/*
==========================================================
GET DELIVERY MAGAZINE ORDERS
==========================================================
*/

export async function getDeliveryMagazineOrders() {


    const token = localStorage.getItem("token");



    const { data } = await axios.get(


        `${API_URL}/delivery-magazine/orders`,


        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }


    );



    return data;

}







/*
==========================================================
TAKE DELIVERY MAGAZINE ORDER
==========================================================
*/

export async function takeDeliveryMagazineOrder({

    source,

    id

}) {


    const token = localStorage.getItem("token");



    const { data } = await axios.post(


        `${API_URL}/delivery-magazine/take`,


        {


            source,

            id


        },


        {


            headers: {

                Authorization: `Bearer ${token}`

            }


        }


    );



    return data;

}
/*
==========================================================
GET USER COMMANDES DELIVERY
==========================================================
*/

export async function getDeliveryMagazineUserCommandes() {


    const token = localStorage.getItem("token");



    const { data } = await axios.get(


        `${API_URL}/delivery-magazine/user-commandes`,


        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }


    );



    return data;

}