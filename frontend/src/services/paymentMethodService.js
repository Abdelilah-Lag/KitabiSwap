import axios from "axios";


const API_URL =

    "http://localhost:5000/api/payment-manager/payment-methods";



/*
==========================================================
GET PAYMENT METHODS
==========================================================
*/

export async function getPaymentMethods({

    page = 1,

    limit = 25,

    search = "",

    status = ""

} = {}) {


    const token = localStorage.getItem("token");



    const response = await axios.get(

        API_URL,

        {

            headers: {

                Authorization:

                    `Bearer ${token}`

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
CREATE PAYMENT METHOD
==========================================================
*/

export async function createPaymentMethod(

    formData

) {


    const token = localStorage.getItem("token");



    const response = await axios.post(

        API_URL,

        formData,

        {

            headers: {

                Authorization:

                    `Bearer ${token}`,



                "Content-Type":

                    "multipart/form-data"


            }

        }

    );



    return response.data;


}







/*
==========================================================
UPDATE PAYMENT METHOD
==========================================================
*/

export async function updatePaymentMethod(

    id,

    formData

) {


    const token = localStorage.getItem("token");



    const response = await axios.put(

        `${API_URL}/${id}`,

        formData,

        {

            headers: {

                Authorization:

                    `Bearer ${token}`,



                "Content-Type":

                    "multipart/form-data"


            }

        }

    );



    return response.data;


}







/*
==========================================================
DELETE PAYMENT METHOD
==========================================================
*/

export async function deletePaymentMethod(

    id

) {


    const token = localStorage.getItem("token");



    const response = await axios.delete(

        `${API_URL}/${id}`,

        {

            headers: {

                Authorization:

                    `Bearer ${token}`

            }

        }

    );



    return response.data;


}