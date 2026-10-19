import axios from "axios";

const API_URL = "http://localhost:5000/api";

/*
==========================================================
GET MY DELIVERIES
==========================================================
*/

export async function getMyDeliveries(){

    const token =

        localStorage.getItem("token");

    const { data } =

        await axios.get(

            `${API_URL}/delivery-tracking`,

            {

                headers:{

                    Authorization:

                        `Bearer ${token}`

                }

            }

        );

    return data;

}

/*
==========================================================
COMPLETE DELIVERY
==========================================================
*/

export async function completeDelivery(

    deliveryId

){

    const token =

        localStorage.getItem("token");

    const { data } =

        await axios.put(

            `${API_URL}/delivery-tracking/${deliveryId}/complete`,

            {},

            {

                headers:{

                    Authorization:

                        `Bearer ${token}`

                }

            }

        );

    return data;

}