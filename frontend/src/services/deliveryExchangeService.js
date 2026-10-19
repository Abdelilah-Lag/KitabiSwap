import axios from "axios";

const API_URL = "http://localhost:5000/api";

/*
==========================================================
GET DELIVERY EXCHANGE ORDERS
==========================================================
*/

export async function getDeliveryExchangeOrders() {

    const token = localStorage.getItem("token");

    const { data } = await axios.get(

        `${API_URL}/delivery-exchange`,

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
TAKE DELIVERY EXCHANGE
==========================================================
*/

export async function takeDeliveryExchangeOrder(

    exchangeDeliveryId

) {

    const token = localStorage.getItem("token");

    const { data } = await axios.post(

        `${API_URL}/delivery-exchange/${exchangeDeliveryId}/take`,

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