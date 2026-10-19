import axios from "axios";

const API_URL = "http://localhost:5000/api";

/*
==========================================================
GET USER DELIVERY ORDERS
==========================================================
*/

export async function getDeliveryUserOrders() {

    const token =
        localStorage.getItem("token");

    const { data } =

        await axios.get(

            `${API_URL}/delivery-user-orders`,

            {

                headers: {

                    Authorization:

                        `Bearer ${token}`

                }

            }

        );

    return data;

}

/*
==========================================================
TAKE DELIVERY ORDER
==========================================================
*/

export async function takeDeliveryUserOrder(

    orderId

) {

    const token =
        localStorage.getItem("token");

    const { data } =

        await axios.post(

            `${API_URL}/delivery-user-orders/${orderId}/take`,

            {},

            {

                headers: {

                    Authorization:

                        `Bearer ${token}`

                }

            }

        );

    return data;

}